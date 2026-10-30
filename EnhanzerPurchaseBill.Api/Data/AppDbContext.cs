using EnhanzerPurchaseBill.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EnhanzerPurchaseBill.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Location> Locations => Set<Location>();

    public DbSet<PurchaseBill> PurchaseBills => Set<PurchaseBill>();

    public DbSet<PurchaseBillItem> PurchaseBillItems => Set<PurchaseBillItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Location>(entity =>
        {
            entity.ToTable("Location_Details");

            entity.HasKey(x => x.LocationId);

            entity.Property(x => x.Location_Code)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.Location_Name)
                .HasMaxLength(200)
                .IsRequired();
        });

        modelBuilder.Entity<PurchaseBill>(entity =>
        {
            entity.ToTable("Purchase_Bills");

            entity.HasKey(x => x.PurchaseBillId);

            entity.Property(x => x.TotalCost).HasPrecision(18, 2);
            entity.Property(x => x.TotalSelling).HasPrecision(18, 2);

            entity.HasMany(x => x.Items)
                .WithOne(x => x.PurchaseBill)
                .HasForeignKey(x => x.PurchaseBillId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PurchaseBillItem>(entity =>
        {
            entity.ToTable("Purchase_Bill_Items");

            entity.HasKey(x => x.PurchaseBillItemId);

            entity.Property(x => x.ItemName).HasMaxLength(100).IsRequired();
            entity.Property(x => x.BatchCode).HasMaxLength(50).IsRequired();
            entity.Property(x => x.BatchName).HasMaxLength(200).IsRequired();

            entity.Property(x => x.StandardCost).HasPrecision(18, 2);
            entity.Property(x => x.StandardPrice).HasPrecision(18, 2);
            entity.Property(x => x.Discount).HasPrecision(5, 2);
            entity.Property(x => x.TotalCost).HasPrecision(18, 2);
            entity.Property(x => x.TotalSelling).HasPrecision(18, 2);
        });
    }
}