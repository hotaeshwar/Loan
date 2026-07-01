'use client';

import React from 'react';
import { FaBell, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const RemindersView = ({ reminders, onPayLoan }) => {
  if (reminders.length === 0) {
    return (
      <div className="glass-panel bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto mt-8 animate-fadeIn shadow-md">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-5 border border-slate-100 shadow-inner">
          <FaCheckCircle className="text-3xl text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">All caught up!</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto font-medium">
          No loan payments are due in the next 7 days. Your accounts are currently in good standing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Payment Schedules
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Monitor your upcoming loan EMIs and schedules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reminders.map((reminder) => {
          const isOverdue = reminder.days_until_payment <= 0;
          const isUrgent = reminder.days_until_payment <= 3;
          
          return (
            <div 
              key={reminder.loan_id} 
              className={`relative overflow-hidden rounded-2xl glass-panel p-5 border ${
                isOverdue 
                  ? 'border-rose-300 bg-rose-50/40 shadow-sm' 
                  : isUrgent 
                  ? 'border-amber-300 bg-amber-50/40 shadow-sm' 
                  : 'border-slate-200 bg-white shadow-md'
              } hover:border-slate-350 transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-base tracking-tight">{reminder.source}</h4>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">{reminder.loan_type}</p>
                </div>
                
                <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full border ${
                  isOverdue 
                    ? 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse' 
                    : isUrgent 
                    ? 'bg-amber-100 text-amber-700 border-amber-200' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                }`}>
                  {isOverdue 
                    ? 'Overdue Account!' 
                    : reminder.days_until_payment === 1 
                    ? 'Due tomorrow' 
                    : `${reminder.days_until_payment} days left`}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Monthly EMI Amount</p>
                  <p className="text-xl font-extrabold text-slate-800 mt-1 font-mono">
                    ₹{reminder.monthly_payment.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1 font-medium font-sans">
                    Due Date: {new Date(reminder.next_payment_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <button
                  onClick={() => onPayLoan(reminder)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md cursor-pointer"
                >
                  <FaMoneyBillWave />
                  <span>Pay Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RemindersView;
