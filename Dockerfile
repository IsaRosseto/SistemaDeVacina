# Usa a imagem do .NET 9 para construir
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia os arquivos de projeto e restaura dependências
COPY ["VaccinationApi/VaccinationApi.csproj", "VaccinationApi/"]
RUN dotnet restore "VaccinationApi/VaccinationApi.csproj"

# Copia todo o resto e faz o build
COPY . .
WORKDIR "/src/VaccinationApi"
RUN dotnet build "VaccinationApi.csproj" -c Release -o /app/build

# Publica a aplicação
FROM build AS publish
RUN dotnet publish "VaccinationApi.csproj" -c Release -o /app/publish

# Imagem final para rodar (mais leve)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expor a porta que o Render usa (ele injeta a variável PORT)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "VaccinationApi.dll"]