import React, { useState, useEffect } from 'react';
import { loanStore, Customer, LoanAccount, RepaymentRecord } from '../../../services/api/loanManagementStore';
import { PermissionGate } from '../../../app/security/PermissionGate';
import { PERMISSIONS } from '../../../app/security/constants/permissions';
import { formatKES } from '../../../shared/utilities/currency';
import {
  Users,
  Search,
  Filter,
  Plus,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronRight,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(loanStore.getCustomers());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INDIVIDUAL' | 'BUSINESS'>('ALL');
  const [kycFilter, setKycFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'REJECTED'>('ALL');

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerModalTab, setCustomerModalTab] = useState<'PROFILE' | 'EMPLOYMENT' | 'LOANS' | 'REPAYMENTS'>('PROFILE');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // New customer form state
  const [newCustType, setNewCustType] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');
  const [newName, setNewName] = useState('');
  const [newIdType, setNewIdType] = useState<'NATIONAL_ID' | 'PASSPORT' | 'BUSINESS_REG'>('NATIONAL_ID');
  const [newIdNum, setNewIdNum] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Nairobi');
  const [newEmployer, setNewEmployer] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newIncome, setNewIncome] = useState(15000);
  const [newExpenses, setNewExpenses] = useState(6000);
  const [newNokName, setNewNokName] = useState('');
  const [newNokRel, setNewNokRel] = useState('Spouse');
  const [newNokPhone, setNewNokPhone] = useState('');

  useEffect(() => {
    return loanStore.subscribe(() => {
      setCustomers(loanStore.getCustomers());
      if (selectedCustomer) {
        setSelectedCustomer(loanStore.getCustomerById(selectedCustomer.id) || null);
      }
    });
  }, [selectedCustomer]);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.identificationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    const matchesKyc = kycFilter === 'ALL' || c.kycStatus === kycFilter;

    return matchesSearch && matchesType && matchesKyc;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loanStore.addCustomer({
      type: newCustType,
      name: newName,
      identificationType: newIdType,
      identificationNumber: newIdNum,
      email: newEmail,
      phone: newPhone,
      address: newAddress,
      city: newCity,
      employment: {
        employerName: newEmployer || 'Self Employed',
        jobTitle: newJobTitle || 'Business Proprietor',
        monthlyIncome: Number(newIncome),
        monthlyExpenses: Number(newExpenses),
      },
      nextOfKin: {
        name: newNokName,
        relationship: newNokRel,
        phone: newNokPhone,
      },
      kycStatus: 'VERIFIED',
      status: 'ACTIVE',
    });

    setShowRegisterModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewIdNum('');
    setNewEmail('');
    setNewPhone('');
    setNewAddress('');
    setNewEmployer('');
    setNewJobTitle('');
    setNewNokName('');
    setNewNokPhone('');
  };

  const customerLoans: LoanAccount[] = selectedCustomer
    ? loanStore.getLoanAccounts().filter((l) => l.customerId === selectedCustomer.id)
    : [];

  const customerRepayments: RepaymentRecord[] = selectedCustomer
    ? loanStore.getRepayments().filter((r) => r.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Module 4.2 Customer Lifecycle
            </span>
            <span className="text-xs text-slate-400">Total Borrowers: {customers.length}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized KYC profiles, corporate registration, credit exposure, and borrower ledgers.
          </p>
        </div>

        <PermissionGate
          permission={PERMISSIONS.CUSTOMERS_CREATE}
          fallback={
            <div className="text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
              Customer Registration (Requires customers.create)
            </div>
          }
        >
          <button
            onClick={() => setShowRegisterModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Customer</span>
          </button>
        </PermissionGate>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by borrower name, ID, phone, customer #"
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                typeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('INDIVIDUAL')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                typeFilter === 'INDIVIDUAL' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setTypeFilter('BUSINESS')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                typeFilter === 'BUSINESS' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Business (SME)
            </button>
          </div>

          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value as any)}
            className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">All KYC Statuses</option>
            <option value="VERIFIED">KYC Verified</option>
            <option value="PENDING">KYC Pending</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Customer Name & ID</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">KYC Status</th>
                <th className="py-3.5 px-4">Total Borrowed</th>
                <th className="py-3.5 px-4">Outstanding Balance</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-mono text-slate-500">{c.customerNumber}</span>
                      <span>•</span>
                      <span>{c.identificationType}: {c.identificationNumber}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.type === 'BUSINESS'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {c.type === 'BUSINESS' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      <span>{c.type}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-800 font-medium">{c.phone}</p>
                    <p className="text-[11px] text-slate-400">{c.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    {c.kycStatus === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {formatKES(c.totalBorrowed)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    <span className={c.outstandingBalance > 0 ? 'text-blue-700' : 'text-slate-500'}>
                      {formatKES(c.outstandingBalance)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerModalTab('PROFILE');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal with Organized Tabs */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{selectedCustomer.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                    {selectedCustomer.customerNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                    {selectedCustomer.kycStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedCustomer.city}, {selectedCustomer.address} • Phone: {selectedCustomer.phone}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loanStore.toggleCustomerStatus(selectedCustomer.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                  title="Toggle customer activation"
                >
                  Status: {selectedCustomer.status}
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2">
              <button
                onClick={() => setCustomerModalTab('PROFILE')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition ${
                  customerModalTab === 'PROFILE'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Profile & KYC
              </button>
              <button
                onClick={() => setCustomerModalTab('EMPLOYMENT')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition ${
                  customerModalTab === 'EMPLOYMENT'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Employment & Income
              </button>
              <button
                onClick={() => setCustomerModalTab('LOANS')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition ${
                  customerModalTab === 'LOANS'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Active Loans ({customerLoans.length})
              </button>
              <button
                onClick={() => setCustomerModalTab('REPAYMENTS')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition ${
                  customerModalTab === 'REPAYMENTS'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. Repayment History ({customerRepayments.length})
              </button>
            </div>

            {/* Modal Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {customerModalTab === 'PROFILE' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Entity Type:</span>
                      <strong className="text-slate-900">{selectedCustomer.type}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Identification Document:</span>
                      <strong className="text-slate-900 font-mono">
                        {selectedCustomer.identificationType} — {selectedCustomer.identificationNumber}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Primary Email:</span>
                      <span className="text-slate-800 font-medium">{selectedCustomer.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Official Phone:</span>
                      <span className="text-slate-800 font-medium">{selectedCustomer.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Physical Address:</span>
                      <span className="text-slate-800 font-medium">{selectedCustomer.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">City / Region:</span>
                      <span className="text-slate-800 font-medium">{selectedCustomer.city}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-slate-900 mb-2">Next of Kin / Authorized Corporate Contact</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Full Name:</span>
                        <strong className="text-slate-900">{selectedCustomer.nextOfKin.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Relationship:</span>
                        <strong className="text-slate-900">{selectedCustomer.nextOfKin.relationship}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Contact Phone:</span>
                        <strong className="text-slate-900">{selectedCustomer.nextOfKin.phone}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {customerModalTab === 'EMPLOYMENT' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Employer / Commercial Business:</span>
                      <strong className="text-slate-900 text-sm">{selectedCustomer.employment.employerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Designation / Role:</span>
                      <strong className="text-slate-900 text-sm">{selectedCustomer.employment.jobTitle}</strong>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Verified Monthly Revenue / Income:</span>
                      <span className="font-mono text-base font-bold text-emerald-700">
                        {formatKES(selectedCustomer.employment.monthlyIncome)}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Declared Monthly Operating Expenses:</span>
                      <span className="font-mono text-base font-bold text-slate-700">
                        {formatKES(selectedCustomer.employment.monthlyExpenses)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <strong>Debt Affordability Ratio:</strong> Net disposable surplus:{' '}
                    {formatKES(
                      selectedCustomer.employment.monthlyIncome - selectedCustomer.employment.monthlyExpenses
                    )}{' '}
                    / month. Used during credit scoring.
                  </div>
                </div>
              )}

              {customerModalTab === 'LOANS' && (
                <div className="space-y-3">
                  {customerLoans.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No disbursed loans recorded for this customer yet.
                    </div>
                  ) : (
                    customerLoans.map((l) => (
                      <div key={l.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 text-sm">{l.loanNumber}</span>
                            <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                              {l.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{l.productName} • {l.termMonths} Months</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Disbursed on {l.disbursementDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-slate-900 text-sm">{formatKES(l.outstandingBalance)}</p>
                          <span className="text-[11px] text-slate-400">Balance of {formatKES(l.principalAmount)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {customerModalTab === 'REPAYMENTS' && (
                <div className="space-y-3">
                  {customerRepayments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No repayment transactions posted for this customer yet.
                    </div>
                  ) : (
                    customerRepayments.map((r) => (
                      <div key={r.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-slate-900">{r.referenceNumber}</span>
                          <p className="text-[11px] text-slate-500">{r.loanNumber} via {r.paymentMethod}</p>
                          <p className="text-[10px] text-slate-400">{new Date(r.timestampUtc).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-700 text-sm">+{formatKES(r.amount)}</span>
                          <p className="text-[10px] text-slate-400">Principal: {formatKES(r.allocatedPrincipal)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Customer Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Onboard New Customer (Module 4.2)</h3>
                <p className="text-xs text-slate-300 mt-0.5">Register borrower entity and initiate KYC profile</p>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Customer Entity Type</label>
                  <select
                    value={newCustType}
                    onChange={(e) => setNewCustType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value="INDIVIDUAL">Individual Borrower</option>
                    <option value="BUSINESS">Business / Corporate (SME)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal / Commercial Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Samuel Kibet or Peak Horizon Ltd"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ID Document Type</label>
                  <select
                    value={newIdType}
                    onChange={(e) => setNewIdType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value="NATIONAL_ID">National ID Card</option>
                    <option value="PASSPORT">International Passport</option>
                    <option value="BUSINESS_REG">Company Certificate of Registration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ID / Registration Number</label>
                  <input
                    type="text"
                    value={newIdNum}
                    onChange={(e) => setNewIdNum(e.target.value)}
                    placeholder="e.g. ID-38291048"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="borrower@example.com"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+254 700 000 000"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. House 12, Park Road"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City / Municipality</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Nairobi"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Employment & Financials
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Employer / Enterprise</label>
                    <input
                      type="text"
                      value={newEmployer}
                      onChange={(e) => setNewEmployer(e.target.value)}
                      placeholder="e.g. Safaricom PLC"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Job Designation</label>
                    <input
                      type="text"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      placeholder="e.g. Network Engineer"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Monthly Income (KES)</label>
                    <input
                      type="number"
                      value={newIncome}
                      onChange={(e) => setNewIncome(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Monthly Expenses (KES)</label>
                    <input
                      type="number"
                      value={newExpenses}
                      onChange={(e) => setNewExpenses(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Next of Kin / Authorized Representative
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newNokName}
                      onChange={(e) => setNewNokName(e.target.value)}
                      placeholder="Next of Kin Name"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={newNokRel}
                      onChange={(e) => setNewNokRel(e.target.value)}
                      placeholder="Spouse / Parent / Partner"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={newNokPhone}
                      onChange={(e) => setNewNokPhone(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Register Customer & Verify KYC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
