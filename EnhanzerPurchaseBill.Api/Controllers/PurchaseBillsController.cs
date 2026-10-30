using EnhanzerPurchaseBill.Api.Data;
using EnhanzerPurchaseBill.Api.DTOs;
using EnhanzerPurchaseBill.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnhanzerPurchaseBill.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PurchaseBillsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PurchaseBillsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreatePurchaseBillRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Items.Count == 0)
        {
            return BadRequest(new { message = "Please add at least one item." });
        }

        var allowedItems = new[]
        {
            "Mango", "Apple", "Banana", "Orange",
            "Grapes", "Kiwi", "Strawberry"
        };

        var batchCodes = request.Items
            .Select(x => x.BatchCode)
            .Distinct()
            .ToList();

        var validLocations = await _context.Locations
            .Where(x => batchCodes.Contains(x.Location_Code))
            .ToDictionaryAsync(x => x.Location_Code, cancellationToken);

        var billItems = new List<PurchaseBillItem>();

        foreach (var item in request.Items)
        {
            if (!allowedItems.Contains(item.ItemName))
            {
                return BadRequest(new { message = $"Invalid item: {item.ItemName}" });
            }

            if (!validLocations.TryGetValue(item.BatchCode, out var location))
            {
                return BadRequest(new { message = "Invalid batch/location selected." });
            }

            if (item.StandardCost < 0 ||
                item.StandardPrice < 0 ||
                item.Quantity <= 0 ||
                item.Discount < 0 ||
                item.Discount > 100)
            {
                return BadRequest(new { message = "Invalid item values." });
            }

            var grossCost = item.StandardCost * item.Quantity;
            var discountAmount = grossCost * item.Discount / 100m;

            billItems.Add(new PurchaseBillItem
            {
                ItemName = item.ItemName,
                BatchCode = location.Location_Code,
                BatchName = location.Location_Name,
                StandardCost = item.StandardCost,
                StandardPrice = item.StandardPrice,
                Quantity = item.Quantity,
                Discount = item.Discount,
                TotalCost = grossCost - discountAmount,
                TotalSelling = item.StandardPrice * item.Quantity
            });
        }

        var bill = new PurchaseBill
        {
            TotalItems = billItems.Count,
            TotalQuantity = billItems.Sum(x => x.Quantity),
            TotalCost = billItems.Sum(x => x.TotalCost),
            TotalSelling = billItems.Sum(x => x.TotalSelling),
            Items = billItems
        };

        _context.PurchaseBills.Add(bill);

        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            message = "Purchase bill saved successfully.",
            purchaseBillId = bill.PurchaseBillId,
            totalItems = bill.TotalItems,
            totalQuantity = bill.TotalQuantity,
            totalCost = bill.TotalCost,
            totalSelling = bill.TotalSelling
        });
    }
}