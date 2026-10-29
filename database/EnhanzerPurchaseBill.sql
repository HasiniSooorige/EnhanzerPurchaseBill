CREATE DATABASE EnhanzerPurchaseBillDb;
GO

USE EnhanzerPurchaseBillDb;
GO

CREATE TABLE dbo.Location_Details
(
    LocationId INT IDENTITY(1,1) PRIMARY KEY,
    Location_Code NVARCHAR(50) NOT NULL,
    Location_Name NVARCHAR(200) NOT NULL
);
GO