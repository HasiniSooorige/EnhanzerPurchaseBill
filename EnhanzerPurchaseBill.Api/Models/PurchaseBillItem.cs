namespace EnhanzerPurchaseBill.Api.Models;

public class PurchaseBillItem
{
    public int PurchaseBillItemId { get; set; }

    public int PurchaseBillId { get; set; }

    public string ItemName { get; set; } = string.Empty;

    public string BatchCode { get; set; } = string.Empty;

    public string BatchName { get; set; } = string.Empty;

    public decimal StandardCost { get; set; }

    public decimal StandardPrice { get; set; }

    public int Quantity { get; set; }

    public decimal Discount { get; set; }

    public decimal TotalCost { get; set; }

    public decimal TotalSelling { get; set; }

    public PurchaseBill PurchaseBill { get; set; } = null!;
}