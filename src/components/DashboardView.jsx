'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaCreditCard, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaCalendarAlt, 
  FaDownload, 
  FaChartPie, 
  FaArrowRight 
} from 'react-icons/fa';

const DashboardView = ({ loans, reminders, onPayLoan, onViewTab }) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      setTimeString(`${datePart} • ${timePart}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute dashboard metrics from active loans state
  const total_borrowed = loans.reduce((sum, l) => sum + l.total_amount, 0);
  const total_paid = loans.reduce((sum, l) => sum + l.paid_amount, 0);
  const total_remaining = loans.reduce((sum, l) => sum + l.remaining_amount, 0);
  const total_loans = loans.length;
  const active_loans = loans.filter(l => !l.is_fully_paid).length;
  const completed_loans = loans.filter(l => l.is_fully_paid).length;
  
  // Calculate monthly EMIs due for active loans
  const monthly_payment_due = loans
    .filter(l => !l.is_fully_paid)
    .reduce((sum, l) => sum + l.monthly_payment, 0);

  // CSV export handler
  const handleExportCSV = () => {
    if (loans.length === 0) return;
    
    // Define headers and map rows
    const headers = ['Source', 'Loan Type', 'Total Amount (INR)', 'Paid Amount (INR)', 'Remaining (INR)', 'Monthly EMI (INR)', 'First Payment Date', 'Next Payment Date', 'Status'];
    const rows = loans.map(l => [
      l.source,
      l.loan_type,
      l.total_amount,
      l.paid_amount,
      l.remaining_amount,
      l.monthly_payment,
      l.first_payment_date || 'N/A',
      l.next_payment_date || 'N/A',
      l.is_fully_paid ? 'Paid' : 'Active'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BiD_LoanManager_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cards = [
    {
      title: 'Total Borrowed',
      value: `₹${total_borrowed.toLocaleString('en-IN')}`,
      icon: <FaCreditCard className="text-blue-600" />,
      styleClass: 'glass-card-blue',
      glow: 'shadow-blue-500/5'
    },
    {
      title: 'Total Paid',
      value: `₹${total_paid.toLocaleString('en-IN')}`,
      icon: <FaCheckCircle className="text-emerald-600" />,
      styleClass: 'glass-card-green',
      glow: 'shadow-emerald-500/5'
    },
    {
      title: 'Remaining Balance',
      value: `₹${total_remaining.toLocaleString('en-IN')}`,
      icon: <FaExclamationTriangle className="text-rose-600" />,
      styleClass: 'glass-card-rose',
      glow: 'shadow-rose-500/5'
    },
    {
      title: 'Monthly EMI Due',
      value: `₹${monthly_payment_due.toLocaleString('en-IN')}`,
      icon: <FaCalendarAlt className="text-amber-600" />,
      styleClass: 'glass-card-amber',
      glow: 'shadow-amber-500/5'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
            Workspace Overview
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-slate-500 text-sm mt-1 font-medium">
            <span>Real-time analytics and tracking summary</span>
            <span className="hidden sm:inline text-slate-350">•</span>
            {timeString && (
              <span className="text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100 font-mono tracking-wide shadow-sm text-xs animate-fadeIn">
                {timeString}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            disabled={loans.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaDownload className="text-xs" />
            <span>Export CSV</span>
          </button>
          
          {/* Quick Alert Indicator */}
          <div 
            onClick={() => onViewTab('reminders')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-750 hover:bg-indigo-100 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <FaBell className="text-xs text-glow-blue animate-pulse" />
            <span>{reminders.length} Dues Pending</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className={`glass-panel ${card.styleClass} p-6 rounded-2xl shadow-md ${card.glow} hover:shadow-xl hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2 font-mono">
                  {card.value}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-inner text-xl">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 border border-rose-500/10 hover:border-rose-500/20 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100 text-xl font-bold">
            {active_loans}
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Loans</h3>
            <p className="text-2xl font-bold text-slate-850 mt-1">{active_loans} Open Accounts</p>
          </div>
        </div>

        <div className="glass-panel bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 text-xl font-bold">
            {completed_loans}
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Completed Loans</h3>
            <p className="text-2xl font-bold text-slate-850 mt-1">{completed_loans} Paid Accounts</p>
          </div>
        </div>

        <div className="glass-panel bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 border border-indigo-100 text-xl font-bold">
            {total_loans}
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Loans</h3>
            <p className="text-2xl font-bold text-slate-850 mt-1">{total_loans} Total Accounts</p>
          </div>
        </div>
      </div>

      {/* Portfolio Progress & Upcoming Dues */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Payment Progress Block */}
        <div className="glass-panel bg-white p-6 rounded-2xl shadow-md lg:col-span-3 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FaChartPie className="text-indigo-600 text-sm" />
              <span>Portfolio Allocation</span>
            </h3>
            <p className="text-slate-500 text-xs font-medium">Visualizing overall paydown analytics</p>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-end text-sm">
              <div>
                <span className="text-slate-500 block text-xs font-semibold uppercase">Total Paid Ratio</span>
                <span className="text-3xl font-extrabold text-indigo-650 mt-1 block">
                  {total_borrowed > 0 ? ((total_paid / total_borrowed) * 100).toFixed(1) : '0'}%
                </span>
              </div>
              <span className="text-slate-500 text-xs font-medium font-mono text-right">
                ₹{total_paid.toLocaleString('en-IN')} / ₹{total_borrowed.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="relative w-full h-4 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-450 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${total_borrowed > 0 ? (total_paid / total_borrowed) * 100 : 0}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Principal Paid: ₹{total_paid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Remaining Principal: ₹{total_remaining.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Dues Preview */}
        <div className="glass-panel bg-white p-6 rounded-2xl shadow-md lg:col-span-2 space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FaBell className="text-amber-500 text-sm" />
              <span>Upcoming Dues</span>
            </h3>
            <p className="text-slate-500 text-xs font-medium">Critical EMI schedules</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] pr-1">
            {reminders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6">
                <FaCheckCircle className="text-emerald-500/20 text-3xl mb-2" />
                <p className="text-slate-500 text-xs font-semibold">No Pending Dues</p>
                <p className="text-slate-400 text-[10px] mt-0.5">All accounts are currently in good standing.</p>
              </div>
            ) : (
              reminders.slice(0, 3).map((reminder) => (
                <div 
                  key={reminder.loan_id} 
                  className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:border-slate-200 transition-all duration-300"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-xs truncate">{reminder.source}</p>
                    <p className="text-slate-500 text-[10px] truncate mt-0.5">{reminder.loan_type}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-850 text-xs font-mono">₹{reminder.monthly_payment.toLocaleString('en-IN')}</p>
                    <span className={`inline-block text-[9px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                      reminder.days_until_payment <= 3 
                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {reminder.days_until_payment <= 0 ? 'Overdue!' :
                       reminder.days_until_payment === 1 ? 'Due tomorrow' :
                       `${reminder.days_until_payment}d left`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {reminders.length > 3 && (
            <button 
              onClick={() => onViewTab('reminders')}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-indigo-650 rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <span>View all {reminders.length} schedules</span>
              <FaArrowRight className="text-[10px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
