/**
 * RiskShield AI - Transactions Monitoring View
 */

import { stateStore } from '../state.js';
import { formatCurrency, formatDate, renderRiskBadge, renderStatusBadge, escapeHTML } from '../utils.js';
import { openInvestigationModal } from './investigationModal.js';

export function renderTransactionsView() {
  const container = document.getElementById('main-content-viewport');
  const state = stateStore.getState();
  let rawTransactions = state.transactions || [];

  let searchFilter = '';
  let riskFilter = 'ALL';
  let methodFilter = 'ALL';
  let statusFilter = 'ALL';
  let sortBy = 'date_desc';

  function render() {
    // Apply filters
    let filtered = rawTransactions.filter(t => {
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        const matchId = (t.transactionId || '').toLowerCase().includes(q);
        const matchRecip = (t.recipient || '').toLowerCase().includes(q);
        const matchMerch = (t.merchant || '').toLowerCase().includes(q);
        if (!matchId && !matchRecip && !matchMerch) return false;
      }
      if (riskFilter !== 'ALL' && t.riskLevel !== riskFilter) return false;
      if (methodFilter !== 'ALL' && !t.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase())) return false;
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date);
      if (sortBy === 'date_asc') return new Date(a.timestamp || a.date) - new Date(b.timestamp || b.date);
      if (sortBy === 'amount_high') return b.amount - a.amount;
      if (sortBy === 'amount_low') return a.amount - b.amount;
      if (sortBy === 'risk_high') return b.riskScore - a.riskScore;
      return 0;
    });

    // Compute top summary metrics
    const totalCount = filtered.length;
    const safeCount = filtered.filter(t => t.riskLevel === 'LOW').length;
    const suspCount = filtered.filter(t => t.riskLevel === 'MEDIUM' || t.riskLevel === 'HIGH').length;
    const critCount = filtered.filter(t => t.riskLevel === 'CRITICAL').length;
    const totalVal = filtered.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Transaction Monitoring</h1>
          <p>Complete historical log & real-time risk assessment of counterparty payments.</p>
        </div>
      </div>

      <!-- TOP METRICS BANNER -->
      <div class="kpi-grid" style="margin-bottom: 20px;">
        <div class="kpi-card primary">
          <div class="kpi-title">Filtered Count</div>
          <div class="kpi-value">${totalCount}</div>
        </div>
        <div class="kpi-card safe">
          <div class="kpi-title">Safe Transactions</div>
          <div class="kpi-value" style="color: var(--color-safe);">${safeCount}</div>
        </div>
        <div class="kpi-card medium">
          <div class="kpi-title">Suspicious / High</div>
          <div class="kpi-value" style="color: var(--color-medium);">${suspCount}</div>
        </div>
        <div class="kpi-card critical">
          <div class="kpi-title">Critical / Flagged</div>
          <div class="kpi-value" style="color: var(--color-critical);">${critCount}</div>
        </div>
      </div>

      <!-- FILTER & CONTROL TOOLBAR -->
      <div class="panel" style="margin-bottom: 20px;">
        <div class="panel-body" style="padding: 16px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 12px; align-items: center;">
          
          <div>
            <label class="form-label">Search Query</label>
            <input type="text" id="tx-search-input" class="form-control" placeholder="Search by ID, Recipient..." value="${escapeHTML(searchFilter)}">
          </div>

          <div>
            <label class="form-label">Risk Level</label>
            <select id="tx-risk-select" class="form-control">
              <option value="ALL" ${riskFilter === 'ALL' ? 'selected' : ''}>All Risk Levels</option>
              <option value="LOW" ${riskFilter === 'LOW' ? 'selected' : ''}>LOW</option>
              <option value="MEDIUM" ${riskFilter === 'MEDIUM' ? 'selected' : ''}>MEDIUM</option>
              <option value="HIGH" ${riskFilter === 'HIGH' ? 'selected' : ''}>HIGH</option>
              <option value="CRITICAL" ${riskFilter === 'CRITICAL' ? 'selected' : ''}>CRITICAL</option>
            </select>
          </div>

          <div>
            <label class="form-label">Payment Method</label>
            <select id="tx-method-select" class="form-control">
              <option value="ALL" ${methodFilter === 'ALL' ? 'selected' : ''}>All Methods</option>
              <option value="UPI" ${methodFilter === 'UPI' ? 'selected' : ''}>UPI</option>
              <option value="Bank Transfer" ${methodFilter === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
              <option value="Card" ${methodFilter === 'Card' ? 'selected' : ''}>Credit/Debit Card</option>
              <option value="International" ${methodFilter === 'International' ? 'selected' : ''}>International Wire</option>
            </select>
          </div>

          <div>
            <label class="form-label">Status</label>
            <select id="tx-status-select" class="form-control">
              <option value="ALL" ${statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="Completed" ${statusFilter === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Under Review" ${statusFilter === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Flagged" ${statusFilter === 'Flagged' ? 'selected' : ''}>Flagged</option>
              <option value="Legitimate" ${statusFilter === 'Legitimate' ? 'selected' : ''}>Legitimate</option>
            </select>
          </div>

          <div>
            <label class="form-label">Sort By</label>
            <select id="tx-sort-select" class="form-control">
              <option value="date_desc" ${sortBy === 'date_desc' ? 'selected' : ''}>Newest First</option>
              <option value="date_asc" ${sortBy === 'date_asc' ? 'selected' : ''}>Oldest First</option>
              <option value="amount_high" ${sortBy === 'amount_high' ? 'selected' : ''}>Amount: High → Low</option>
              <option value="risk_high" ${sortBy === 'risk_high' ? 'selected' : ''}>Risk Score: High → Low</option>
            </select>
          </div>

        </div>
      </div>

      <!-- MAIN DATA TABLE -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">Transactions Log (${filtered.length})</span>
          <span style="font-size: 12px; color: var(--text-muted);">Total Value: <strong>${formatCurrency(totalVal)}</strong></span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date & Time</th>
                <th>Recipient / Counterparty</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length ? filtered.map(t => `
                <tr class="txn-row-click" data-txn-id="${t.transactionId}">
                  <td class="cell-mono">${escapeHTML(t.transactionId)}</td>
                  <td>${formatDate(t.date)} ${t.time}</td>
                  <td>
                    <div><strong>${escapeHTML(t.recipient)}</strong></div>
                    <div style="font-size: 11px; color: var(--text-muted);">${escapeHTML(t.category || '')}</div>
                  </td>
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
              `).join('') : `
                <tr>
                  <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind Controls
    document.getElementById('tx-search-input')?.addEventListener('input', (e) => {
      searchFilter = e.target.value;
      render();
    });
    document.getElementById('tx-risk-select')?.addEventListener('change', (e) => {
      riskFilter = e.target.value;
      render();
    });
    document.getElementById('tx-method-select')?.addEventListener('change', (e) => {
      methodFilter = e.target.value;
      render();
    });
    document.getElementById('tx-status-select')?.addEventListener('change', (e) => {
      statusFilter = e.target.value;
      render();
    });
    document.getElementById('tx-sort-select')?.addEventListener('change', (e) => {
      sortBy = e.target.value;
      render();
    });

    container.querySelectorAll('.txn-investigate-btn, .txn-row-click').forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.stopPropagation();
        const txnId = elem.getAttribute('data-txn-id');
        if (txnId) openInvestigationModal(txnId);
      });
    });
  }

  render();
}
