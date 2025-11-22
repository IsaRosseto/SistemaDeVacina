using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VaccinationApi.Data;
using VaccinationApi.Models;

namespace VaccinationApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VaccinationController : ControllerBase
{
    private readonly AppDbContext _context;

    public VaccinationController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Register(VaccinationRecord record)
    {
        // Validação O(1)
        if (record.Dose < 1 || record.Dose > 5)
            return BadRequest("Dose deve ser entre 1 e 5.");

        // Verificações O(log n) ou O(1) no banco
        var personExists = await _context.People.AnyAsync(p => p.Id == record.PersonId);
        var vaccineExists = await _context.Vaccines.AnyAsync(v => v.Id == record.VaccineId);

        if (!personExists || !vaccineExists)
            return NotFound("Pessoa ou Vacina não encontrada.");

        
        _context.VaccinationRecords.Add(record);
        await _context.SaveChangesAsync();

        return Ok(record);
    }

    [HttpGet("card/{personId}")]
    public async Task<IActionResult> GetCard(int personId)
    {
        var records = await _context.VaccinationRecords
            .Include(vr => vr.Vaccine)
            .Where(vr => vr.PersonId == personId)
            .Select(vr => new 
            {
                vr.Id,
                vr.VaccineId,
                VaccineName = vr.Vaccine.Name,
                vr.Dose,
                Date = vr.ApplicationDate
            })
            .ToListAsync();

        return Ok(records);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var record = await _context.VaccinationRecords.FindAsync(id);
        if (record == null) return NotFound();
        _context.VaccinationRecords.Remove(record);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}