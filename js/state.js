/**
 * RiskShield AI - Centralized Reactive State Store
 * Controls data persistence, user authentication database, onboarding states, and reactive subscriptions.
 */

import { INITIAL_BANK, INITIAL_TRANSACTIONS, INITIAL_ALERTS, INITIAL_CASES } from './mockData.js';
import { analyzeTransactionRisk } from './aiEngine.js';

const STORAGE_KEY = 'riskshield_state_v2';

const DEFAULT_EXISTING_USER = {
  name: 'Alex Dawson',
  email: 'alex.dawson@riskshield.ai',
  password: 'demo123',
  role: 'Lead Risk Analyst',
  avatar: 'AD',
  onboardingCompleted: true,
  bankConnection: { ...INITIAL_BANK }
};

class StateStore {
  constructor() {
    this.subscribers = [];
    this.state = {
      isLoggedIn: false,
      currentUser: null,
      bankConnection: null,
      usersDatabase: [ { ...DEFAULT_EXISTING_USER } ],
      transactions: [],
      alerts: [],
      cases: [],
      notifications: [
        { id: 'n1', title: 'System Online', message: 'AI Payment Risk Engine v4.2 initialized successfully.', time: '08:00 AM', unread: true },
        { id: 'n2', title: 'Critical Alert', message: 'TXN-90821 flagged for cross-border anomaly.', time: '09:42 AM', unread: true }
      ],
      liveMonitoring: {
        active: true,
        tpm: 48,
        safeCountToday: 184,
        threatCountToday: 4,
        avgRiskScore: 24
      },
      activeRoute: 'login',
      generatedReports: [
        { id: 'REP-2026-09', title: 'Q3 Payment Fraud Intelligence Briefing', date: '2026-09-01', size: '2.4 MB', type: 'PDF' }
      ]
    };

    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = { ...this.state, ...parsed };
      } else {
        // Initialize default seed data
        this.state.isLoggedIn = false;
        this.state.currentUser = null;
        this.state.bankConnection = null;
        this.state.usersDatabase = [ { ...DEFAULT_EXISTING_USER } ];
        this.state.transactions = [...INITIAL_TRANSACTIONS];
        this.state.alerts = [...INITIAL_ALERTS];
        this.state.cases = [...INITIAL_CASES];
        this.save();
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage, initializing fresh default state:', e);
      this.state.isLoggedIn = false;
      this.state.currentUser = null;
      this.state.bankConnection = null;
      this.state.usersDatabase = [ { ...DEFAULT_EXISTING_USER } ];
      this.state.transactions = [...INITIAL_TRANSACTIONS];
      this.state.alerts = [...INITIAL_ALERTS];
      this.state.cases = [...INITIAL_CASES];
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
  }

  subscribe(listener) {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter(l => l !== listener);
    };
  }

  notify() {
    this.save();
    this.subscribers.forEach(listener => listener(this.state));
  }

  getState() {
    return this.state;
  }

  // --- AUTHENTICATION & USER MANAGEMENT ACTIONS ---

  registerUser({ name, email, password }) {
    if (!this.state.usersDatabase) this.state.usersDatabase = [];

    const existing = this.state.usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser = {
      name,
      email,
      password,
      role: 'Risk Analyst',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'RA',
      onboardingCompleted: false,
      bankConnection: null
    };

    this.state.usersDatabase.push(newUser);
    this.state.currentUser = newUser;
    this.state.isLoggedIn = true;
    this.state.bankConnection = null;

    this.notify();
    return { success: true, user: newUser };
  }

  login(email, password) {
    if (!this.state.usersDatabase) this.state.usersDatabase = [ { ...DEFAULT_EXISTING_USER } ];

    let user = this.state.usersDatabase.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    
    // If not found in database, auto-register as an existing user for demo flexibility
    if (!user) {
      user = {
        name: email.split('@')[0].replace('.', ' ') || 'Risk Analyst',
        email: email,
        password: password || 'demo123',
        role: 'Risk Analyst',
        avatar: 'RA',
        onboardingCompleted: true,
        bankConnection: { ...INITIAL_BANK }
      };
      this.state.usersDatabase.push(user);
    }

    this.state.isLoggedIn = true;
    this.state.currentUser = user;
    this.state.bankConnection = user.bankConnection || null;

    this.notify();
    return { success: true, user };
  }

  logout() {
    this.state.isLoggedIn = false;
    this.state.currentUser = null;
    this.state.bankConnection = null;
    this.notify();
  }

  resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    this.state.isLoggedIn = false;
    this.state.currentUser = null;
    this.state.bankConnection = null;
    this.state.usersDatabase = [ { ...DEFAULT_EXISTING_USER } ];
    this.state.transactions = [...INITIAL_TRANSACTIONS];
    this.state.alerts = [...INITIAL_ALERTS];
    this.state.cases = [...INITIAL_CASES];
    this.save();
  }

  connectBank(bankDetails) {
    const connectedBank = {
      bankName: bankDetails.bankName || 'HDFC Bank',
      accountType: bankDetails.accountType || 'Savings Account',
      accountNumber: bankDetails.accountNumber || '•••• ' + Math.floor(1000 + Math.random() * 9000),
      accountHolder: bankDetails.accountHolder || (this.state.currentUser ? this.state.currentUser.name : 'Analyst'),
      balance: bankDetails.balance || 250000,
      currency: 'INR',
      connected: true,
      connectedAt: new Date().toISOString()
    };

    this.state.bankConnection = connectedBank;

    if (this.state.currentUser) {
      this.state.currentUser.bankConnection = connectedBank;
      this.state.currentUser.onboardingCompleted = true;

      // Update in usersDatabase array
      const dbUser = this.state.usersDatabase.find(u => u.email === this.state.currentUser.email);
      if (dbUser) {
        dbUser.bankConnection = connectedBank;
        dbUser.onboardingCompleted = true;
      }
    }

    this.notify();
  }

  setRoute(route) {
    this.state.activeRoute = route;
    this.notify();
  }

  addNotification(title, message) {
    this.state.notifications.unshift({
      id: 'n-' + Date.now(),
      title,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: true
    });
    this.notify();
  }

  clearNotifications() {
    this.state.notifications = [];
    this.notify();
  }

  // Simulate a live safe or fraud transaction
  simulateTransaction(type = 'SAFE') {
    const isFraud = type === 'FRAUD';
    const now = new Date();

    const safeRecipients = [
      { recipient: 'Swiggy Food', merchant: 'Swiggy India', category: 'Food & Dining', minAmt: 200, maxAmt: 1200, method: 'UPI' },
      { recipient: 'Zomato Gold', merchant: 'Zomato Media', category: 'Food & Dining', minAmt: 300, maxAmt: 900, method: 'UPI' },
      { recipient: 'Amazon India', merchant: 'Amazon Retail', category: 'E-Commerce', minAmt: 500, maxAmt: 5000, method: 'Credit Card' },
      { recipient: 'Airtel Bill', merchant: 'Telecom Pay', category: 'Utilities', minAmt: 299, maxAmt: 899, method: 'UPI' },
      { recipient: 'Reliancedigital Store', merchant: 'Reliance Retail', category: 'Shopping', minAmt: 1200, maxAmt: 8500, method: 'Debit Card' }
    ];

    const fraudRecipients = [
      { recipient: 'Darknet Crypto Exchange', merchant: 'AnonRemit Pay', category: 'Crypto / FX', minAmt: 85000, maxAmt: 250000, method: 'International Transfer', loc: 'St. Petersburg, Russia', dev: 'Unrecognized TOR Proxy' },
      { recipient: 'Unknown Wallet ID (pay-hack-88@ybl)', merchant: 'P2P Transfer', category: 'Peer to Peer', minAmt: 45000, maxAmt: 95000, method: 'UPI', loc: 'Kolkata, India', dev: 'New Unregistered Android' },
      { recipient: 'Offshore Betting Corp', merchant: 'BetWin International', category: 'Gambling', minAmt: 60000, maxAmt: 180000, method: 'Debit Card', loc: 'Curacao (VPN IP)', dev: 'Linux Headless Browser' }
    ];

    const template = isFraud
      ? fraudRecipients[Math.floor(Math.random() * fraudRecipients.length)]
      : safeRecipients[Math.floor(Math.random() * safeRecipients.length)];

    const amount = Math.floor(template.minAmt + Math.random() * (template.maxAmt - template.minAmt));
    const txnId = 'TXN-' + Math.floor(80000 + Math.random() * 19000);

    let txn = {
      transactionId: txnId,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      timestamp: now.toISOString(),
      recipient: template.recipient,
      merchant: template.merchant,
      amount,
      paymentMethod: template.method,
      category: template.category,
      location: template.loc || 'Mumbai, India',
      device: template.dev || 'iPhone 15 Pro (Primary)',
      status: isFraud ? 'Flagged' : 'Completed',
      auditTimeline: [
        { time: now.toTimeString().split(' ')[0], desc: `Transaction initiated via ${template.method}` }
      ]
    };

    // Run AI Risk Engine analysis
    const aiAnalysis = analyzeTransactionRisk(txn);
    txn = { ...txn, ...aiAnalysis };

    // Update state lists
    this.state.transactions.unshift(txn);

    if (isFraud || txn.riskLevel === 'CRITICAL' || txn.riskLevel === 'HIGH') {
      this.state.liveMonitoring.threatCountToday += 1;

      // Automatically create Alert
      const alertId = 'ALT-' + Math.floor(400 + Math.random() * 500);
      const newAlert = {
        alertId,
        timestamp: now.toISOString(),
        transactionId: txnId,
        alertType: txn.indicators[0]?.title || 'AI Suspicious Pattern',
        severity: txn.riskLevel,
        description: `${txn.explanation} (${txn.recipient} - ₹${amount.toLocaleString('en-IN')})`,
        status: 'Under Investigation'
      };
      this.state.alerts.unshift(newAlert);
      this.addNotification(`Critical Threat Detected!`, `Transaction ${txnId} flagged with Risk Score ${txn.riskScore}`);

      // Auto-create case for critical events
      if (txn.riskLevel === 'CRITICAL') {
        const caseId = 'CAS-' + Math.floor(100 + Math.random() * 500);
        this.state.cases.unshift({
          caseId,
          priority: 'CRITICAL',
          transactionId: txnId,
          relatedAlertId: alertId,
          assignedAnalyst: this.state.currentUser ? this.state.currentUser.name : 'Alex Dawson',
          createdDate: now.toISOString(),
          status: 'Open',
          recipient: txn.recipient,
          amount: txn.amount,
          evidenceChecklist: [
            { id: 'ev-1', text: 'Verify device fingerprint & IP address geolocation', checked: true },
            { id: 'ev-2', text: 'Cross-reference recipient counterparty in risk database', checked: false },
            { id: 'ev-3', text: 'Confirm transaction authorization with account holder', checked: false }
          ],
          notes: [
            { author: 'System AI', time: now.toISOString().replace('T', ' ').slice(0, 16), text: `Case generated automatically. Risk Score: ${txn.riskScore}` }
          ]
        });
      }
    } else {
      this.state.liveMonitoring.safeCountToday += 1;
    }

    this.notify();
    return txn;
  }

  updateTransactionStatus(txnId, newStatus, reason = '') {
    const txn = this.state.transactions.find(t => t.transactionId === txnId);
    if (txn) {
      txn.status = newStatus;
      if (!txn.auditTimeline) txn.auditTimeline = [];
      txn.auditTimeline.push({
        time: new Date().toTimeString().split(' ')[0],
        desc: `Status updated to ${newStatus} by ${this.state.currentUser ? this.state.currentUser.name : 'Analyst'}. ${reason}`
      });

      // Synchronize related alert if exists
      const relatedAlert = this.state.alerts.find(a => a.transactionId === txnId);
      if (relatedAlert) {
        if (newStatus === 'Legitimate' || newStatus === 'Completed') {
          relatedAlert.status = 'Resolved';
        } else if (newStatus === 'Flagged' || newStatus === 'Blocked') {
          relatedAlert.status = 'Under Investigation';
        }
      }

      // Synchronize related case if exists
      const relatedCase = this.state.cases.find(c => c.transactionId === txnId);
      if (relatedCase) {
        if (newStatus === 'Legitimate' || newStatus === 'Completed') {
          relatedCase.status = 'Resolved';
        } else if (newStatus === 'Blocked') {
          relatedCase.status = 'Closed';
        }
      }

      this.addNotification('Transaction State Updated', `${txnId} status changed to ${newStatus}.`);
      this.notify();
    }
  }

  resolveAlert(alertId) {
    const alert = this.state.alerts.find(a => a.alertId === alertId);
    if (alert) {
      alert.status = 'Resolved';
      this.notify();
    }
  }

  updateCaseStatus(caseId, newStatus) {
    const c = this.state.cases.find(item => item.caseId === caseId);
    if (c) {
      c.status = newStatus;
      c.notes.push({
        author: this.state.currentUser ? this.state.currentUser.name : 'Analyst',
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
        text: `Case status changed to ${newStatus}.`
      });

      // Sync transaction status
      if (c.transactionId) {
        const txn = this.state.transactions.find(t => t.transactionId === c.transactionId);
        if (txn) {
          if (newStatus === 'Resolved') txn.status = 'Legitimate';
          if (newStatus === 'Closed') txn.status = 'Flagged';
        }
      }

      this.notify();
    }
  }

  addCaseNote(caseId, noteText) {
    const c = this.state.cases.find(item => item.caseId === caseId);
    if (c && noteText.trim()) {
      c.notes.push({
        author: this.state.currentUser ? this.state.currentUser.name : 'Analyst',
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
        text: noteText.trim()
      });
      this.notify();
    }
  }

  toggleCaseEvidence(caseId, evidenceId) {
    const c = this.state.cases.find(item => item.caseId === caseId);
    if (c && c.evidenceChecklist) {
      const item = c.evidenceChecklist.find(e => e.id === evidenceId);
      if (item) {
        item.checked = !item.checked;
        this.notify();
      }
    }
  }
}

export const stateStore = new StateStore();
