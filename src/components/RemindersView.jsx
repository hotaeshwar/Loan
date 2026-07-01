'use client';

import React from 'react';
import { FaBell, FaCheckCircle, FaMoneyBillWave, FaExclamationCircle } from 'react-icons/fa';

const RemindersView = ({ reminders, onPayLoan }) => {
  if (reminders.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800/60 max-w-xl mx-auto mt-8 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-5 border border-slate-800 shadow-inner">
          <FaCheckCircle className="text-3xl text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-200">All caught up!</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto font-medium">
          No loan payments are due in the next 7 days. Your accounts are currently in good standing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-100 to-slate-200 bg-clip-text text-transparent">
          Payment Schedules
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">
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
                  ? 'border-rose-500/20 bg-rose-500/[0.02]' 
                  : isUrgent 
                  ? 'border-amber-500/20 bg-amber-500/[0.02]' 
                  : 'border-slate-800/80 bg-slate-900/40'
              } hover:border-slate-700/80 transition-all duration-300 shadow-lg`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-100 text-base tracking-tight">{reminder.source}</h4>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">{reminder.loan_type}</p>
                </div>
                
                <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full ${
                  isOverdue 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' 
                    : isUrgent 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {isOverdue 
                    ? 'Overdue Account!' 
                    : reminder.days_until_payment === 1 
                    ? 'Due tomorrow' 
                    : `${reminder.days_until_payment} days left`}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/30">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Monthly EMI Amount</p>
                  <p className="text-xl font-extrabold text-slate-200 mt-1 font-mono">
                    ₹{reminder.monthly_payment.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1 font-medium">
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
