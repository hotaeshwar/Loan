'use client';

import React from 'react';
import { 
  FaCreditCard, 
  FaCheckCircle, 
  FaTrash, 
  FaCalendarAlt, 
  FaCoins, 
  FaPercentage,
  FaMoneyBillWave
} from 'react-icons/fa';

const LoansList = ({ loans, onPayment, onDelete }) => {
  if (loans.length === 0) {
    return (
      <div className="glass-panel bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto mt-8 animate-fadeIn shadow-md">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-5 border border-slate-100 shadow-inner">
          <FaCreditCard className="text-3xl text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No active accounts</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto font-medium">
          Get started by adding your first loan account to track principal progress, payments, and schedules.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
            Loan Accounts
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage your debt principal paydowns and actions
          </p>
        </div>
        <span className="text-xs bg-white border border-slate-200 px-3.5 py-1.5 rounded-full font-semibold text-slate-650 tracking-wider shadow-sm">
          {loans.length} Accounts
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {loans.map((loan) => {
          const paidPercentage = loan.total_amount > 0 ? ((loan.paid_amount / loan.total_amount) * 100).toFixed(1) : 0;
          
          return (
            <div 
              key={loan.id} 
              className="relative group overflow-hidden rounded-2xl"
            >
              {/* Card Outer Glow Border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

              <div className="relative glass-panel bg-white p-6 rounded-2xl shadow-md border border-slate-200/80 hover:border-slate-350 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Info Column */}
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <FaCoins className="text-sm" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight truncate pl-1">
                        {loan.source}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100/60 rounded-full">
                        {loan.loan_type}
                      </span>
                      {loan.is_fully_paid ? (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full flex items-center gap-1.5">
                          <FaCheckCircle className="text-xs" />
                          <span>Fully Settled</span>
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Numeric Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 font-mono">
                      <div className="space-y-1">
                        <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider block font-sans">Principal</span>
                        <span className="text-sm font-bold text-slate-750">₹{loan.total_amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider block font-sans">Total Paid</span>
                        <span className="text-sm font-bold text-emerald-600">₹{loan.paid_amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider block font-sans">Outstanding</span>
                        <span className="text-sm font-bold text-rose-600">₹{loan.remaining_amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider block font-sans">Monthly EMI</span>
                        <span className="text-sm font-bold text-slate-750">₹{loan.monthly_payment.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {!loan.is_fully_paid && loan.next_payment_date && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-550 font-medium">
                        <FaCalendarAlt className="text-slate-400" />
                        <span>Next Payment Due:</span>
                        <span className="font-semibold text-slate-700">
                          {new Date(loan.next_payment_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
                    {!loan.is_fully_paid && (
                      <button
                        onClick={() => onPayment(loan)}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        <FaMoneyBillWave className="text-xs" />
                        <span>Make Payment</span>
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(loan.id)}
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-rose-250 hover:bg-rose-50/50 text-slate-500 hover:text-rose-650 rounded-xl text-xs font-bold shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <FaTrash className="text-xs" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <FaPercentage className="text-[10px] text-indigo-500" />
                      <span>Paydown Progress</span>
                    </span>
                    <span className="text-indigo-600 font-mono">{paidPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 border border-slate-200/60 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-450 h-2.5 rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${paidPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoansList;
