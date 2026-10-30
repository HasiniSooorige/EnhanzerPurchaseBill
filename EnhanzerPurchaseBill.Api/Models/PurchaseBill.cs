namespace EnhanzerPurchaseBill.Api.Models;

public class PurchaseBill
{
    public int PurchaseBillId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int TotalItems { get; set; }

    public int TotalQuantity { get; set; }

    public decimal TotalCost { get; set; }

    public decimal TotalSelling { get; set; }

    public List<PurchaseBillItem> Items { get; set; } = new();
}