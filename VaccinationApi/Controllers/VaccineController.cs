using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VaccinationApi.Data;
using VaccinationApi.Models;

namespace VaccinationApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VaccineController : ControllerBase
{
    private readonly AppDbContext _context;

    public VaccineController(AppDbContext context)
    {
        _context = context;
    }

    // Apenas retorna as vacinas que já foram criadas no Seeding
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Vaccines.ToListAsync());
    }

    // Mantemos o Create simples caso você queira adicionar uma nova manualmente no futuro
    [HttpPost]
    public async Task<IActionResult> Create(Vaccine vaccine)
    {
        _context.Vaccines.Add(vaccine);
        await _context.SaveChangesAsync();
        return Ok(vaccine);
    }
}