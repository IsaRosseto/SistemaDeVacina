namespace VaccinationApi.Models;

public class VaccinationRecord
{
    public int Id { get; set; }
    
    public int PersonId { get; set; }
    public Person? Person { get; set; }

    public int VaccineId { get; set; }
    public Vaccine? Vaccine { get; set; }

    public int Dose { get; set; }
    public DateTime ApplicationDate { get; set; } = DateTime.Now;
}