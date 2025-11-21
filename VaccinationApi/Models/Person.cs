namespace VaccinationApi.Models;

public class Person
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty; // Será nosso índice único
    
    // Lista de vacinas que essa pessoa tomou
    public List<VaccinationRecord> VaccinationRecords { get; set; } = new();
}