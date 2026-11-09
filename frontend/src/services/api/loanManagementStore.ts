/**
 * FinLoan Enterprise Loan Management Central Store
 * Maintains interconnected domain records across the full lending lifecycle.
 * All figures, loan accounts, disbursements, and repayments are internally consistent.
 */

export interface Customer {
  id: string;
  customerNumber: string;
  type: 'INDIVIDUAL' | 'BUSINESS';
  name: string;
  identificationType: 'NATIONAL_ID' | 'PASSPORT' | 'BUSINESS_REG';
  identificationNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  employment: {
    employerName: string;
    jobTitle: string;
    monthlyIncome: number;
    monthlyExpenses: number;
  };
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
  };
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  status: 'ACTIVE' | 'INACTIVE';
  totalBorrowed: number;
  outstandingBalance: number;
  createdAtUtc: string;
}

export interface LoanProduct {
  id: string;
  code: string;
  name: string;
  category: 'SME' | 'INDIVIDUAL' | 'ASSET' | 'AGRICULTURE';
  minAmount: number;
  maxAmount: number;
  interestRate: number; // Annual %
  calculationMethod: 'REDUCING_BALANCE' | 'FLAT_RATE';
  minTermMonths: number;
  maxTermMonths: number;
  repaymentFrequency: 'MONTHLY' | 'WEEKLY';
  processingFeePercent: number;
  insuranceFeePercent: number;
  penaltyRatePercent: number;
  gracePeriodDays: number;
  collateralRequired: boolean;
  guarantorRequired: boolean;
  eligibilityCriteria: string;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
}

export interface LoanApplication {
  id: string;
  applicationNumber: string;
  customerId: string;
  customerName: string;
  customerType: 'INDIVIDUAL' | 'BUSINESS';
  productId: string;
  productName: string;
  requestedAmount: number;
  termMonths: number;
  purpose: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  dtiRatio: number; // Debt to Income %
  creditScore: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  status:
    | 'DRAFT'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'ADDITIONAL_INFO_REQUIRED'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED';
  makerUserId: string;
  makerName: string;
  checkerUserId?: string | null;
  checkerName?: string | null;
  approvalNotes?: string | null;
  rejectionReason?: string | null;
  collateralDescription?: string;
  collateralValue?: number;
  guarantorName?: string;
  guarantorPhone?: string;
  submittedAtUtc: string;
  reviewedAtUtc?: string | null;
}

export interface RepaymentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  paidAmount: number;
  balance: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIALLY_PAID';
}

export interface LoanAccount {
  id: string;
  loanNumber: string;
  applicationId: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  principalAmount: number;
  interestRate: number;
  termMonths: number;
  totalPayable: number;
  totalPaid: number;
  outstandingBalance: number;
  outstandingPrincipal: number;
  outstandingInterest: number;
  outstandingPenalties: number;
  disbursementDate: string;
  maturityDate: string;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  status: 'ACTIVE' | 'IN_ARREARS' | 'SETTLED' | 'DEFAULTED';
  daysInArrears: number;
  schedule: RepaymentScheduleItem[];
}

export interface RepaymentRecord {
  id: string;
  referenceNumber: string;
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'MPESA' | 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
  allocatedPenalties: number;
  allocatedInterest: number;
  allocatedPrincipal: number;
  timestampUtc: string;
  status: 'POSTED' | 'REVERSED';
  reversalReason?: string;
  reversedBy?: string;
  reversedAtUtc?: string;
}

export interface DisbursementQueueItem {
  id: string;
  applicationId: string;
  applicationNumber: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  approvedAmount: number;
  processingFee: number;
  insuranceFee: number;
  netDisbursement: number;
  paymentMethod: 'MPESA_B2C' | 'FEDWIRE' | 'ACH' | 'BANK_TRANSFER';
  destinationAccount: string;
  approvedBy: string;
  approvedAtUtc: string;
  status: 'AWAITING_DISBURSEMENT' | 'DISBURSED' | 'FAILED';
  disbursementReference?: string;
  disbursedBy?: string;
  disbursedAtUtc?: string;
}

export interface RecoveryAccount {
  id: string;
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  phone: string;
  outstandingBalance: number;
  outstandingArrears: number;
  daysInArrears: number;
  parBucket: 'PAR_30' | 'PAR_60' | 'PAR_90_PLUS';
  assignedOfficer: string;
  recoveryStatus: 'ENGAGED' | 'PROMISE_TO_PAY' | 'DEMAND_ISSUED' | 'LEGAL_ACTION';
  lastContactDate: string;
  promiseToPayDate?: string;
  promisedAmount?: number;
  notes: {
    timestamp: string;
    officer: string;
    comment: string;
  }[];
}

// -------------------------------------------------------------
// INITIAL INTERCONNECTED DEMO DATASET
// -------------------------------------------------------------

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    customerNumber: 'CUST-2026-001',
    type: 'BUSINESS',
    name: 'Acme Logistics Ltd',
    identificationType: 'BUSINESS_REG',
    identificationNumber: 'CPR-2018-9921',
    email: 'finance@acmelogistics.com',
    phone: '+254 722 019 283',
    address: 'Plot 42, Industrial Area, Commercial Street',
    city: 'Nairobi',
    employment: {
      employerName: 'Acme Logistics Ltd (Fleet Division)',
      jobTitle: 'Managing Director & Shareholder',
      monthlyIncome: 45000,
      monthlyExpenses: 28000,
    },
    nextOfKin: {
      name: 'James K. Mutua',
      relationship: 'Executive Director',
      phone: '+254 722 984 102',
    },
    kycStatus: 'VERIFIED',
    status: 'ACTIVE',
    totalBorrowed: 150000,
    outstandingBalance: 52000,
    createdAtUtc: '2026-01-10T08:30:00Z',
  },
  {
    id: 'cust-002',
    customerNumber: 'CUST-2026-002',
    type: 'BUSINESS',
    name: 'Meridian Global Imports',
    identificationType: 'BUSINESS_REG',
    identificationNumber: 'CPR-2020-4109',
    email: 'procurement@meridianglobal.com',
    phone: '+254 711 405 829',
    address: 'Kilimani Business Center, Suite 402',
    city: 'Nairobi',
    employment: {
      employerName: 'Meridian Global Imports',
      jobTitle: 'Chief Executive Officer',
      monthlyIncome: 85000,
      monthlyExpenses: 42000,
    },
    nextOfKin: {
      name: 'Clara Jenkins',
      relationship: 'Finance Director',
      phone: '+254 711 390 120',
    },
    kycStatus: 'VERIFIED',
    status: 'ACTIVE',
    totalBorrowed: 85000,
    outstandingBalance: 68000,
    createdAtUtc: '2026-01-18T10:15:00Z',
  },
  {
    id: 'cust-003',
    customerNumber: 'CUST-2026-003',
    type: 'BUSINESS',
    name: 'Solstice Solar Energy Co.',
    identificationType: 'BUSINESS_REG',
    identificationNumber: 'CPR-2022-8193',
    email: 'info@solsticesolar.org',
    phone: '+254 733 918 204',
    address: 'Green Park Solar Hub, Tech Avenue',
    city: 'Mombasa',
    employment: {
      employerName: 'Solstice Solar Energy Co.',
      jobTitle: 'Principal Engineer & Owner',
      monthlyIncome: 120000,
      monthlyExpenses: 65000,
    },
    nextOfKin: {
      name: 'Dr. Raymond Ndungu',
      relationship: 'Corporate Secretary',
      phone: '+254 733 118 901',
    },
    kycStatus: 'VERIFIED',
    status: 'ACTIVE',
    totalBorrowed: 220000,
    outstandingBalance: 185000,
    createdAtUtc: '2026-02-01T11:00:00Z',
  },
  {
    id: 'cust-004',
    customerNumber: 'CUST-2026-004',
    type: 'INDIVIDUAL',
    name: 'Dr. Brian Otieno',
    identificationType: 'NATIONAL_ID',
    identificationNumber: 'ID-28910482',
    email: 'brian.otieno@nairobihospital.org',
    phone: '+254 701 882 109',
    address: 'House 14, Riverside Gardens',
    city: 'Nairobi',
    employment: {
      employerName: 'Metropolitan Hospital & Surgical Center',
      jobTitle: 'Consultant Orthopedic Surgeon',
      monthlyIncome: 18500,
      monthlyExpenses: 6200,
    },
    nextOfKin: {
      name: 'Dr. Sarah Otieno',
      relationship: 'Spouse',
      phone: '+254 701 445 119',
    },
    kycStatus: 'VERIFIED',
    status: 'ACTIVE',
    totalBorrowed: 40000,
    outstandingBalance: 30000,
    createdAtUtc: '2026-02-14T14:20:00Z',
  },
  {
    id: 'cust-005',
    customerNumber: 'CUST-2026-005',
    type: 'INDIVIDUAL',
    name: 'Grace Wambui',
    identificationType: 'NATIONAL_ID',
    identificationNumber: 'ID-31049281',
    email: 'grace.wambui@outlook.com',
    phone: '+254 728 554 901',
    address: 'Stall 8B, Biashara Plaza',
    city: 'Nakuru',
    employment: {
      employerName: 'Wambui Apparel & Textile Enterprises',
      jobTitle: 'Managing Proprietor',
      monthlyIncome: 6500,
      monthlyExpenses: 2800,
    },
    nextOfKin: {
      name: 'Peter Kariuki',
      relationship: 'Brother',
      phone: '+254 728 901 223',
    },
    kycStatus: 'VERIFIED',
    status: 'ACTIVE',
    totalBorrowed: 12000,
    outstandingBalance: 12000,
    createdAtUtc: '2026-03-01T09:40:00Z',
  },
  {
    id: 'cust-006',
    customerNumber: 'CUST-2026-006',
    type: 'INDIVIDUAL',
    name: 'Kevin Mwangi',
    identificationType: 'PASSPORT',
    identificationNumber: 'PP-A089128',
    email: 'kevin.mwangi@fintech.io',
    phone: '+254 712 901 834',
    address: 'Apt 4C, Westlands Heights',
    city: 'Nairobi',
    employment: {
      employerName: 'Global Cloud Systems Inc.',
      jobTitle: 'Senior Infrastructure Engineer',
      monthlyIncome: 9200,
      monthlyExpenses: 3400,
    },
    nextOfKin: {
      name: 'Beatrice Mwangi',
      relationship: 'Mother',
      phone: '+254 712 110 994',
    },
    kycStatus: 'PENDING',
    status: 'ACTIVE',
    totalBorrowed: 0,
    outstandingBalance: 0,
    createdAtUtc: '2026-03-10T16:00:00Z',
  },
];

const INITIAL_PRODUCTS: LoanProduct[] = [
  {
    id: 'prod-001',
    code: 'SME-GROWTH',
    name: 'SME Working Capital Growth Facility',
    category: 'SME',
    minAmount: 10000,
    maxAmount: 500000,
    interestRate: 8.5,
    calculationMethod: 'REDUCING_BALANCE',
    minTermMonths: 6,
    maxTermMonths: 36,
    repaymentFrequency: 'MONTHLY',
    processingFeePercent: 1.5,
    insuranceFeePercent: 0.75,
    penaltyRatePercent: 2.0,
    gracePeriodDays: 14,
    collateralRequired: true,
    guarantorRequired: true,
    eligibilityCriteria: 'Minimum 2 years trading history, audited bank statements, debt-service coverage > 1.25x.',
    status: 'ACTIVE',
    description: 'Structured short to medium term revolving working capital financing for commercial operations.',
  },
  {
    id: 'prod-002',
    code: 'ASSET-FIN',
    name: 'Commercial Asset & Machinery Financing',
    category: 'ASSET',
    minAmount: 25000,
    maxAmount: 1000000,
    interestRate: 7.9,
    calculationMethod: 'REDUCING_BALANCE',
    minTermMonths: 12,
    maxTermMonths: 60,
    repaymentFrequency: 'MONTHLY',
    processingFeePercent: 2.0,
    insuranceFeePercent: 1.0,
    penaltyRatePercent: 2.5,
    gracePeriodDays: 30,
    collateralRequired: true,
    guarantorRequired: false,
    eligibilityCriteria: 'Direct proforma invoice from verified equipment vendor. Equipment acts as primary security.',
    status: 'ACTIVE',
    description: 'Long-term capital equipment financing with joint registration lien on machinery.',
  },
  {
    id: 'prod-003',
    code: 'SAL-ADV',
    name: 'Executive Personal Salary Advance',
    category: 'INDIVIDUAL',
    minAmount: 1000,
    maxAmount: 50000,
    interestRate: 11.0,
    calculationMethod: 'REDUCING_BALANCE',
    minTermMonths: 3,
    maxTermMonths: 24,
    repaymentFrequency: 'MONTHLY',
    processingFeePercent: 2.5,
    insuranceFeePercent: 0.5,
    penaltyRatePercent: 3.0,
    gracePeriodDays: 7,
    collateralRequired: false,
    guarantorRequired: true,
    eligibilityCriteria: 'Permanent salaried employment with accredited employer check-off agreement.',
    status: 'ACTIVE',
    description: 'Unsecured personal loan for medical, school fees, or home renovation.',
  },
  {
    id: 'prod-004',
    code: 'AGRI-INPUT',
    name: 'Agro-Business Seasonal Input Loan',
    category: 'AGRICULTURE',
    minAmount: 5000,
    maxAmount: 100000,
    interestRate: 9.0,
    calculationMethod: 'FLAT_RATE',
    minTermMonths: 6,
    maxTermMonths: 12,
    repaymentFrequency: 'MONTHLY',
    processingFeePercent: 1.0,
    insuranceFeePercent: 1.5,
    penaltyRatePercent: 1.5,
    gracePeriodDays: 45,
    collateralRequired: false,
    guarantorRequired: true,
    eligibilityCriteria: 'Contract farming off-take agreement with certified aggregator.',
    status: 'ACTIVE',
    description: 'Seasonal crop input funding with bullet or structured harvest repayment schedules.',
  },
];

const INITIAL_APPLICATIONS: LoanApplication[] = [
  {
    id: 'app-001',
    applicationNumber: 'APP-2026-101',
    customerId: 'cust-001',
    customerName: 'Acme Logistics Ltd',
    customerType: 'BUSINESS',
    productId: 'prod-002',
    productName: 'Commercial Asset & Machinery Financing',
    requestedAmount: 150000,
    termMonths: 36,
    purpose: 'Acquisition of 2 heavy haulage refrigerated trailers for cold chain expansion.',
    monthlyIncome: 45000,
    monthlyExpenses: 28000,
    dtiRatio: 38.5,
    creditScore: 785,
    riskRating: 'LOW',
    status: 'UNDER_REVIEW',
    makerUserId: 'usr-003',
    makerName: 'Alex Rivera (Loan Officer)',
    collateralDescription: 'Trailer Equipment Logbooks & Corporate Debenture',
    collateralValue: 210000,
    guarantorName: 'James K. Mutua',
    guarantorPhone: '+254 722 984 102',
    submittedAtUtc: '2026-11-08T11:20:00Z',
  },
  {
    id: 'app-002',
    applicationNumber: 'APP-2026-102',
    customerId: 'cust-004',
    customerName: 'Dr. Brian Otieno',
    customerType: 'INDIVIDUAL',
    productId: 'prod-003',
    productName: 'Executive Personal Salary Advance',
    requestedAmount: 35000,
    termMonths: 24,
    purpose: 'Private clinic diagnostic imaging ultrasound equipment downpayment.',
    monthlyIncome: 18500,
    monthlyExpenses: 6200,
    dtiRatio: 33.5,
    creditScore: 820,
    riskRating: 'LOW',
    status: 'SUBMITTED',
    makerUserId: 'usr-003',
    makerName: 'Alex Rivera (Loan Officer)',
    guarantorName: 'Dr. Sarah Otieno',
    guarantorPhone: '+254 701 445 119',
    submittedAtUtc: '2026-11-09T08:15:00Z',
  },
  {
    id: 'app-003',
    applicationNumber: 'APP-2026-103',
    customerId: 'cust-005',
    customerName: 'Grace Wambui',
    customerType: 'INDIVIDUAL',
    productId: 'prod-003',
    productName: 'Executive Personal Salary Advance',
    requestedAmount: 12000,
    termMonths: 12,
    purpose: 'Bulk textile wholesale inventory purchase ahead of festive season.',
    monthlyIncome: 6500,
    monthlyExpenses: 2800,
    dtiRatio: 43.0,
    creditScore: 710,
    riskRating: 'MEDIUM',
    status: 'APPROVED',
    makerUserId: 'usr-003',
    makerName: 'Alex Rivera (Loan Officer)',
    checkerUserId: 'usr-004',
    checkerName: 'Elena Rostova (Credit Manager)',
    approvalNotes: 'Borrower has good turnover history and zero historical arrears. Approved under standard retail terms.',
    guarantorName: 'Peter Kariuki',
    guarantorPhone: '+254 728 901 223',
    submittedAtUtc: '2026-11-07T09:00:00Z',
    reviewedAtUtc: '2026-11-08T14:30:00Z',
  },
  {
    id: 'app-004',
    applicationNumber: 'APP-2026-104',
    customerId: 'cust-006',
    customerName: 'Kevin Mwangi',
    customerType: 'INDIVIDUAL',
    productId: 'prod-003',
    productName: 'Executive Personal Salary Advance',
    requestedAmount: 18000,
    termMonths: 18,
    purpose: 'Relocation & professional software certification courses.',
    monthlyIncome: 9200,
    monthlyExpenses: 3400,
    dtiRatio: 37.0,
    creditScore: 680,
    riskRating: 'MEDIUM',
    status: 'DRAFT',
    makerUserId: 'usr-003',
    makerName: 'Alex Rivera (Loan Officer)',
    submittedAtUtc: '2026-11-09T10:00:00Z',
  },
];

const INITIAL_DISBURSEMENT_QUEUE: DisbursementQueueItem[] = [
  {
    id: 'disb-001',
    applicationId: 'app-003',
    applicationNumber: 'APP-2026-103',
    customerId: 'cust-005',
    customerName: 'Grace Wambui',
    productId: 'prod-003',
    productName: 'Executive Personal Salary Advance',
    approvedAmount: 12000,
    processingFee: 300, // 2.5%
    insuranceFee: 60,   // 0.5%
    netDisbursement: 11640,
    paymentMethod: 'MPESA_B2C',
    destinationAccount: '+254 728 554 901 (Grace Wambui Safaricom M-Pesa)',
    approvedBy: 'Elena Rostova (Credit Manager)',
    approvedAtUtc: '2026-11-08T14:30:00Z',
    status: 'AWAITING_DISBURSEMENT',
  },
];

const INITIAL_LOANS: LoanAccount[] = [
  {
    id: 'loan-001',
    loanNumber: 'LN-2026-0891',
    applicationId: 'app-hist-01',
    customerId: 'cust-002',
    customerName: 'Meridian Global Imports',
    productId: 'prod-001',
    productName: 'SME Working Capital Growth Facility',
    principalAmount: 85000,
    interestRate: 8.5,
    termMonths: 24,
    totalPayable: 92225,
    totalPaid: 24225,
    outstandingBalance: 68000,
    outstandingPrincipal: 62000,
    outstandingInterest: 6000,
    outstandingPenalties: 0,
    disbursementDate: '2026-04-15',
    maturityDate: '2028-04-15',
    nextPaymentDate: '2026-11-15',
    nextPaymentAmount: 3842.71,
    status: 'ACTIVE',
    daysInArrears: 0,
    schedule: [
      { installmentNumber: 1, dueDate: '2026-05-15', principalDue: 3240, interestDue: 602.71, totalDue: 3842.71, paidAmount: 3842.71, balance: 81760, status: 'PAID' },
      { installmentNumber: 2, dueDate: '2026-06-15', principalDue: 3263, interestDue: 579.71, totalDue: 3842.71, paidAmount: 3842.71, balance: 78497, status: 'PAID' },
      { installmentNumber: 3, dueDate: '2026-07-15', principalDue: 3286, interestDue: 556.71, totalDue: 3842.71, paidAmount: 3842.71, balance: 75211, status: 'PAID' },
      { installmentNumber: 4, dueDate: '2026-08-15', principalDue: 3309, interestDue: 533.71, totalDue: 3842.71, paidAmount: 3842.71, balance: 71902, status: 'PAID' },
      { installmentNumber: 5, dueDate: '2026-09-15', principalDue: 3333, interestDue: 509.71, totalDue: 3842.71, paidAmount: 3842.71, balance: 68569, status: 'PAID' },
      { installmentNumber: 6, dueDate: '2026-10-15', principalDue: 3356, interestDue: 486.71, totalDue: 3842.71, paidAmount: 3842.71, balance: 65213, status: 'PAID' },
      { installmentNumber: 7, dueDate: '2026-11-15', principalDue: 3380, interestDue: 462.71, totalDue: 3842.71, paidAmount: 0, balance: 68000, status: 'PENDING' },
      { installmentNumber: 8, dueDate: '2026-12-15', principalDue: 3404, interestDue: 438.71, totalDue: 3842.71, paidAmount: 0, balance: 64596, status: 'PENDING' },
    ],
  },
  {
    id: 'loan-002',
    loanNumber: 'LN-2026-0890',
    applicationId: 'app-hist-02',
    customerId: 'cust-003',
    customerName: 'Solstice Solar Energy Co.',
    productId: 'prod-002',
    productName: 'Commercial Asset & Machinery Financing',
    principalAmount: 220000,
    interestRate: 7.9,
    termMonths: 48,
    totalPayable: 254760,
    totalPaid: 69760,
    outstandingBalance: 185000,
    outstandingPrincipal: 172000,
    outstandingInterest: 13000,
    outstandingPenalties: 0,
    disbursementDate: '2025-10-01',
    maturityDate: '2029-10-01',
    nextPaymentDate: '2026-11-20',
    nextPaymentAmount: 5307.50,
    status: 'ACTIVE',
    daysInArrears: 0,
    schedule: [
      { installmentNumber: 12, dueDate: '2026-10-20', principalDue: 4180, interestDue: 1127.50, totalDue: 5307.50, paidAmount: 5307.50, balance: 185000, status: 'PAID' },
      { installmentNumber: 13, dueDate: '2026-11-20', principalDue: 4208, interestDue: 1099.50, totalDue: 5307.50, paidAmount: 0, balance: 185000, status: 'PENDING' },
    ],
  },
  {
    id: 'loan-003',
    loanNumber: 'LN-2026-0885',
    applicationId: 'app-hist-03',
    customerId: 'cust-001',
    customerName: 'Acme Logistics Ltd',
    productId: 'prod-001',
    productName: 'SME Working Capital Growth Facility',
    principalAmount: 75000,
    interestRate: 8.5,
    termMonths: 24,
    totalPayable: 81375,
    totalPaid: 29375,
    outstandingBalance: 52000,
    outstandingPrincipal: 48000,
    outstandingInterest: 3200,
    outstandingPenalties: 800,
    disbursementDate: '2026-01-15',
    maturityDate: '2028-01-15',
    nextPaymentDate: '2026-10-15',
    nextPaymentAmount: 3390.62,
    status: 'IN_ARREARS',
    daysInArrears: 38,
    schedule: [
      { installmentNumber: 8, dueDate: '2026-09-15', principalDue: 3010, interestDue: 380.62, totalDue: 3390.62, paidAmount: 3390.62, balance: 52000, status: 'PAID' },
      { installmentNumber: 9, dueDate: '2026-10-15', principalDue: 3031, interestDue: 359.62, totalDue: 3390.62, paidAmount: 0, balance: 52000, status: 'OVERDUE' },
    ],
  },
  {
    id: 'loan-004',
    loanNumber: 'LN-2026-0870',
    applicationId: 'app-hist-04',
    customerId: 'cust-004',
    customerName: 'Dr. Brian Otieno',
    productId: 'prod-003',
    productName: 'Executive Personal Salary Advance',
    principalAmount: 40000,
    interestRate: 11.0,
    termMonths: 24,
    totalPayable: 44400,
    totalPaid: 14400,
    outstandingBalance: 30000,
    outstandingPrincipal: 27500,
    outstandingInterest: 2500,
    outstandingPenalties: 0,
    disbursementDate: '2026-03-01',
    maturityDate: '2028-03-01',
    nextPaymentDate: '2026-11-28',
    nextPaymentAmount: 1850.00,
    status: 'ACTIVE',
    daysInArrears: 0,
    schedule: [
      { installmentNumber: 7, dueDate: '2026-10-28', principalDue: 1600, interestDue: 250.00, totalDue: 1850.00, paidAmount: 1850.00, balance: 30000, status: 'PAID' },
      { installmentNumber: 8, dueDate: '2026-11-28', principalDue: 1615, interestDue: 235.00, totalDue: 1850.00, paidAmount: 0, balance: 30000, status: 'PENDING' },
    ],
  },
];

const INITIAL_REPAYMENTS: RepaymentRecord[] = [
  {
    id: 'rep-001',
    referenceNumber: 'TX-REP-8901',
    loanId: 'loan-001',
    loanNumber: 'LN-2026-0891',
    customerId: 'cust-002',
    customerName: 'Meridian Global Imports',
    amount: 3842.71,
    paymentMethod: 'BANK_TRANSFER',
    allocatedPenalties: 0,
    allocatedInterest: 486.71,
    allocatedPrincipal: 3356.00,
    timestampUtc: '2026-10-15T10:30:00Z',
    status: 'POSTED',
  },
  {
    id: 'rep-002',
    referenceNumber: 'TX-REP-8902',
    loanId: 'loan-002',
    loanNumber: 'LN-2026-0890',
    customerId: 'cust-003',
    customerName: 'Solstice Solar Energy Co.',
    amount: 5307.50,
    paymentMethod: 'BANK_TRANSFER',
    allocatedPenalties: 0,
    allocatedInterest: 1127.50,
    allocatedPrincipal: 4180.00,
    timestampUtc: '2026-10-20T14:15:00Z',
    status: 'POSTED',
  },
  {
    id: 'rep-003',
    referenceNumber: 'TX-REP-8899',
    loanId: 'loan-004',
    loanNumber: 'LN-2026-0870',
    customerId: 'cust-004',
    customerName: 'Dr. Brian Otieno',
    amount: 1850.00,
    paymentMethod: 'MPESA',
    allocatedPenalties: 0,
    allocatedInterest: 250.00,
    allocatedPrincipal: 1600.00,
    timestampUtc: '2026-10-28T09:45:00Z',
    status: 'POSTED',
  },
];

const INITIAL_RECOVERIES: RecoveryAccount[] = [
  {
    id: 'rec-001',
    loanId: 'loan-003',
    loanNumber: 'LN-2026-0885',
    customerId: 'cust-001',
    customerName: 'Acme Logistics Ltd',
    phone: '+254 722 019 283',
    outstandingBalance: 52000,
    outstandingArrears: 3390.62,
    daysInArrears: 38,
    parBucket: 'PAR_30',
    assignedOfficer: 'Patricia O\'Connor (Recovery Officer)',
    recoveryStatus: 'PROMISE_TO_PAY',
    lastContactDate: '2026-11-06T15:20:00Z',
    promiseToPayDate: '2026-11-18',
    promisedAmount: 3400.00,
    notes: [
      {
        timestamp: '2026-11-06T15:20:00Z',
        officer: 'Patricia O\'Connor',
        comment: 'Spoke with Managing Director. Company awaiting payment from logistics client on Nov 17. Committed to clear full installment on Nov 18.',
      },
      {
        timestamp: '2026-10-25T11:00:00Z',
        officer: 'Patricia O\'Connor',
        comment: 'Formal SMS reminder and courtesy call initiated. First payment notice dispatched.',
      },
    ],
  },
];

// -------------------------------------------------------------
// CENTRAL REACTIVE STORE CLASS
// -------------------------------------------------------------

class LoanManagementStore {
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private products: LoanProduct[] = [...INITIAL_PRODUCTS];
  private applications: LoanApplication[] = [...INITIAL_APPLICATIONS];
  private loans: LoanAccount[] = [...INITIAL_LOANS];
  private repayments: RepaymentRecord[] = [...INITIAL_REPAYMENTS];
  private disbursements: DisbursementQueueItem[] = [...INITIAL_DISBURSEMENT_QUEUE];
  private recoveries: RecoveryAccount[] = [...INITIAL_RECOVERIES];
  private listeners: (() => void)[] = [];

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- CUSTOMERS ---
  public getCustomers(): Customer[] {
    return [...this.customers];
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  public addCustomer(newCust: Omit<Customer, 'id' | 'customerNumber' | 'totalBorrowed' | 'outstandingBalance' | 'createdAtUtc'>): Customer {
    const customer: Customer = {
      ...newCust,
      id: `cust-${Date.now()}`,
      customerNumber: `CUST-2026-${(this.customers.length + 1).toString().padStart(3, '0')}`,
      totalBorrowed: 0,
      outstandingBalance: 0,
      createdAtUtc: new Date().toISOString(),
    };
    this.customers = [customer, ...this.customers];
    this.notify();
    return customer;
  }

  public toggleCustomerStatus(id: string): void {
    const cust = this.customers.find((c) => c.id === id);
    if (cust) {
      cust.status = cust.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      this.notify();
    }
  }

  // --- LOAN PRODUCTS ---
  public getProducts(): LoanProduct[] {
    return [...this.products];
  }

  public addProduct(product: Omit<LoanProduct, 'id'>): LoanProduct {
    const newProd: LoanProduct = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    this.products = [...this.products, newProd];
    this.notify();
    return newProd;
  }

  public toggleProductStatus(id: string): void {
    const p = this.products.find((prod) => prod.id === id);
    if (p) {
      p.status = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      this.notify();
    }
  }

  // --- LOAN APPLICATIONS & WORKFLOW ---
  public getApplications(): LoanApplication[] {
    return [...this.applications];
  }

  public getApplicationById(id: string): LoanApplication | undefined {
    return this.applications.find((a) => a.id === id);
  }

  public createApplication(app: Omit<LoanApplication, 'id' | 'applicationNumber' | 'submittedAtUtc' | 'status'>): LoanApplication {
    const newApp: LoanApplication = {
      ...app,
      id: `app-${Date.now()}`,
      applicationNumber: `APP-2026-${(this.applications.length + 101).toString()}`,
      status: 'SUBMITTED',
      submittedAtUtc: new Date().toISOString(),
    };
    this.applications = [newApp, ...this.applications];
    this.notify();
    return newApp;
  }

  public updateApplicationStatus(id: string, status: LoanApplication['status'], notes?: string): void {
    const app = this.applications.find((a) => a.id === id);
    if (app) {
      app.status = status;
      if (notes) app.approvalNotes = notes;
      this.notify();
    }
  }

  // --- MAKER-CHECKER APPROVAL WORKFLOW ---
  public approveApplication(applicationId: string, checkerUserId: string, checkerName: string, notes: string): void {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    if (app.makerUserId === checkerUserId) {
      throw new Error('Maker-Checker Architectural Violation: Maker cannot approve their own application.');
    }

    app.status = 'APPROVED';
    app.checkerUserId = checkerUserId;
    app.checkerName = checkerName;
    app.approvalNotes = notes;
    app.reviewedAtUtc = new Date().toISOString();

    const product = this.products.find((p) => p.id === app.productId);
    const procRate = product ? product.processingFeePercent / 100 : 0.02;
    const insRate = product ? product.insuranceFeePercent / 100 : 0.005;

    const procFee = app.requestedAmount * procRate;
    const insFee = app.requestedAmount * insRate;
    const netDisb = app.requestedAmount - procFee - insFee;

    // Automatically queue to disbursements
    const queueItem: DisbursementQueueItem = {
      id: `disb-${Date.now()}`,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      customerId: app.customerId,
      customerName: app.customerName,
      productId: app.productId,
      productName: app.productName,
      approvedAmount: app.requestedAmount,
      processingFee: procFee,
      insuranceFee: insFee,
      netDisbursement: netDisb,
      paymentMethod: app.customerType === 'INDIVIDUAL' ? 'MPESA_B2C' : 'FEDWIRE',
      destinationAccount: `Primary Institutional Account for ${app.customerName}`,
      approvedBy: checkerName,
      approvedAtUtc: new Date().toISOString(),
      status: 'AWAITING_DISBURSEMENT',
    };

    this.disbursements = [queueItem, ...this.disbursements];
    this.notify();
  }

  public rejectApplication(applicationId: string, checkerUserId: string, checkerName: string, reason: string): void {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    if (app.makerUserId === checkerUserId) {
      throw new Error('Maker-Checker Violation: Maker cannot reject/review their own application.');
    }

    app.status = 'REJECTED';
    app.checkerUserId = checkerUserId;
    app.checkerName = checkerName;
    app.rejectionReason = reason;
    app.reviewedAtUtc = new Date().toISOString();
    this.notify();
  }

  // --- DISBURSEMENTS ---
  public getDisbursements(): DisbursementQueueItem[] {
    return [...this.disbursements];
  }

  public executeDisbursement(disbursementId: string, actorName: string, paymentMethod: DisbursementQueueItem['paymentMethod'], refNumber: string): LoanAccount {
    const item = this.disbursements.find((d) => d.id === disbursementId);
    if (!item) throw new Error('Disbursement queue item not found');
    if (item.status === 'DISBURSED') throw new Error('Loan already disbursed.');

    item.status = 'DISBURSED';
    item.paymentMethod = paymentMethod;
    item.disbursementReference = refNumber || `DISB-TX-${Math.floor(100000 + Math.random() * 900000)}`;
    item.disbursedBy = actorName;
    item.disbursedAtUtc = new Date().toISOString();

    const app = this.applications.find((a) => a.id === item.applicationId);
    const term = app?.termMonths || 24;
    const rate = 8.5; // default rate
    const interestTotal = item.approvedAmount * (rate / 100) * (term / 12);
    const totalPayable = item.approvedAmount + interestTotal;

    const newLoan: LoanAccount = {
      id: `loan-${Date.now()}`,
      loanNumber: `LN-2026-${(this.loans.length + 895).toString()}`,
      applicationId: item.applicationId,
      customerId: item.customerId,
      customerName: item.customerName,
      productId: item.productId,
      productName: item.productName,
      principalAmount: item.approvedAmount,
      interestRate: rate,
      termMonths: term,
      totalPayable,
      totalPaid: 0,
      outstandingBalance: totalPayable,
      outstandingPrincipal: item.approvedAmount,
      outstandingInterest: interestTotal,
      outstandingPenalties: 0,
      disbursementDate: new Date().toISOString().split('T')[0],
      maturityDate: new Date(Date.now() + term * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextPaymentAmount: totalPayable / term,
      status: 'ACTIVE',
      daysInArrears: 0,
      schedule: Array.from({ length: Math.min(term, 12) }, (_, i) => ({
        installmentNumber: i + 1,
        dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        principalDue: item.approvedAmount / term,
        interestDue: interestTotal / term,
        totalDue: totalPayable / term,
        paidAmount: 0,
        balance: totalPayable - (i + 1) * (totalPayable / term),
        status: 'PENDING',
      })),
    };

    this.loans = [newLoan, ...this.loans];

    // Update customer total borrowed and balance
    const cust = this.customers.find((c) => c.id === item.customerId);
    if (cust) {
      cust.totalBorrowed += item.approvedAmount;
      cust.outstandingBalance += totalPayable;
    }

    this.notify();
    return newLoan;
  }

  // --- LOAN ACCOUNTS ---
  public getLoanAccounts(): LoanAccount[] {
    return [...this.loans];
  }

  public getLoanById(id: string): LoanAccount | undefined {
    return this.loans.find((l) => l.id === id);
  }

  // --- REPAYMENTS & ALLOCATION ---
  public getRepayments(): RepaymentRecord[] {
    return [...this.repayments];
  }

  public recordRepayment(params: {
    loanId: string;
    amount: number;
    paymentMethod: RepaymentRecord['paymentMethod'];
    referenceNumber: string;
  }): RepaymentRecord {
    const loan = this.loans.find((l) => l.id === params.loanId);
    if (!loan) throw new Error('Loan account not found');

    let rem = params.amount;
    let pen = 0;
    let int = 0;
    let pri = 0;

    // 1. First allocate to penalties
    if (loan.outstandingPenalties > 0) {
      pen = Math.min(rem, loan.outstandingPenalties);
      loan.outstandingPenalties -= pen;
      rem -= pen;
    }

    // 2. Next allocate to outstanding interest
    if (rem > 0 && loan.outstandingInterest > 0) {
      int = Math.min(rem, loan.outstandingInterest);
      loan.outstandingInterest -= int;
      rem -= int;
    }

    // 3. Remainder goes to principal
    if (rem > 0) {
      pri = rem;
      loan.outstandingPrincipal = Math.max(0, loan.outstandingPrincipal - pri);
    }

    loan.totalPaid += params.amount;
    loan.outstandingBalance = Math.max(0, loan.outstandingBalance - params.amount);

    if (loan.outstandingBalance <= 0) {
      loan.status = 'SETTLED';
    } else if (loan.daysInArrears > 0) {
      // If payment covers arrears
      if (pen === 0 && loan.outstandingPenalties === 0) {
        loan.status = 'ACTIVE';
        loan.daysInArrears = 0;
      }
    }

    // Update customer outstanding balance
    const cust = this.customers.find((c) => c.id === loan.customerId);
    if (cust) {
      cust.outstandingBalance = Math.max(0, cust.outstandingBalance - params.amount);
    }

    const record: RepaymentRecord = {
      id: `rep-${Date.now()}`,
      referenceNumber: params.referenceNumber || `TX-REP-${Math.floor(1000 + Math.random() * 9000)}`,
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      customerId: loan.customerId,
      customerName: loan.customerName,
      amount: params.amount,
      paymentMethod: params.paymentMethod,
      allocatedPenalties: pen,
      allocatedInterest: int,
      allocatedPrincipal: pri,
      timestampUtc: new Date().toISOString(),
      status: 'POSTED',
    };

    this.repayments = [record, ...this.repayments];
    this.notify();
    return record;
  }

  public reverseRepayment(repaymentId: string, reason: string, actorName: string): RepaymentRecord {
    const record = this.repayments.find((r) => r.id === repaymentId);
    if (!record) throw new Error('Repayment record not found');
    if (record.status === 'REVERSED') throw new Error('Repayment has already been reversed.');

    record.status = 'REVERSED';
    record.reversalReason = reason;
    record.reversedBy = actorName;
    record.reversedAtUtc = new Date().toISOString();

    // Revert balances on loan
    const loan = this.loans.find((l) => l.id === record.loanId);
    if (loan) {
      loan.outstandingPrincipal += record.allocatedPrincipal;
      loan.outstandingInterest += record.allocatedInterest;
      loan.outstandingPenalties += record.allocatedPenalties;
      loan.outstandingBalance += record.amount;
      loan.totalPaid = Math.max(0, loan.totalPaid - record.amount);
      if (loan.status === 'SETTLED') loan.status = 'ACTIVE';
    }

    // Revert balance on customer
    const cust = this.customers.find((c) => c.id === record.customerId);
    if (cust) {
      cust.outstandingBalance += record.amount;
    }

    this.notify();
    return record;
  }

  // --- RECOVERY MANAGEMENT ---
  public getRecoveries(): RecoveryAccount[] {
    return [...this.recoveries];
  }

  public recordRecoveryPromise(recoveryId: string, ptpDate: string, amount: number, officer: string, note: string): void {
    const rec = this.recoveries.find((r) => r.id === recoveryId);
    if (rec) {
      rec.promiseToPayDate = ptpDate;
      rec.promisedAmount = amount;
      rec.recoveryStatus = 'PROMISE_TO_PAY';
      rec.lastContactDate = new Date().toISOString();
      rec.notes.unshift({
        timestamp: new Date().toISOString(),
        officer,
        comment: note,
      });
      this.notify();
    }
  }

  // --- DASHBOARD AGGREGATE METRICS ---
  public getDashboardMetrics() {
    const totalCustomers = this.customers.length;
    const activeLoans = this.loans.filter((l) => l.status === 'ACTIVE' || l.status === 'IN_ARREARS');
    const totalLoanPortfolio = this.loans.reduce((acc, l) => acc + l.principalAmount, 0);
    const totalOutstandingBalance = this.loans.reduce((acc, l) => acc + l.outstandingBalance, 0);
    const totalDisbursed = this.loans.reduce((acc, l) => acc + l.principalAmount, 0);
    const totalRepaymentsCollected = this.repayments
      .filter((r) => r.status === 'POSTED')
      .reduce((acc, r) => acc + r.amount, 0);

    const overdueLoans = this.loans.filter((l) => l.status === 'IN_ARREARS');
    const nonPerformingLoans = this.loans.filter((l) => l.status === 'DEFAULTED');
    const pendingReviewApplications = this.applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW');
    const awaitingApproval = this.applications.filter((a) => a.status === 'UNDER_REVIEW');
    const awaitingDisbursement = this.disbursements.filter((d) => d.status === 'AWAITING_DISBURSEMENT');

    // Portfolio at Risk (PAR 30) = Overdue loan balances / Total active portfolio
    const parBalance = overdueLoans.reduce((acc, l) => acc + l.outstandingBalance, 0);
    const parRatio = totalOutstandingBalance > 0 ? (parBalance / totalOutstandingBalance) * 100 : 0;

    return {
      totalCustomers,
      totalActiveLoansCount: activeLoans.length,
      totalLoanPortfolio,
      totalOutstandingBalance,
      totalDisbursed,
      totalRepaymentsCollected,
      overdueLoansCount: overdueLoans.length,
      nonPerformingLoansCount: nonPerformingLoans.length,
      pendingReviewApplicationsCount: pendingReviewApplications.length,
      awaitingApprovalCount: awaitingApproval.length,
      awaitingDisbursementCount: awaitingDisbursement.length,
      currentYield: 8.2, // average annual yield
      collectionsRate: 93.2,
      parRatio: parseFloat(parRatio.toFixed(1)),
      approvalRate: 78.5,
    };
  }
}

export const loanStore = new LoanManagementStore();
