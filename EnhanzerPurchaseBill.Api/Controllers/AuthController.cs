using System.Text;
using System.Text.Json;
using EnhanzerPurchaseBill.Api.Data;
using EnhanzerPurchaseBill.Api.DTOs;
using EnhanzerPurchaseBill.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnhanzerPurchaseBill.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AppDbContext _context;

    public AuthController(
        IHttpClientFactory httpClientFactory,
        AppDbContext context)
    {
        _httpClientFactory = httpClientFactory;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var payload = new
        {
            API_Action = "GetLoginData",
            Device_Id = "D001",
            Sync_Time = "",
            Company_Code = request.Email,
            API_Body = new
            {
                Username = request.Email,
                Pw = request.Password
            }
        };

        try
        {
            var client = _httpClientFactory.CreateClient();

            using var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            using var response = await client.PostAsync(
                "https://ez-staging-api.azurewebsites.net/api/External_Api/POS_Api/Invoke",
                content,
                cancellationToken);

            var responseBody = await response.Content
                .ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode(
                    StatusCodes.Status502BadGateway,
                    new { message = "The external login service returned an error." });
            }

            using var document = JsonDocument.Parse(responseBody);
            var root = document.RootElement;

            if (!root.TryGetProperty("Status_Code", out var statusCode) ||
                statusCode.GetInt32() != 200)
            {
                return Unauthorized(new
                {
                    message = "Login failed. Check your credentials or account access."
                });
            }

            if (!root.TryGetProperty("Response_Body", out var responseData) ||
                responseData.ValueKind != JsonValueKind.Array ||
                responseData.GetArrayLength() == 0)
            {
                return Unauthorized(new
                {
                    message = "The login response did not contain valid user data."
                });
            }

            var user = responseData[0];

            if (!user.TryGetProperty("User_Locations", out var locations) ||
                locations.ValueKind != JsonValueKind.Array)
            {
                return BadGatewayResponse();
            }

            foreach (var item in locations.EnumerateArray())
            {
                var code = item.GetProperty("Location_Code").GetString();
                var name = item.GetProperty("Location_Name").GetString();

                if (string.IsNullOrWhiteSpace(code) ||
                    string.IsNullOrWhiteSpace(name))
                {
                    continue;
                }

                var existing = await _context.Locations
                    .FirstOrDefaultAsync(
                        x => x.Location_Code == code,
                        cancellationToken);

                if (existing is null)
                {
                    _context.Locations.Add(new Location
                    {
                        Location_Code = code,
                        Location_Name = name
                    });
                }
                else
                {
                    existing.Location_Name = name;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new
            {
                message = "Login successful.",
                user = new
                {
                    displayName = user.TryGetProperty(
                        "User_Display_Name", out var displayName)
                        ? displayName.GetString()
                        : null,
                    email = user.TryGetProperty("Email", out var email)
                        ? email.GetString()
                        : null
                },
                locations = await _context.Locations
                    .AsNoTracking()
                    .Select(x => new
                    {
                        x.Location_Code,
                        x.Location_Name
                    })
                    .ToListAsync(cancellationToken)
            });
        }
        catch (HttpRequestException)
        {
            return StatusCode(
                StatusCodes.Status502BadGateway,
                new { message = "Unable to reach the external login service." });
        }
        catch (JsonException)
        {
            return StatusCode(
                StatusCodes.Status502BadGateway,
                new { message = "The external login service returned an invalid response." });
        }
    }

    private IActionResult BadGatewayResponse()
    {
        return StatusCode(
            StatusCodes.Status502BadGateway,
            new { message = "The login response did not contain valid locations." });
    }
}