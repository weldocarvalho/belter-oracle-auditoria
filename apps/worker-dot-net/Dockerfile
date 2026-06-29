# Stage 1: Build and restore dependencies
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY ["Worker/ServiceWorker.csproj", "Worker/"]
COPY ["Infrastructure/ServiceWorker.Infrastructure.csproj", "Infrastructure/"]
COPY ["Application/ServiceWorker.Application.csproj", "Application/"]
COPY ["Domain/ServiceWorker.Domain.csproj", "Domain/"]

RUN dotnet restore "Worker/ServiceWorker.csproj"

COPY Worker/ Worker/
COPY Infrastructure/ Infrastructure/
COPY Application/ Application/
COPY Domain/ Domain/

WORKDIR "/src/Worker"
RUN dotnet publish "ServiceWorker.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Production runtime environment
# the runtime version
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "ServiceWorker.dll"]
