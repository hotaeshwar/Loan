'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaHome, 
  FaList, 
  FaBell, 
  FaSignOutAlt, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight
} from 'react-icons/fa';
import Image from 'next/image';

// Firebase imports
import { 
  auth, 
  db, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  onAuthStateChanged,
  signOut
} from '../lib/firebase';

// Component imports
import AuthForm from '../components/AuthForm';
import DashboardView from '../components/DashboardView';
import LoansList from '../components/LoansList';
import RemindersView from '../components/RemindersView';
import { LoanFormModal, PaymentFormModal } from '../components/Modals';

// Custom dialog for upcoming payments popup
const ReminderPopup = ({ reminders, onClose, onPayLoan }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      {/* Container with gold gradient glow */}
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-30"></div>
        
        <div className="relative bg-[#0d1322] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 p-3 border border-amber-500/30 rounded-xl text-amber-400 text-xl animate-pulse">
                <FaBell />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Dues Outstanding</h2>
                <p className="text-amber-400/80 text-xs font-semibold mt-0.5">
                  You have {reminders.length} schedule{reminders.length !== 1 ? 's' : ''} due within 7 days
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

          {/* Dues list scrollable */}
          <div className="p-6 max-h-[320px] overflow-y-auto space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.loan_id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                  reminder.days_until_payment <= 3
                    ? 'bg-rose-500/[0.02] border-rose-500/20'
                    : 'bg-amber-500/[0.02] border-amber-500/20'
                }`}
              >
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">{reminder.source}</h3>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-0.5">{reminder.loan_type}</p>
                  
                  <span className="text-[10px] text-slate-400 block mt-2 font-mono">
                    Due: {new Date(reminder.next_payment_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-slate-100 font-mono">
                      ₹{reminder.monthly_payment.toLocaleString('en-IN')}
                    </p>
                    <span className={`text-[10px] font-bold block mt-0.5 ${
                      reminder.days_until_payment <= 3 ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {reminder.days_until_payment <= 0 
                        ? 'OVERDUE!' 
                        : reminder.days_until_payment === 1 
                        ? 'DUE TOMORROW' 
                        : `${reminder.days_until_payment} DAYS LEFT`}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      onPayLoan(reminder);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md cursor-pointer"
                  >
                    <FaArrowRight className="text-[10px]" />
                    <span>Pay EMI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-slate-950/40 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-slate-800/80">
            <p className="text-slate-500 text-[10px] font-medium leading-normal text-center sm:text-left">
              💡 Setup reminders to track cashflow effectively.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const playAlertTone = (type = 'success') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'success') {
      // Rising double chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.value = 600;
      gain1.gain.setValueAtTime(0.04, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);
      
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.value = 800;
        gain2.gain.setValueAtTime(0.04, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.3);
      }, 80);
    } else if (type === 'error') {
      // Low buzz warn beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 160;
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.15);
      gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'reminder') {
      // Ambient notification bell
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 523.25; // C5
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (error) {
    console.error('AudioContext chime failed:', error);
  }
};

const MainDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loans, setLoans] = useState([]);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [hasShownReminder, setHasShownReminder] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    playAlertTone(type);
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'loans'),
      where('userId', '==', user.uid),
      orderBy('created_date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoans(loansData);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle reminder popup triggers
  useEffect(() => {
    if (user && loans.length > 0 && !hasShownReminder) {
      const activeReminders = calculateReminders();
      if (activeReminders.length > 0) {
        const timer = setTimeout(() => {
          setShowReminderPopup(true);
          setHasShownReminder(true);
          playAlertTone('reminder');
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user, loans, hasShownReminder]);

  const calculateReminders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return loans
      .filter(loan => !loan.is_fully_paid)
      .map(loan => {
        const nextPayment = new Date(loan.next_payment_date);
        nextPayment.setHours(0, 0, 0, 0);
        const diffTime = nextPayment - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          loan_id: loan.id,
          source: loan.source,
          loan_type: loan.loan_type,
          monthly_payment: loan.monthly_payment,
          next_payment_date: loan.next_payment_date,
          days_until_payment: diffDays
        };
      })
      .filter(reminder => reminder.days_until_payment <= 7)
      .sort((a, b) => a.days_until_payment - b.days_until_payment);
  };

  const handleCreateLoan = async (loanData) => {
    try {
      const firstPaymentDate = loanData.first_payment_date || new Date().toISOString().split('T')[0];
      
      await addDoc(collection(db, 'loans'), {
        ...loanData,
        userId: user.uid,
        paid_amount: 0,
        remaining_amount: loanData.total_amount,
        is_fully_paid: false,
        created_date: serverTimestamp(),
        first_payment_date: firstPaymentDate,
        next_payment_date: firstPaymentDate
      });

      setShowLoanForm(false);
      showNotification('Loan account added successfully!');
    } catch (error) {
      showNotification('Failed to create loan account', 'error');
      console.error('Create loan error:', error);
    }
  };

  const handleMakePayment = async (paymentData) => {
    try {
      const loanRef = doc(db, 'loans', paymentData.loan_id);
      const loan = loans.find(l => l.id === paymentData.loan_id);
      if (!loan) return;
      
      const newPaidAmount = loan.paid_amount + paymentData.amount;
      const newRemainingAmount = loan.total_amount - newPaidAmount;
      const isFullyPaid = newRemainingAmount <= 0;

      // Calculate next payment date (add 30 days)
      const currentNextPayment = new Date(loan.next_payment_date);
      currentNextPayment.setDate(currentNextPayment.getDate() + 30);
      const nextPaymentDate = currentNextPayment.toISOString().split('T')[0];

      // Update loan
      await updateDoc(loanRef, {
        paid_amount: newPaidAmount,
        remaining_amount: Math.max(0, newRemainingAmount),
        is_fully_paid: isFullyPaid,
        next_payment_date: isFullyPaid ? loan.next_payment_date : nextPaymentDate
      });

      // Add payment record
      await addDoc(collection(db, 'payments'), {
        loan_id: paymentData.loan_id,
        userId: user.uid,
        amount: paymentData.amount,
        notes: paymentData.notes,
        payment_date: serverTimestamp()
      });

      setShowPaymentForm(false);
      setSelectedLoan(null);
      showNotification('Payment transaction posted successfully!');
    } catch (error) {
      showNotification('Failed to post payment transaction', 'error');
      console.error('Payment error:', error);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (window.confirm('Are you sure you want to delete this loan account? This will also remove associated transaction history.')) {
      try {
        await deleteDoc(doc(db, 'loans', loanId));
        
        // Delete associated payments
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('loan_id', '==', loanId)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const promises = paymentsSnapshot.docs.map(paymentDoc => deleteDoc(doc(db, 'payments', paymentDoc.id)));
        await Promise.all(promises);

        showNotification('Loan account deleted successfully!');
      } catch (error) {
        showNotification('Failed to delete loan account', 'error');
        console.error('Delete loan error:', error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showNotification('Signed out of workspace.');
    } catch (error) {
      showNotification('Failed to sign out', 'error');
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'loans', label: 'Loan Accounts', icon: <FaList /> },
    { id: 'reminders', label: 'Payment Schedules', icon: <FaBell /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 text-sm font-semibold tracking-wide">Syncing workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  const reminders = calculateReminders();

  return (
    <div className="min-h-screen bg-[#070a13] flex text-slate-100">
      {/* Sidebar Panel */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-[#090e1a]/95 border-r border-slate-800/80 transition-transform duration-300 ease-in-out flex flex-col justify-between`}
      >
        <div className="flex-1 py-6">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-6 pb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt="BiD Logo" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">BiD LoanManager</h1>
                <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Portal</p>
              </div>
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-950 border border-slate-900"
            >
              <FaTimes />
            </button>
          </div>

          {/* User Details Banner */}
          <div className="m-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-900/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-sm">
              <FaUser />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Active User</p>
              <p className="text-xs font-semibold text-slate-300 truncate mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 text-left rounded-xl transition-all font-semibold text-sm cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold shadow-md shadow-indigo-950/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.id === 'reminders' && reminders.length > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5 border border-rose-600 animate-pulse">
                      {reminders.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/60">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Sign Out Workspace</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <div className="bg-[#090e1a]/80 backdrop-blur-md border-b border-slate-800/60 px-6 py-4 flex items-center justify-between lg:justify-end gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-slate-200 p-2 hover:bg-slate-900 rounded-xl border border-slate-900 flex-shrink-0 cursor-pointer"
          >
            <FaBars className="text-lg" />
          </button>

          <div className="flex items-center gap-4">
            {/* Bell Alert Trigger */}
            <button
              onClick={() => {
                if (reminders.length > 0) {
                  setShowReminderPopup(true);
                } else {
                  showNotification('All payments caught up!');
                }
              }}
              className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 shadow-md cursor-pointer transition-all"
            >
              <FaBell className={reminders.length > 0 ? 'text-amber-400 animate-pulse' : ''} />
              {reminders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 border border-rose-600 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {reminders.length}
                </span>
              )}
            </button>

            {/* Quick Action Add Loan */}
            <button
              onClick={() => setShowLoanForm(true)}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-950/40 text-xs flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <FaPlus className="text-[10px]" />
              <span>Add Loan</span>
            </button>
          </div>
        </div>

        {/* Content Render Panel */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView 
              loans={loans} 
              reminders={reminders}
              onPayLoan={(reminder) => {
                const target = loans.find(l => l.id === reminder.loan_id);
                if (target) {
                  setSelectedLoan(target);
                  setShowPaymentForm(true);
                }
              }}
              onViewTab={setCurrentView}
            />
          )}

          {currentView === 'loans' && (
            <LoansList
              loans={loans}
              onPayment={(loan) => {
                setSelectedLoan(loan);
                setShowPaymentForm(true);
              }}
              onDelete={handleDeleteLoan}
            />
          )}

          {currentView === 'reminders' && (
            <RemindersView 
              reminders={reminders} 
              onPayLoan={(reminder) => {
                const target = loans.find(l => l.id === reminder.loan_id);
                if (target) {
                  setSelectedLoan(target);
                  setShowPaymentForm(true);
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Modals & Dialog overlays */}
      {showLoanForm && (
        <LoanFormModal
          onSubmit={handleCreateLoan}
          onCancel={() => setShowLoanForm(false)}
        />
      )}

      {showPaymentForm && selectedLoan && (
        <PaymentFormModal
          loan={selectedLoan}
          onSubmit={handleMakePayment}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedLoan(null);
          }}
        />
      )}

      {showReminderPopup && reminders.length > 0 && (
        <ReminderPopup
          reminders={reminders}
          onClose={() => setShowReminderPopup(false)}
          onPayLoan={(reminder) => {
            const target = loans.find(l => l.id === reminder.loan_id);
            if (target) {
              setSelectedLoan(target);
              setShowPaymentForm(true);
            }
          }}
        />
      )}

      {/* Elegant Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          {/* Inner glass wrapper */}
          <div className="relative">
            <div className={`absolute -inset-0.5 ${
              notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
            } rounded-xl blur opacity-30`}></div>
            
            <div className="relative bg-[#0d1322] border border-slate-800 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3">
              {notification.type === 'success' ? (
                <FaCheckCircle className="text-emerald-400 text-base" />
              ) : (
                <FaExclamationTriangle className="text-rose-400 text-base" />
              )}
              <span className="text-slate-200 text-xs font-semibold tracking-wide">
                {notification.message}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar mobile overlay backdrops */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs lg:hidden z-40 animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default function Page() {
  return <MainDashboard />;
}
