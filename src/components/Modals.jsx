'use client';

import React, { useState } from 'react';
import { FaTimes, FaCoins, FaCalendarAlt, FaPlus, FaCheckCircle, FaClipboardList, FaFileInvoiceDollar } from 'react-icons/fa';

export const LoanFormModal = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    source: '',
    loan_type: '',
    total_amount: '',
    tenure_months: '',
    monthly_payment: '',
    first_payment_date: ''
  });

  const calculateSuggestedPayment = () => {
    if (formData.total_amount && formData.tenure_months) {
      return (parseFloat(formData.total_amount) / parseInt(formData.tenure_months)).toFixed(2);
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      source: formData.source,
      loan_type: formData.loan_type,
      total_amount: parseFloat(formData.total_amount),
      tenure_months: parseInt(formData.tenure_months),
      monthly_payment: parseFloat(formData.monthly_payment),
      first_payment_date: formData.first_payment_date || null
    });
  };

  const suggested = calculateSuggestedPayment();

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      {/* Modal Card wrapper with glowing gradient border */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-25"></div>
        
        <div className="relative bg-[#0d1322] border border-slate-800/80 rounded-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <FaPlus className="text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">Add Loan Account</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Creditor / Source Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                placeholder="e.g., Chase Bank, HDFC"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Loan Category / Type
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
                value={formData.loan_type}
                onChange={(e) => setFormData({...formData, loan_type: e.target.value})}
                placeholder="e.g., Auto Loan, Mortgage"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Total Principal (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm font-mono"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
                  placeholder="5,00,000"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm font-mono"
                  value={formData.tenure_months}
                  onChange={(e) => setFormData({...formData, tenure_months: e.target.value})}
                  placeholder="36"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Monthly EMI (₹)
                </label>
                {suggested && (
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                    Suggested: ₹{suggested}
                  </span>
                )}
              </div>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm font-mono"
                value={formData.monthly_payment}
                onChange={(e) => setFormData({...formData, monthly_payment: e.target.value})}
                placeholder="15,000"
              />
              {suggested && (
                <button
                  type="button"
                  onClick={() => setFormData({...formData, monthly_payment: suggested})}
                  className="mt-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <FaCheckCircle className="text-[10px]" />
                  <span>Apply suggested payment auto-fill</span>
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                First Payment Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
                  value={formData.first_payment_date}
                  onChange={(e) => setFormData({...formData, first_payment_date: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800/40">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const PaymentFormModal = ({ loan, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      loan_id: loan.id,
      amount: parseFloat(amount),
      notes: notes.trim() || null
    });
  };

  const quickAmounts = [
    { label: 'Monthly EMI', value: loan.monthly_payment },
    { label: 'Half EMI', value: loan.monthly_payment / 2 },
    { label: 'Payoff Account', value: loan.remaining_amount }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      {/* Modal Card wrapper with glowing gradient border */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25"></div>
        
        <div className="relative bg-[#0d1322] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <FaFileInvoiceDollar className="text-emerald-400" />
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">Record Payment</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

          {/* Quick Summary Context */}
          <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1 text-sm font-medium">
            <p className="text-slate-400 text-xs flex justify-between">
              <span>Account Creditor</span>
              <span className="text-slate-300 font-bold">{loan.source} ({loan.loan_type})</span>
            </p>
            <p className="text-slate-400 text-xs flex justify-between pt-1">
              <span>Outstanding Balance</span>
              <span className="text-rose-400 font-bold font-mono">₹{loan.remaining_amount.toLocaleString('en-IN')}</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Select Amount
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((q, idx) => {
                const isPayoff = q.label === 'Payoff Account';
                const formatted = q.value.toLocaleString('en-IN');
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAmount(q.value.toString())}
                    className="py-2 px-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-indigo-400 hover:text-indigo-300 rounded-xl text-[10px] font-bold tracking-wide transition-all text-center cursor-pointer"
                  >
                    <p className="text-slate-500 font-sans text-[8px] uppercase tracking-wider mb-0.5">{q.label}</p>
                    <span className="font-mono">₹{formatted}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Transaction Amount (₹)
              </label>
              <input
                type="number"
                required
                min="0.01"
                max={loan.remaining_amount}
                step="0.01"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-sm font-mono"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Payment Reference / Notes
              </label>
              <textarea
                rows="2"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm leading-relaxed"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Bank Transfer, GPay ref #1234"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800/40">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Post Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
