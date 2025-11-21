using Microsoft.EntityFrameworkCore;
using VaccinationApi.Models;

namespace VaccinationApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Person> People { get; set; }
    public DbSet<Vaccine> Vaccines { get; set; }
    public DbSet<VaccinationRecord> VaccinationRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configurações de Index e Relacionamento (Mantivemos igual)
        modelBuilder.Entity<Person>().HasIndex(p => p.Cpf).IsUnique();

        modelBuilder.Entity<Person>()
            .HasMany(p => p.VaccinationRecords)
            .WithOne(vr => vr.Person)
            .HasForeignKey(vr => vr.PersonId)
            .OnDelete(DeleteBehavior.Cascade);

        // --- NOVO: DATA SEEDING (Vacinas Fixas) ---
        // Assim que o banco for criado, essas linhas serão inseridas automaticamente.
        modelBuilder.Entity<Vaccine>().HasData(
            new Vaccine { Id = 1, Name = "Coronavac", Manufacturer = "Butantan" },
            new Vaccine { Id = 2, Name = "Pfizer", Manufacturer = "Pfizer" },
            new Vaccine { Id = 3, Name = "Astrazeneca", Manufacturer = "Fiocruz" },
            new Vaccine { Id = 4, Name = "Janssen", Manufacturer = "Janssen" }
        );
    }
}