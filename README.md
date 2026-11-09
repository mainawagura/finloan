# FinLoan — Enterprise Loan Management System

FinLoan is an enterprise-grade Loan Management System designed for commercial banks, microfinance institutions, SACCOs, and digital lenders. The platform enforces institutional lending workflows including credit origination, maker-checker underwriting approval gates, capital disbursement, installment amortization tracking, loan recoveries, and executive analytics.

All financial amounts are denominated in **Kenya Shillings (KES / KSh)**.

---

## 🏛️ System Architecture

```
finloan/
├── backend/                  # C# ASP.NET Core Clean Architecture Web API
│   ├── FinLoan.sln
│   └── src/
│       ├── FinLoan.API/             # REST Endpoints, Middleware, Program.cs
│       ├── FinLoan.Application/     # CQRS, Services, Interfaces, DTOs
│       ├── FinLoan.Domain/          # Core Domain Entities & Rules
│       └── FinLoan.Infrastructure/  # EF Core, SQL Server, Persistence
│
└── frontend/                 # React + TypeScript Modern Dashboard
    ├── src/
    │   ├── app/                     # Security, RBAC Gates, Router
    │   ├── features/                # Lending Lifecycle Modules
    │   │   ├── authentication/      # Corporate Banking Login Terminal
    │   │   ├── dashboard/           # Executive & Risk Portfolio Dashboard
    │   │   ├── customers/           # Borrower Management & KYC
    │   │   ├── loan-products/       # Credit Facility Configuration
    │   │   ├── loan-applications/   # Origination & Intake
    │   │   ├── credit-assessment/   # Quantitative Underwriting
    │   │   ├── loan-approvals/      # Dual-Control Maker-Checker
    │   │   ├── disbursements/       # Treasury Net Payout Release
    │   │   ├── loan-accounts/       # Amortization Schedules & Ledgers
    │   │   ├── financial-demo/      # Repayments & Reversals
    │   │   ├── recoveries/          # Delinquency PAR & Promise to Pay
    │   │   └── reports/             # PDF / Excel Treasury Statements
    │   ├── services/                # API Client & Reactive Store
    │   └── shared/                  # Reusable Layout, Header & Utilities
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Frontend (React + TypeScript)
```bash
cd frontend
npm install
npm run dev
```
The application will launch at `http://localhost:3001/` with the **Staff Authentication Terminal**.

### 2. Backend (C# ASP.NET Core)
```bash
cd backend
dotnet restore
dotnet build
dotnet run --project src/FinLoan.API
```
The API Swagger documentation will be accessible at `https://localhost:7001/swagger`.

---

## 🛡️ Enterprise Security & Governance
- **Maker-Checker Enforcement**: Dual-control approval workflows preventing credit self-approval.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions across 7 institutional personas.
- **Central Bank Regulatory Compliance**: Adheres to OWASP ASVS Level 3 guidelines.
- **Immutable Financial Transactions**: All ledger postings and reversals are cryptographically tracked without hard deletion.
