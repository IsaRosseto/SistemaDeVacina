using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using VaccinationApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar Banco SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=vaccination.db"));

// 2. Configurar CORS (Para o React conseguir chamar a API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy => 
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// 3. Configurar JSON para ignorar ciclos (Evita erro de loop infinito)
builder.Services.AddControllers()
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Criar o Banco Automaticamente ao rodar (Sem precisar de comandos manuais de migration)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();