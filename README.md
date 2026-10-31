# Enhanzer Purchase Bill Application

A full-stack Purchase Bill Management application developed using Angular, ASP.NET Core Web API, Entity Framework Core, and Microsoft SQL Server.

## 1. Project Overview

This application allows authenticated users to log in, retrieve their assigned locations, manage purchase items, calculate purchase totals, and save purchase bills to a SQL Server database.

## 2. Technologies Used

### Frontend
- Angular
- TypeScript
- HTML5
- CSS3

### Backend
- C#
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- JWT Authentication

### Database
- Microsoft SQL Server

## 3. Main Features

- Login using the provided external authentication API.
- Retrieve and store user locations.
- JWT-based authentication.
- Protected Purchase Bill page.
- Item autocomplete with predefined items.
- Batch / Location selection.
- Standard Cost, Standard Price, Quantity, and Discount inputs.
- Automatic Total Cost and Total Selling calculations.
- Add and remove purchase items.
- Total Items and Total Quantity summary.
- Save purchase bills and items to SQL Server.
- Input validation and error handling.
- Responsive user interface.

## 4. Project Structure

```text
EnhanzerPurchaseBill/
│
├── EnhanzerPurchaseBill.Api/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Models/
│   ├── Migrations/
│   ├── Properties/
│   ├── Program.cs
│   └── appsettings.json
│
├── EnhanzerPurchaseBill.Client/
│   └── src/
│       └── app/
│           ├── guards/
│           ├── pages/
│           │   ├── login/
│           │   └── purchase-bill/
│           ├── services/
│           └── app.routes.ts
│
├── EnhanzerPurchaseBill_Database.sql
└── README.md
```

## 5. Prerequisites

Install the following tools:

- .NET 8 SDK
- Node.js and npm
- Angular CLI
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- Visual Studio or Visual Studio Code

## 6. Database Setup

1. Open SQL Server Management Studio.
2. Connect to your SQL Server instance.
3. Open `EnhanzerPurchaseBill_Database.sql`.
4. Execute the script to create the database objects and restore the exported data.
5. Verify that the following tables are available:

   - `Location_Details`
   - `Purchase_Bills`
   - `Purchase_Bill_Items`

Update the backend connection string to match your SQL Server instance.

## 7. Backend Configuration

Navigate to the API project:

```bash
cd EnhanzerPurchaseBill.Api
```

Configure the SQL Server connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=EnhanzerPurchaseBillDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Configure the JWT signing key using .NET User Secrets. Do not commit the actual signing key to GitHub.

```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "YOUR_SECURE_SECRET_KEY"
```

Restore dependencies:

```bash
dotnet restore
```

Run the API:

```bash
dotnet run
```

The API will be available at the URL configured in `Properties/launchSettings.json`.

## 8. Frontend Configuration

Open another terminal and navigate to the Angular project:

```bash
cd EnhanzerPurchaseBill.Client
```

Install dependencies:

```bash
npm install
```

Start the Angular application:

```bash
ng serve
```

Open the application in your browser:

```text
http://localhost:4200
```

Ensure the backend API is running and that the frontend API base URL matches the backend URL.

## 9. External API Integration

The application integrates with the following external authentication endpoint:

```text
https://ez-staging-api.azurewebsites.net/api/External_Api/POS_Api/Invoke
```

The login request uses the `GetLoginData` action and submits the user's credentials and required request parameters.

On successful authentication, the application retrieves the user's assigned locations and stores them in the SQL Server database.

## 10. Purchase Bill Calculations

**Total Cost**

```text
Total Cost = (Standard Cost × Quantity) × (1 - Discount / 100)
```

**Total Selling**

```text
Total Selling = Standard Price × Quantity
```

The backend validates the submitted data and calculates the bill totals before saving the purchase bill.

## 11. Authentication and Security

- JWT bearer authentication is used to protect API endpoints.
- The Purchase Bill page is protected using an Angular route guard.
- Authenticated API requests include the JWT bearer token.
- JWT signing keys should be stored securely using User Secrets.
- Never commit passwords, private keys, or sensitive configuration values to source control.

## 12. GitHub Repository

Source code:

https://github.com/HasiniSooorige/EnhanzerPurchaseBill

---

**Developed as part of the Enhanzer Software Engineering Assignment.**