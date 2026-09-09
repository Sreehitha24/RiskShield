/**
 * RiskShield AI - Seed Mock Data
 * Realistic Indian payment transaction activity, alerts, and cases.
 */

export const INITIAL_BANK = {
  bankName: 'HDFC Bank',
  accountType: 'Savings Account',
  accountNumber: '•••• 8921',
  accountHolder: 'Alex Dawson',
  balance: 248590.50,
  currency: 'INR',
  connected: true,
  connectedAt: '2026-09-01T08:30:00.000Z'
};

export const INITIAL_TRANSACTIONS = [
  {
    transactionId: 'TXN-90821',
    date: '2026-09-09',
    time: '09:42:15',
    timestamp: '2026-09-09T09:42:15.000Z',
    recipient: 'Global Crypto Remit Ltd',
    merchant: 'CryptoRemit Pay',
    amount: 145000,
    paymentMethod: 'International Transfer',
    category: 'Crypto / FX',
    location: 'Lagos, Nigeria (IP 197.210.44.12)',
    device: 'Unrecognized Linux Chrome (New MAC Address)',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    status: 'Flagged',
    recipientTrustScore: 12,
    amountAnomalyScore: 98,
    behavioralScore: 95,
    fraudProbability: 96,
    reason: 'High-amount cross-border transfer to an unverified recipient from an unknown IP location outside normal activity hours.',
    auditTimeline: [
      { time: '09:42:15', desc: 'Transaction submitted via International Transfer' },
      { time: '09:42:16', desc: 'AI Risk Engine flagged high cross-border amount anomaly' },
      { time: '09:42:16', desc: 'Security Alert ALT-401 generated automatically' }
    ]
  },
  {
    transactionId: 'TXN-90820',
    date: '2026-09-09',
    time: '09:15:30',
    timestamp: '2026-09-09T09:15:30.000Z',
    recipient: 'Swiggy India',
    merchant: 'Swiggy Food',
    amount: 480,
    paymentMethod: 'UPI',
    category: 'Food & Dining',
    location: 'Mumbai, India',
    device: 'iPhone 15 Pro (Primary)',
    riskScore: 8,
    riskLevel: 'LOW',
    status: 'Completed',
    recipientTrustScore: 98,
    amountAnomalyScore: 5,
    behavioralScore: 10,
    fraudProbability: 4,
    reason: 'Normal daily food order matching user spending baseline.',
    auditTimeline: [
      { time: '09:15:30', desc: 'UPI Payment authorized successfully' }
    ]
  },
  {
    transactionId: 'TXN-90819',
    date: '2026-09-09',
    time: '08:50:11',
    timestamp: '2026-09-09T08:50:11.000Z',
    recipient: 'Unknown UPI ID (pay-fast-992@ybl)',
    merchant: 'Direct UPI Transfer',
    amount: 49500,
    paymentMethod: 'UPI',
    category: 'Peer to Peer',
    location: 'New Delhi, India',
    device: 'Android SM-G998B (New Device)',
    riskScore: 86,
    riskLevel: 'HIGH',
    status: 'Under Review',
    recipientTrustScore: 24,
    amountAnomalyScore: 88,
    behavioralScore: 82,
    fraudProbability: 84,
    reason: 'Rapid high-value UPI transaction to a newly created VP address without prior interaction history.',
    auditTimeline: [
      { time: '08:50:11', desc: 'Transaction initiated from unverified Android device' },
      { time: '08:50:12', desc: 'Flagged for recipient trust score below threshold' },
      { time: '08:52:00', desc: 'Case CAS-102 assigned to Analyst' }
    ]
  },
  {
    transactionId: 'TXN-90818',
    date: '2026-09-09',
    time: '07:30:00',
    timestamp: '2026-09-09T07:30:00.000Z',
    recipient: 'Zomato Media',
    merchant: 'Zomato Gold',
    amount: 620,
    paymentMethod: 'UPI',
    category: 'Food & Dining',
    location: 'Mumbai, India',
    device: 'iPhone 15 Pro (Primary)',
    riskScore: 12,
    riskLevel: 'LOW',
    status: 'Completed',
    recipientTrustScore: 96,
    amountAnomalyScore: 8,
    behavioralScore: 12,
    fraudProbability: 6,
    reason: 'Standard food delivery payment.',
    auditTimeline: [
      { time: '07:30:00', desc: 'Payment completed successfully' }
    ]
  },
  {
    transactionId: 'TXN-90817',
    date: '2026-09-08',
    time: '23:14:02',
    timestamp: '2026-09-08T23:14:02.000Z',
    recipient: 'Offshore Gaming NV',
    merchant: 'BetMax Wallet',
    amount: 75000,
    paymentMethod: 'Debit Card',
    category: 'Gambling & FX',
    location: 'Curacao (Proxy IP 185.220.101.5)',
    device: 'Windows Firefox (Tor Exit Node)',
    riskScore: 98,
    riskLevel: 'CRITICAL',
    status: 'Flagged',
    recipientTrustScore: 5,
    amountAnomalyScore: 96,
    behavioralScore: 99,
    fraudProbability: 98,
    reason: 'Late-night card transaction routed through Tor Exit Node targeting an offshore gambling merchant.',
    auditTimeline: [
      { time: '23:14:02', desc: 'Card auth request received' },
      { time: '23:14:03', desc: 'Tor Node IP & velocity anomaly triggered' },
      { time: '23:14:03', desc: 'Transaction auto-blocked & alert ALT-399 created' }
    ]
  },
  {
    transactionId: 'TXN-90816',
    date: '2026-09-08',
    time: '20:10:45',
    timestamp: '2026-09-08T20:10:45.000Z',
    recipient: 'Amazon India',
    merchant: 'Amazon Retail',
    amount: 4299,
    paymentMethod: 'Credit Card',
    category: 'E-Commerce',
    location: 'Mumbai, India',
    device: 'iPhone 15 Pro (Primary)',
    riskScore: 15,
    riskLevel: 'LOW',
    status: 'Completed',
    recipientTrustScore: 99,
    amountAnomalyScore: 18,
    behavioralScore: 12,
    fraudProbability: 9,
    reason: 'Verified merchant online purchase.',
    auditTimeline: [
      { time: '20:10:45', desc: 'Payment approved' }
    ]
  },
  {
    transactionId: 'TXN-90815',
    date: '2026-09-08',
    time: '18:45:00',
    timestamp: '2026-09-08T18:45:00.000Z',
    recipient: 'Flipkart Internet',
    merchant: 'Flipkart Electronics',
    amount: 18999,
    paymentMethod: 'Credit Card',
    category: 'E-Commerce',
    location: 'Mumbai, India',
    device: 'MacBook Pro (Primary)',
    riskScore: 28,
    riskLevel: 'MEDIUM',
    status: 'Completed',
    recipientTrustScore: 95,
    amountAnomalyScore: 42,
    behavioralScore: 25,
    fraudProbability: 22,
    reason: 'Slightly higher amount than daily electronics baseline, but verified device and 3DS OTP confirmed.',
    auditTimeline: [
      { time: '18:45:00', desc: '3DS OTP verified by user' }
    ]
  },
  {
    transactionId: 'TXN-90814',
    date: '2026-09-08',
    time: '14:20:18',
    timestamp: '2026-09-08T14:20:18.000Z',
    recipient: 'Adani Electricity Ltd',
    merchant: 'Utility Services',
    amount: 3450,
    paymentMethod: 'Bank Transfer',
    category: 'Utilities',
    location: 'Mumbai, India',
    device: 'MacBook Pro (Primary)',
    riskScore: 5,
    riskLevel: 'LOW',
    status: 'Completed',
    recipientTrustScore: 100,
    amountAnomalyScore: 4,
    behavioralScore: 5,
    fraudProbability: 2,
    reason: 'Recurring monthly utility bill payment.',
    auditTimeline: [
      { time: '14:20:18', desc: 'Utility payment processed' }
    ]
  },
  {
    transactionId: 'TXN-90813',
    date: '2026-09-08',
    time: '11:05:40',
    timestamp: '2026-09-08T11:05:40.000Z',
    recipient: 'Quick Mobile Recharge',
    merchant: 'Airtel Pay',
    amount: 299,
    paymentMethod: 'UPI',
    category: 'Telecom',
    location: 'Mumbai, India',
    device: 'iPhone 15 Pro (Primary)',
    riskScore: 4,
    riskLevel: 'LOW',
    status: 'Completed',
    recipientTrustScore: 99,
    amountAnomalyScore: 2,
    behavioralScore: 4,
    fraudProbability: 1,
    reason: 'Standard monthly mobile recharge.',
    auditTimeline: [
      { time: '11:05:40', desc: 'Recharge completed' }
    ]
  },
  {
    transactionId: 'TXN-90812',
    date: '2026-09-07',
    time: '22:40:15',
    timestamp: '2026-09-07T22:40:15.000Z',
    recipient: 'LUXURY JEWELS EXPORT',
    merchant: 'Jewelry Mart',
    amount: 185000,
    paymentMethod: 'Bank Transfer',
    category: 'Luxury Goods',
    location: 'Dubai, UAE (VPN Connection)',
    device: 'Windows Machine (Unrecognized User Agent)',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    status: 'Under Review',
    recipientTrustScore: 18,
    amountAnomalyScore: 97,
    behavioralScore: 94,
    fraudProbability: 92,
    reason: 'First-time high-value transfer to offshore luxury merchant during non-operating hours via commercial VPN.',
    auditTimeline: [
      { time: '22:40:15', desc: 'NEFT Transfer placed' },
      { time: '22:40:16', desc: 'Risk Engine flagged VPN anomaly & amount burst' },
      { time: '22:45:00', desc: 'Case CAS-101 opened for manual review' }
    ]
  },
  {
    transactionId: 'TXN-90811',
    date: '2026-09-07',
    time: '17:12:00',
    timestamp: '2026-09-07T17:12:00.000Z',
    recipient: 'Nature Basket Grocery',
    merchant: 'Supermarket Store',
    amount: 1420,
    paymentMethod: 'Digital Wallet',
    category: 'Groceries',
    location: 'Mumbai, India',
    device: 'iPhone 15 Pro (Primary)',
    riskScore: 7,
    riskLevel: 'LOW',
    status: 'Completed',
    recipientTrustScore: 97,
    amountAnomalyScore: 6,
    behavioralScore: 8,
    fraudProbability: 3,
    reason: 'Regular grocery store transaction.',
    auditTimeline: [
      { time: '17:12:00', desc: 'POS Wallet QR code scanned' }
    ]
  },
  {
    transactionId: 'TXN-90810',
    date: '2026-09-07',
    time: '12:30:45',
    timestamp: '2026-09-07T12:30:45.000Z',
    recipient: 'Starbucks Coffee',
    merchant: 'Starbucks Retail',
    amount: 390,
    paymentMethod: 'UPI',
    category: 'Food & Dining',
    location: 'Mumbai, India',
    device: 'iPhone 15 Pro (Primary)',
    riskScore: 3,
    riskLevel: 'LOW',
    status: 'Completed',
    recipientTrustScore: 99,
    amountAnomalyScore: 3,
    behavioralScore: 3,
    fraudProbability: 1,
    reason: 'Frequent coffee purchase.',
    auditTimeline: [
      { time: '12:30:45', desc: 'UPI Scan & Pay completed' }
    ]
  }
];

export const INITIAL_ALERTS = [
  {
    alertId: 'ALT-401',
    timestamp: '2026-09-09T09:42:16.000Z',
    transactionId: 'TXN-90821',
    alertType: 'Velocity Burst & Anomaly',
    severity: 'CRITICAL',
    description: 'Cross-border transfer ₹1,45,000 to unverified recipient in Lagos, Nigeria from unrecognized device.',
    status: 'Under Investigation'
  },
  {
    alertId: 'ALT-400',
    timestamp: '2026-09-09T08:50:12.000Z',
    transactionId: 'TXN-90819',
    alertType: 'Recipient Anomaly',
    severity: 'HIGH',
    description: 'Rapid UPI transfer ₹49,500 to new VP address from unknown Android device.',
    status: 'Under Investigation'
  },
  {
    alertId: 'ALT-399',
    timestamp: '2026-09-08T23:14:03.000Z',
    transactionId: 'TXN-90817',
    alertType: 'Tor Node & Off-Hours',
    severity: 'CRITICAL',
    description: 'Late-night card transaction ₹75,000 to BetMax Wallet via Tor Exit Node.',
    status: 'Resolved'
  },
  {
    alertId: 'ALT-398',
    timestamp: '2026-09-07T22:40:16.000Z',
    transactionId: 'TXN-90812',
    alertType: 'VPN & High Amount',
    severity: 'HIGH',
    description: 'Offshore luxury export purchase ₹1,85,000 via commercial VPN.',
    status: 'Under Investigation'
  }
];

export const INITIAL_CASES = [
  {
    caseId: 'CAS-101',
    priority: 'HIGH',
    transactionId: 'TXN-90812',
    relatedAlertId: 'ALT-398',
    assignedAnalyst: 'Alex Dawson',
    createdDate: '2026-09-07T22:45:00.000Z',
    status: 'Under Investigation',
    recipient: 'LUXURY JEWELS EXPORT',
    amount: 185000,
    evidenceChecklist: [
      { id: 'ev-1', text: 'Verify user IP geographical consistency', checked: true },
      { id: 'ev-2', text: 'Check VPN provider subnet classification', checked: true },
      { id: 'ev-3', text: 'Contact cardholder via registered phone number', checked: false },
      { id: 'ev-4', text: 'Request invoice proof of purchase from merchant', checked: false }
    ],
    notes: [
      { author: 'System AI', time: '2026-09-07 22:45', text: 'Case created automatically due to CRITICAL risk score (91).' },
      { author: 'Alex Dawson', time: '2026-09-08 10:15', text: 'Initiated customer callback. Awaiting user response regarding Dubai transaction.' }
    ]
  },
  {
    caseId: 'CAS-102',
    priority: 'CRITICAL',
    transactionId: 'TXN-90821',
    relatedAlertId: 'ALT-401',
    assignedAnalyst: 'Alex Dawson',
    createdDate: '2026-09-09T09:45:00.000Z',
    status: 'Open',
    recipient: 'Global Crypto Remit Ltd',
    amount: 145000,
    evidenceChecklist: [
      { id: 'ev-1', text: 'Cross-reference Lagos recipient account on fraud database', checked: true },
      { id: 'ev-2', text: 'Analyze device fingerprint & browser HTTP headers', checked: true },
      { id: 'ev-3', text: 'Issue temporary account freeze on wire transfers', checked: false }
    ],
    notes: [
      { author: 'System AI', time: '2026-09-09 09:45', text: 'High probability of account takeover (ATO). Device ID mismatch.' }
    ]
  }
];
