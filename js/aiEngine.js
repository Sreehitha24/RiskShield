/**
 * RiskShield AI - Deterministic Risk Engine
 * Analyzes transaction attributes to compute risk scores, anomaly metrics,
 * indicators, and human-readable risk intelligence explanations.
 */

const USER_SPENDING_BASELINE = 1800; // Normal avg transaction size ₹1,800

export function analyzeTransactionRisk(txn) {
  let amountScore = 0;
  let recipientTrust = 95;
  let behavioralScore = 10;
  let indicators = [];

  const amount = Number(txn.amount) || 0;

  // 1. Amount Anomaly Scoring
  if (amount > 150000) {
    amountScore = 98;
    indicators.push({ title: 'Extreme Value Anomaly', severity: 'CRITICAL', text: `Transaction value (${amount}) exceeds typical baseline by >80x.` });
  } else if (amount > 50000) {
    amountScore = 88;
    indicators.push({ title: 'High Value Spurt', severity: 'HIGH', text: `Amount significantly higher than average ₹${USER_SPENDING_BASELINE}.` });
  } else if (amount > 15000) {
    amountScore = 55;
    indicators.push({ title: 'Moderate Amount Deviation', severity: 'MEDIUM', text: `Transaction size elevated above standard food/shopping baseline.` });
  } else {
    amountScore = Math.min(20, Math.floor((amount / USER_SPENDING_BASELINE) * 10));
  }

  // 2. Payment Method & Category Analysis
  const category = (txn.category || '').toLowerCase();
  const method = (txn.paymentMethod || '').toLowerCase();
  
  if (category.includes('crypto') || category.includes('gambling') || category.includes('fx')) {
    behavioralScore += 50;
    recipientTrust -= 45;
    indicators.push({ title: 'High-Risk Category Channel', severity: 'CRITICAL', text: 'Transaction targets Crypto/FX/Gambling merchant account.' });
  }

  if (method.includes('international') || method.includes('wire')) {
    behavioralScore += 30;
    recipientTrust -= 25;
    indicators.push({ title: 'Cross-Border Wire Channel', severity: 'HIGH', text: 'International outbound payment route detected.' });
  }

  // 3. Location & Device Anomaly
  const location = (txn.location || '').toLowerCase();
  const device = (txn.device || '').toLowerCase();

  if (location.includes('tor') || location.includes('vpn') || location.includes('lagos') || location.includes('curacao') || location.includes('dubai')) {
    behavioralScore += 35;
    recipientTrust -= 30;
    indicators.push({ title: 'Anomalous IP / Proxy Routing', severity: 'CRITICAL', text: `IP location (${txn.location}) outside primary Mumbai access radius.` });
  }

  if (device.includes('unrecognized') || device.includes('new') || device.includes('tor')) {
    behavioralScore += 25;
    indicators.push({ title: 'Unverified Hardware Device', severity: 'MEDIUM', text: `Payment initiated from new hardware signature (${txn.device}).` });
  }

  // Recipient Trust Score Adjustment
  const recipient = (txn.recipient || '').toLowerCase();
  if (recipient.includes('unknown') || recipient.includes('crypto') || recipient.includes('bet') || recipient.includes('luxury')) {
    recipientTrust -= 40;
    indicators.push({ title: 'Low Recipient Trust History', severity: 'HIGH', text: 'Recipient handle has low counterparty trust index.' });
  } else if (recipient.includes('swiggy') || recipient.includes('zomato') || recipient.includes('amazon') || recipient.includes('adani')) {
    recipientTrust = 98;
  }

  recipientTrust = Math.max(5, Math.min(100, recipientTrust));
  behavioralScore = Math.max(5, Math.min(100, behavioralScore));

  // Overall Risk Score & Fraud Probability Calculation
  const totalRiskScore = Math.min(99, Math.max(1, Math.round(
    (amountScore * 0.45) +
    ((100 - recipientTrust) * 0.30) +
    (behavioralScore * 0.25)
  )));

  let riskLevel = 'LOW';
  if (totalRiskScore >= 85) riskLevel = 'CRITICAL';
  else if (totalRiskScore >= 65) riskLevel = 'HIGH';
  else if (totalRiskScore >= 35) riskLevel = 'MEDIUM';

  const fraudProbability = Math.min(99, Math.round(totalRiskScore * 1.02));
  const confidence = Math.min(98, Math.max(82, 85 + (indicators.length * 3)));

  // Generate primary human-readable explanation
  let explanation = 'Transaction parameters match expected historical user spending patterns.';
  if (riskLevel === 'CRITICAL') {
    explanation = 'Transaction amount is significantly higher than user baseline, initiated from an unrecognized device/IP location to a low-trust recipient.';
  } else if (riskLevel === 'HIGH') {
    explanation = 'Rapid high-value transaction detected with anomalous payment channel and unverified recipient trust score.';
  } else if (riskLevel === 'MEDIUM') {
    explanation = 'Transaction size is elevated compared to normal baseline or initiated from a secondary device signature.';
  }

  // Recommended Action
  let recommendedAction = 'Allow Transaction';
  if (riskLevel === 'CRITICAL') recommendedAction = 'Block Immediately & Freeze Recipient';
  else if (riskLevel === 'HIGH') recommendedAction = 'Hold for Analyst Review & Request 2FA';
  else if (riskLevel === 'MEDIUM') recommendedAction = 'Allow with Step-Up Monitoring';

  return {
    riskScore: totalRiskScore,
    riskLevel,
    fraudProbability,
    confidence,
    recipientTrustScore: recipientTrust,
    amountAnomalyScore: amountScore,
    behavioralScore,
    explanation,
    recommendedAction,
    indicators
  };
}
