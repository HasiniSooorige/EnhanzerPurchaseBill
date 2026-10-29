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
    }
}