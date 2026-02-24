# Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a pull request.

## Development

```bash
dotnet run --project api/src/IdeaFactory.AppHost
```

Ensure tests pass:

```bash
cd api && dotnet test
cd ui && npm test
```

## Code Conventions

- .NET: Minimal API, `IResult` return types, `record` DTOs
- React: IBM Carbon components, React Query for API calls
- All AI endpoints must pass through PrudenceMiddleware
- No buy/sell/hold recommendations; SEBI compliance required

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed conventions.
