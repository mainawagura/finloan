# FinLoan — Frontend Security Architecture & Integration Gateway

**Phase 1: Frontend-Only Security Experience**  
**Security Baseline:** OWASP ASVS, OWASP Top 10, FinLoan Security Architecture Technical Specification.

---

## 🛡️ Overview

This repository houses the frontend implementation of FinLoan's centralized enterprise security architecture. It provides permission-aware navigation, server-session management interfaces, financial maker-checker workflows, and security audit monitoring while strictly respecting **Section 9.6 demonstration boundaries** (no local password verification or fake cryptographic hashing).

## 🚀 Running the Application

```bash
cd finloan-frontend
npm run dev
```

The application runs locally on **`http://localhost:3001/`**.

---

## 🔑 Key Architectural Features Implemented

### 1. Interactive Demo Persona Switcher (Section 9.6)
Switch between all 7 institutional roles with a single click to immediately observe how permission gates and navigation menus dynamically adapt:
- **`SUPER_ADMIN`**: Governance & platform administration (Maker role; self-approval prohibited).
- **`ADMIN`**: User provisioning, session monitoring, and audit log inspection.
- **`LOAN_OFFICER`**: Originates customer profiles and loan applications (`loans.create`).
- **`CREDIT_MANAGER`**: Underwriting checker with exclusive authority to approve/reject loans (`loans.approve`, `loans.reject`).
- **`FINANCE_OFFICER`**: Disbursement and repayment posting/reversal (`loans.disburse`, `repayments.reverse`).
- **`RECOVERY_OFFICER`**: Delinquency collections and recovery payment records.
- **`AUDITOR`**: Read-only compliance access to the append-only security audit trail.
- **`GUEST / UNAUTHENTICATED`**: Demonstrates redirect and authentication requirement guards.

### 2. Separation of Duties & Maker-Checker (Sections 6.2, 7.1 & 7.2)
- In the **Loan Processing** tab, loans created by a Maker cannot be approved by that same user.
- `SUPER_ADMIN` does not hold loan approval permissions, preventing administrative self-approval of debt facilities.

### 3. Server-Managed Session Architecture (Section 5)
- **Active Sessions Page**: Shows registered devices, IP addresses, user agents, and session creation timestamps.
- **Sliding Inactivity & Absolute Lifetime**: Live counters in the header demonstrate the 15-minute sliding idle timeout and 8-hour absolute session boundary.
- **Session Revocation**: Real-time simulation of individual session revocation and bulk "Revoke All Other Sessions" operations.

### 4. Tamper-Evident Security Audit Logs (Section 8)
- Displays an append-only timeline of security events with **cryptographic SHA-256 hash chaining** (`previousEventHash` -> `eventHash`).

### 5. Mandatory Authentication Screens (Section 9.2)
Available individually or side-by-side in the **Auth Screens Gallery**:
1. Sign In (with password complexity guidance and lockout notice)
2. Forgot Password (with Section 4.4 anti-enumeration protection)
3. Reset Password (with real-time Section 4.3 password policy validator)
4. Email Verification (single-use cryptographically signed token)
5. Multi-Factor Authentication (TOTP Authenticator & backup recovery codes)
6. HTTP 403 Access Denied
7. Session Expired (Idle vs Absolute expiration)

### 6. API Integration Contracts (Section 10)
- Located in `src/services/api/contracts.ts` and `src/services/api/client.ts`.
- Fully typed RFC 9457 `ProblemDetails` error structures and cookie-credentialed client (`credentials: 'include'`).
