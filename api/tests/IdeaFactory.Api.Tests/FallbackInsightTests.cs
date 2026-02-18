using IdeaFactory.Api.Services;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using StackExchange.Redis;

namespace IdeaFactory.Api.Tests;

public class FallbackInsightProviderTests
{
    private readonly FallbackInsightProvider _provider = new();

    [Theory]
    [InlineData("INFY", "today")]
    [InlineData("INFY", "brief")]
    [InlineData("INFY", "explain")]
    [InlineData("TCS", "today")]
    [InlineData("TCS", "brief")]
    [InlineData("TCS", "explain")]
    [InlineData("RELIANCE", "today")]
    [InlineData("RELIANCE", "brief")]
    [InlineData("RELIANCE", "explain")]
    public void GetFallbackResponse_ReturnsContent_ForDemoTickers(string ticker, string insightType)
    {
        var result = _provider.GetFallbackResponse(ticker, insightType);

        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result));
        Assert.Contains("Not investment advice", result);
    }

    [Theory]
    [InlineData("INFY", "brief")]
    [InlineData("TCS", "brief")]
    [InlineData("RELIANCE", "brief")]
    public void BriefFallback_ContainsFourPeterLynchSections(string ticker, string insightType)
    {
        var result = _provider.GetFallbackResponse(ticker, insightType);

        Assert.NotNull(result);
        Assert.Contains("**The Story**", result);
        Assert.Contains("**The Numbers**", result);
        Assert.Contains("**The Moat**", result);
        Assert.Contains("**The Risks**", result);
    }

    [Fact]
    public void GetFallbackResponse_ReturnsNull_ForUnknownTicker()
    {
        var result = _provider.GetFallbackResponse("UNKNOWN", "today");
        Assert.Null(result);
    }

    [Fact]
    public void GetFallbackResponse_ReturnsNull_ForUnknownInsightType()
    {
        var result = _provider.GetFallbackResponse("INFY", "unknown");
        Assert.Null(result);
    }

    [Fact]
    public void GetFallbackResponse_IsCaseInsensitive_ForTicker()
    {
        var upper = _provider.GetFallbackResponse("INFY", "today");
        var lower = _provider.GetFallbackResponse("infy", "today");
        Assert.Equal(upper, lower);
    }

    [Fact]
    public void GetAllFallbacks_Returns9Entries()
    {
        var all = _provider.GetAllFallbacks();
        Assert.Equal(9, all.Count);
    }

    [Theory]
    [InlineData("INFY")]
    [InlineData("TCS")]
    [InlineData("RELIANCE")]
    public void AllFallbacks_ContainINRReferences(string ticker)
    {
        var today = _provider.GetFallbackResponse(ticker, "today");
        var brief = _provider.GetFallbackResponse(ticker, "brief");

        Assert.NotNull(today);
        Assert.NotNull(brief);
        Assert.Contains("Rs", today);
        Assert.Contains("Rs", brief);
    }
}

public class AiInsightServiceFallbackTests
{
    private static AiInsightService CreateService(
        IChatClient? chatClient = null,
        IConnectionMultiplexer? redis = null,
        IFallbackInsightProvider? fallbackProvider = null)
    {
        chatClient ??= Substitute.For<IChatClient>();
        fallbackProvider ??= new FallbackInsightProvider();

        if (redis is null)
        {
            var db = Substitute.For<IDatabase>();
            db.StringGetAsync(Arg.Any<RedisKey>(), Arg.Any<CommandFlags>())
                .Returns(RedisValue.Null);
            db.StringSetAsync(
                    Arg.Any<RedisKey>(), Arg.Any<RedisValue>(),
                    Arg.Any<TimeSpan?>(), Arg.Any<bool>(),
                    Arg.Any<When>(), Arg.Any<CommandFlags>())
                .Returns(true);

            redis = Substitute.For<IConnectionMultiplexer>();
            redis.GetDatabase(Arg.Any<int>(), Arg.Any<object?>()).Returns(db);
        }

        return new AiInsightService(
            chatClient, redis, fallbackProvider,
            NullLogger<AiInsightService>.Instance);
    }

    [Fact]
    public async Task GenerateInsight_UsesFallback_WhenAiClientFails()
    {
        var chatClient = Substitute.For<IChatClient>();
        chatClient.GetResponseAsync(
                Arg.Any<IList<ChatMessage>>(),
                Arg.Any<ChatOptions?>(),
                Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("Rate limited"));

        var service = CreateService(chatClient: chatClient);

        var result = await service.GenerateInsightAsync("INFY", "brief");

        Assert.NotNull(result);
        Assert.Contains("**The Story**", result);
        Assert.Contains("Not investment advice", result);
    }

    [Fact]
    public async Task GenerateInsight_ThrowsWhenAiFails_AndNoFallbackExists()
    {
        var chatClient = Substitute.For<IChatClient>();
        chatClient.GetResponseAsync(
                Arg.Any<IList<ChatMessage>>(),
                Arg.Any<ChatOptions?>(),
                Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("Rate limited"));

        var service = CreateService(chatClient: chatClient);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.GenerateInsightAsync("UNKNOWN_TICKER", "brief"));
    }

    [Fact]
    public async Task GenerateInsight_ReturnsCachedValue_BeforeTryingAi()
    {
        var chatClient = Substitute.For<IChatClient>();
        var db = Substitute.For<IDatabase>();
        var redis = Substitute.For<IConnectionMultiplexer>();
        redis.GetDatabase(Arg.Any<int>(), Arg.Any<object?>()).Returns(db);

        db.StringGetAsync(Arg.Any<RedisKey>(), Arg.Any<CommandFlags>())
            .Returns((RedisValue)"Cached INFY analysis");

        var service = CreateService(chatClient: chatClient, redis: redis);
        var result = await service.GenerateInsightAsync("INFY", "today");

        Assert.Equal("Cached INFY analysis", result);
        await chatClient.DidNotReceive().GetResponseAsync(
            Arg.Any<IList<ChatMessage>>(),
            Arg.Any<ChatOptions?>(),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task SeedFallbackCache_PopulatesRedis_With9Entries()
    {
        var db = Substitute.For<IDatabase>();
        var redis = Substitute.For<IConnectionMultiplexer>();
        redis.GetDatabase(Arg.Any<int>(), Arg.Any<object?>()).Returns(db);

        db.StringSetAsync(
                Arg.Any<RedisKey>(), Arg.Any<RedisValue>(),
                Arg.Any<TimeSpan?>(), Arg.Any<bool>(),
                Arg.Any<When>(), Arg.Any<CommandFlags>())
            .Returns(true);

        var service = CreateService(redis: redis);

        await service.SeedFallbackCacheAsync();

        await db.Received(9).StringSetAsync(
            Arg.Any<RedisKey>(), Arg.Any<RedisValue>(),
            AiInsightService.FallbackCacheTtl,
            Arg.Any<bool>(), Arg.Any<When>(), Arg.Any<CommandFlags>());
    }

    [Fact]
    public async Task SeedFallbackCache_Uses24HourTtl()
    {
        var db = Substitute.For<IDatabase>();
        var redis = Substitute.For<IConnectionMultiplexer>();
        redis.GetDatabase(Arg.Any<int>(), Arg.Any<object?>()).Returns(db);

        db.StringSetAsync(
                Arg.Any<RedisKey>(), Arg.Any<RedisValue>(),
                Arg.Any<TimeSpan?>(), Arg.Any<bool>(),
                Arg.Any<When>(), Arg.Any<CommandFlags>())
            .Returns(true);

        var service = CreateService(redis: redis);
        await service.SeedFallbackCacheAsync();

        await db.Received().StringSetAsync(
            Arg.Any<RedisKey>(), Arg.Any<RedisValue>(),
            TimeSpan.FromHours(24),
            Arg.Any<bool>(), Arg.Any<When>(), Arg.Any<CommandFlags>());
    }
}
