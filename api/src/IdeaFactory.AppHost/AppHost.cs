var builder = DistributedApplication.CreateBuilder(args);

var redis = builder.AddRedis("cache");

var storage = builder.AddAzureStorage("storage")
    .RunAsEmulator();

var tables = storage.AddTables("tables");

var api = builder.AddProject<Projects.IdeaFactory_Api>("api")
    .WithReference(redis)
    .WithReference(tables)
    .WaitFor(redis)
    .WaitFor(tables)
    .WithExternalHttpEndpoints();

var ui = builder.AddViteApp("ui", "../../../ui")
    .WithNpm()
    .WithReference(api)
    .WaitFor(api)
    .WithExternalHttpEndpoints();

builder.Build().Run();
