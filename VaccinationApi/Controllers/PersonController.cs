using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VaccinationApi.Data;
using VaccinationApi.Models;

namespace VaccinationApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PersonController : ControllerBase
{
    private readonly AppDbContext _context;

    public PersonController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.People.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Person person)
    {
        // Verifica se CPF já existe (O(log n) devido ao índice)
        if (await _context.People.AnyAsync(p => p.Cpf == person.Cpf))
            return BadRequest("CPF já cadastrado.");

        _context.People.Add(person);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = person.Id }, person);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var person = await _context.People.FindAsync(id);
        if (person == null) return NotFound();

        _context.People.Remove(person);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}