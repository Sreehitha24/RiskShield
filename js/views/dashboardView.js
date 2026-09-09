/**
 * RiskShield AI - Main Dashboard View
 */

import { stateStore } from '../state.js';
import { formatCurrency, formatDate, renderRiskBadge, renderStatusBadge, escapeHTML } from '../utils.js';
import { openInvestigationModal } from './investigationModal.js';

export function renderDashboardView() {
  const container = document.getElementById('main-content-viewport');
  const state = stateStore.getState();
  const transactions = state.transactions || [];

  // Calculate Metrics
  const totalCount = transactions.length;
  const totalAmount = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const safeTransactions = transactions.filter(t => t.riskLevel === 'LOW');
  const suspiciousTransactions = transactions.filter(t => t.riskLevel === 'MEDIUM' || t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL');
  const flaggedAmount = suspiciousTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  // Risk Level Counts for Donut Chart
  const lowCount = transactions.filter(t => t.riskLevel === 'LOW').length;
  const medCount = transactions.filter(t => t.riskLevel === 'MEDIUM').length;
  const highCount = transactions.filter(t => t.riskLevel === 'HIGH').length;
  const critCount = transactions.filter(t => t.riskLevel === 'CRITICAL').length;

  container.innerHTML = `
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div class="page-title-group">
        <h1>Dashboard Overview</h1>
        <p>Real-time payment risk intelligence and activity monitor for ${state.bankConnection?.bankName || 'HDFC Bank'}.</p>
      </div>
      <div class="page-actions">
        <button id="dash-sim-safe-btn" class="btn btn-secondary btn-sm">
          <span>+ Safe Txn</span>
        </button>
        <button id="dash-sim-fraud-btn" class="btn btn-danger btn-sm">
          <span>⚡ Fraud Attempt</span>
        </button>
      </div>
    </div>

    <!-- TOP KPI CARDS (EQUAL HEIGHT 4-COL GRID) -->
    <div class="kpi-grid">
      
      <div class="kpi-card primary">
        <div class="kpi-header">
          <span class="kpi-title">Total Transactions</span>
          <div class="kpi-icon primary">💳</div>
        </div>
        <div class="kpi-value">${totalCount}</div>
        <div class="kpi-footer">
          <span class="kpi-trend down">↑ +12.4%</span>
          <span class="kpi-subtext">vs last 24h baseline</span>
        </div>
      </div>

      <div class="kpi-card safe">
        <div class="kpi-header">
          <span class="kpi-title">Processed Volume</span>
          <div class="kpi-icon safe">💰</div>
        </div>
        <div class="kpi-value">${formatCurrency(totalAmount)}</div>
        <div class="kpi-footer">
          <span class="kpi-subtext">Avg ₹${Math.round(totalAmount / (totalCount || 1)).toLocaleString('en-IN')}/txn</span>
        </div>
      </div>

      <div class="kpi-card medium">
        <div class="kpi-header">
          <span class="kpi-title">Safe vs Suspicious</span>
          <div class="kpi-icon medium">🛡️</div>
        </div>
        <div class="kpi-value">${safeTransactions.length} <span style="font-size: 16px; color: var(--color-critical);">/ ${suspiciousTransactions.length}</span></div>
        <div class="kpi-footer">
          <span class="kpi-trend up">${Math.round((suspiciousTransactions.length / (totalCount || 1)) * 100)}%</span>
          <span class="kpi-subtext">flagged risk rate</span>
        </div>
      </div>

      <div class="kpi-card critical">
        <div class="kpi-header">
          <span class="kpi-title">High Risk Amount</span>
          <div class="kpi-icon critical">🚨</div>
        </div>
        <div class="kpi-value" style="color: var(--color-critical);">${formatCurrency(flaggedAmount)}</div>
        <div class="kpi-footer">
          <span class="kpi-subtext">${suspiciousTransactions.length} flagged transactions</span>
        </div>
      </div>

    </div>

    <!-- MAIN CHARTS & SUMMARY GRID -->
    <div class="dashboard-grid-main">
      
      <!-- A. TRANSACTION ACTIVITY GRAPH -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            Transaction Volume Over Time
          </span>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary btn-sm time-filter-btn active" data-period="24h">24h</button>
            <button class="btn btn-secondary btn-sm time-filter-btn" data-period="7d">7d</button>
            <button class="btn btn-secondary btn-sm time-filter-btn" data-period="30d">30d</button>
          </div>
        </div>
        <div class="panel-body" style="padding: 16px;">
          <div class="chart-container">
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
                </linearGradient>
                <linearGradient id="chartGradRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ef4444" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#ef4444" stop-opacity="0.0"/>
                </linearGradient>
              </defs>

              <!-- Grid Lines -->
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1f2937" stroke-dasharray="3,3"/>
              <line x1="0" y1="90" x2="500" y2="90" stroke="#1f2937" stroke-dasharray="3,3"/>
              <line x1="0" y1="140" x2="500" y2="140" stroke="#1f2937" stroke-dasharray="3,3"/>

              <!-- Volume Area & Line -->
              <polygon points="0,170 0,110 80,140 160,70 240,120 320,50 400,90 500,30 500,170" fill="url(#chartGrad)"/>
              <polyline points="0,110 80,140 160,70 240,120 320,50 400,90 500,30" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>

              <!-- Red Threat Line overlay -->
              <polyline points="0,160 80,165 160,150 240,158 320,110 400,145 500,95" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>

              <!-- Data Points -->
              <circle cx="160" cy="70" r="4" fill="#06b6d4"/>
              <circle cx="320" cy="50" r="4" fill="#06b6d4"/>
              <circle cx="320" cy="110" r="4" fill="#ef4444"/>
              <circle cx="500" cy="30" r="4" fill="#06b6d4"/>
            </svg>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-top: 8px;">
            <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Now</span>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDEBAR: B. RISK DISTRIBUTION & C. SPENDING SUMMARY -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- B. RISK DISTRIBUTION DONUT -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Risk Distribution</span>
          </div>
          <div class="panel-body" style="padding: 16px; display: flex; align-items: center; gap: 20px;">
            <!-- SVG Donut Chart -->
            <div style="width: 110px; height: 110px; position: relative;">
              <svg width="110" height="110" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2937" stroke-width="3.8"/>
                <!-- Low Risk segment (Green) -->
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" stroke-width="3.8" stroke-dasharray="60, 100"/>
                <!-- Critical segment (Red) -->
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" stroke-width="3.8" stroke-dasharray="20, 100" stroke-dashoffset="-60"/>
              </svg>
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <span style="font-family: var(--font-heading); font-weight: 700; font-size: 16px;">${totalCount}</span>
                <span style="font-size: 9px; color: var(--text-muted);">TOTAL</span>
              </div>
            </div>

            <!-- Donut Legend -->
            <div style="display: flex; flex-direction: column; gap: 6px; flex: 1; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--color-safe);">• Low Risk</span>
                <span style="font-weight: 600;">${lowCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--color-medium);">• Medium Risk</span>
                <span style="font-weight: 600;">${medCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--color-high);">• High Risk</span>
                <span style="font-weight: 600;">${highCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--color-critical);">• Critical</span>
                <span style="font-weight: 600;">${critCount}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- C. SPENDING SUMMARY -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Spending Baseline Summary</span>
          </div>
          <div class="panel-body" style="padding: 16px;">
            <div class="spending-summary-list">
              <div class="spending-item">
                <span class="spending-label">Daily Spend (24h)</span>
                <span class="spending-val">${formatCurrency(transactions.slice(0, 4).reduce((a, c) => a + Number(c.amount), 0))}</span>
              </div>
              <div class="spending-item">
                <span class="spending-label">Weekly Spend (7d)</span>
                <span class="spending-val">${formatCurrency(totalAmount)}</span>
              </div>
              <div class="spending-item">
                <span class="spending-label">Monthly Average</span>
                <span class="spending-val">₹4,85,200</span>
              </div>
              <div class="spending-item">
                <span class="spending-label">Average Transaction</span>
                <span class="spending-val">₹${Math.round(totalAmount / (totalCount || 1)).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- E. SUSPICIOUS TRANSACTIONS REQUIRING ATTENTION -->
    ${suspiciousTransactions.length ? `
      <div class="panel" style="border-color: var(--color-critical-border);">
        <div class="panel-header" style="background: var(--color-critical-bg);">
          <span class="panel-title" style="color: var(--color-critical);">
            🚨 Flagged Suspicious Activity Requiring Attention (${suspiciousTransactions.length})
          </span>
          <a href="#/alerts" class="btn btn-danger btn-sm">View Alerts Center →</a>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Time</th>
                <th>Recipient / Merchant</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${suspiciousTransactions.slice(0, 3).map(t => `
                <tr class="txn-row-click" data-txn-id="${t.transactionId}">
                  <td class="cell-mono">${escapeHTML(t.transactionId)}</td>
                  <td>${t.time}</td>
                  <td><strong>${escapeHTML(t.recipient)}</strong></td>
                  <td class="cell-amount" style="color: var(--color-critical);">${formatCurrency(t.amount)}</td>
                  <td>${escapeHTML(t.paymentMethod)}</td>
                  <td>${renderRiskBadge(t.riskLevel, t.riskScore)}</td>
                  <td>${renderStatusBadge(t.status)}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm txn-investigate-btn" data-txn-id="${t.transactionId}">
                      Investigate
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- D. RECENT TRANSACTIONS TABLE -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Recent Transactions Activity</span>
        <a href="#/transactions" class="btn btn-outline btn-sm">View All Transactions →</a>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Recipient / Merchant</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.slice(0, 6).map(t => `
              <tr class="txn-row-click" data-txn-id="${t.transactionId}">
                <td class="cell-mono">${escapeHTML(t.transactionId)}</td>
                <td>${formatDate(t.date)} ${t.time}</td>
                <td><strong>${escapeHTML(t.recipient)}</strong></td>
                <td class="cell-amount">${formatCurrency(t.amount)}</td>
                <td>${escapeHTML(t.paymentMethod)}</td>
                <td>${renderRiskBadge(t.riskLevel, t.riskScore)}</td>
                <td>${renderStatusBadge(t.status)}</td>
                <td>
                  <button class="btn btn-secondary btn-sm txn-investigate-btn" data-txn-id="${t.transactionId}">
                    Inspect
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Bind Row Click & Buttons
  container.querySelectorAll('.txn-investigate-btn, .txn-row-click').forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.stopPropagation();
      const txnId = elem.getAttribute('data-txn-id');
      if (txnId) openInvestigationModal(txnId);
    });
  });

  document.getElementById('dash-sim-safe-btn')?.addEventListener('click', () => {
    stateStore.simulateTransaction('SAFE');
  });

  document.getElementById('dash-sim-fraud-btn')?.addEventListener('click', () => {
    stateStore.simulateTransaction('FRAUD');
  });
}
