using EnhanzerPurchaseBill.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnhanzerPurchaseBill.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public LocationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLocations()
    {
        var locations = await _context.Locations
            .AsNoTracking()
            .ToListAsync();

        return Ok(locations);
    }
}