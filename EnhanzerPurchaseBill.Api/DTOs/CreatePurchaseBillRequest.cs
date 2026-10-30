using System.ComponentModel.DataAnnotations;

namespace EnhanzerPurchaseBill.Api.DTOs;

public class CreatePurchaseBillRequest
{
    [Required]
    [MinLength(1)]
    public List<PurchaseBillItemRequest> Items { get; set; } = new();
}

public class PurchaseBillItemRequest
{
    [Required]
    public string ItemName { get; set; } = string.Empty;

    [Required]
    public string BatchCode { get; set; } = string.Empty;

    [Range(typeof(decimal), "0", "999999999")]
    public decimal StandardCost { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal StandardPrice { get; set; }

    [Range(1, 1000000)]
    public int Quantity { get; set; }

    [Range(typeof(decimal), "0", "100")]
    public decimal Discount { get; set; }
}