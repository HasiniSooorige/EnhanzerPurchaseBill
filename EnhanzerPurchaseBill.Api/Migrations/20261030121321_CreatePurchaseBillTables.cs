using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnhanzerPurchaseBill.Api.Migrations
{
    /// <inheritdoc />
    public partial class CreatePurchaseBillTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.CreateTable(
            //    name: "Location_Details",
            //    columns: table => new
            //    {
            //        LocationId = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("SqlServer:Identity", "1, 1"),
            //        Location_Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
            //        Location_Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Location_Details", x => x.LocationId);
            //    });

            migrationBuilder.CreateTable(
                name: "Purchase_Bills",
                columns: table => new
                {
                    PurchaseBillId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalItems = table.Column<int>(type: "int", nullable: false),
                    TotalQuantity = table.Column<int>(type: "int", nullable: false),
                    TotalCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    TotalSelling = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Purchase_Bills", x => x.PurchaseBillId);
                });

            migrationBuilder.CreateTable(
                name: "Purchase_Bill_Items",
                columns: table => new
                {
                    PurchaseBillItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseBillId = table.Column<int>(type: "int", nullable: false),
                    ItemName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BatchCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BatchName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StandardCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    StandardPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    TotalCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    TotalSelling = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Purchase_Bill_Items", x => x.PurchaseBillItemId);
                    table.ForeignKey(
                        name: "FK_Purchase_Bill_Items_Purchase_Bills_PurchaseBillId",
                        column: x => x.PurchaseBillId,
                        principalTable: "Purchase_Bills",
                        principalColumn: "PurchaseBillId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Purchase_Bill_Items_PurchaseBillId",
                table: "Purchase_Bill_Items",
                column: "PurchaseBillId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "Location_Details");

            migrationBuilder.DropTable(
                name: "Purchase_Bill_Items");

            migrationBuilder.DropTable(
                name: "Purchase_Bills");
        }
    }
}
