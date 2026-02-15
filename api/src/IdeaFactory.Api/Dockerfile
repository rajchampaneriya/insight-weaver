FROM mcr.microsoft.com/dotnet/nightly/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/nightly/sdk:10.0 AS build
WORKDIR /src

COPY ["src/IdeaFactory.Api/IdeaFactory.Api.csproj", "src/IdeaFactory.Api/"]
COPY ["src/IdeaFactory.ServiceDefaults/IdeaFactory.ServiceDefaults.csproj", "src/IdeaFactory.ServiceDefaults/"]
RUN dotnet restore "src/IdeaFactory.Api/IdeaFactory.Api.csproj"

COPY . .
WORKDIR "/src/src/IdeaFactory.Api"
RUN dotnet build "IdeaFactory.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IdeaFactory.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IdeaFactory.Api.dll"]
