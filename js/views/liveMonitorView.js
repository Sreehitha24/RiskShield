/**
 * RiskShield AI - Live Risk Monitor View
 */

import { stateStore } from '../state.js';
import { formatCurrency, renderRiskBadge, renderStatusBadge, escapeHTML } from '../utils.js';
import { openInvestigationModal } from './investigationModal.js';

let liveInterval = null;

export function renderLiveMonitorView() {
  const container = document.getElementById('main-content-viewport');
  let state = stateStore.getState();

  function render() {
    state = stateStore.getState();
    const liveStats = state.liveMonitoring;
    const transactions = state.transactions || [];

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <div style="display: flex; align-items: center; gap: 10px;">
            <h1>Live Risk Monitor</h1>
            <span class="badge ${liveStats.active ? 'badge-safe' : 'badge-warning'}" style="font-size: 12px;">
              <span class="badge-dot" style="${liveStats.active ? 'animation: pulse-green 1.5s infinite;' : ''}"></span>
              ${liveStats.active ? 'STREAMING ACTIVE' : 'PAUSED'}
            </span>
          </div>
          <p>Real-time transaction ingestion stream with instant anomaly detection.</p>
        </div>
        
        <div class="page-actions">
          <button id="btn-toggle-pause" class="btn ${liveStats.active ? 'btn-secondary' : 'btn-primary'}">
            ${liveStats.active ? '⏸ Pause Stream' : '▶ Resume Stream'}
          </button>
          <button id="btn-sim-live-safe" class="btn btn-secondary btn-sm">
            + Safe Transaction
          </button>
          <button id="btn-sim-live-fraud" class="btn btn-danger btn-sm">
            ⚡ Fraud Attack Attempt
          </button>
        </div>
      </div>

      <!-- STREAM METRICS CARDS -->
      <div class="kpi-grid" style="margin-bottom: 24px;">
        <div class="kpi-card primary">
          <div class="kpi-title">Transactions Today</div>
          <div class="kpi-value">${transactions.length}</div>
          <div class="kpi-subtext">Total stream count</div>
        </div>

        <div class="kpi-card safe">
          <div class="kpi-title">Throughput (TPM)</div>
          <div class="kpi-value" style="color: var(--accent-cyan);">${liveStats.tpm}</div>
          <div class="kpi-subtext">Transactions per minute</div>
        </div>

        <div class="kpi-card critical">
          <div class="kpi-title">Threats Intercepted</div>
          <div class="kpi-value" style="color: var(--color-critical);">${liveStats.threatCountToday}</div>
          <div class="kpi-subtext">High/Critical anomalies</div>
        </div>

        <div class="kpi-card medium">
          <div class="kpi-title">Average Risk Score</div>
          <div class="kpi-value">${liveStats.avgRiskScore}/100</div>
          <div class="kpi-subtext">Stream average</div>
        </div>
      </div>

      <!-- LIVE STREAM FEED PANEL -->
      <div class="panel">
        <div class="panel-header" style="background: rgba(15, 23, 42, 0.8);">
          <span class="panel-title" style="display: flex; align-items: center; gap: 8px;">
            <span class="engine-dot pulse"></span>
            Real-Time Payment Transaction Stream
          </span>
          <span style="font-size: 12px; color: var(--text-muted);">Auto-refreshing live log</span>
        </div>

        <div class="panel-body" style="padding: 16px;">
          <div class="live-stream-panel" id="live-stream-feed-list">
            ${transactions.slice(0, 12).map(t => `
              <div class="live-stream-item ${t.riskLevel === 'CRITICAL' ? 'critical' : t.riskLevel === 'LOW' ? 'safe' : ''}" data-txn-id="${t.transactionId}">
                <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
                  <div style="font-family: var(--font-mono); font-size: 12px; color: var(--accent-cyan); width: 85px;">
                    ${escapeHTML(t.transactionId)}
                  </div>
                  <div style="width: 75px; font-size: 11px; color: var(--text-muted);">${t.time}</div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600; color: #fff; font-size: 13px;">${escapeHTML(t.recipient)}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">${escapeHTML(t.location || 'Mumbai, India')} • ${escapeHTML(t.paymentMethod)}</div>
                  </div>
                  <div class="cell-amount" style="font-size: 15px; width: 110px; text-align: right;">
                    ${formatCurrency(t.amount)}
                  </div>
                  <div style="width: 130px; text-align: center;">
                    ${renderRiskBadge(t.riskLevel, t.riskScore)}
                  </div>
                  <button class="btn btn-secondary btn-sm txn-investigate-btn" data-txn-id="${t.transactionId}">
                    Inspect
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind Buttons
    document.getElementById('btn-toggle-pause')?.addEventListener('click', () => {
      stateStore.getState().liveMonitoring.active = !stateStore.getState().liveMonitoring.active;
      render();
    });

    document.getElementById('btn-sim-live-safe')?.addEventListener('click', () => {
      stateStore.simulateTransaction('SAFE');
      render();
    });

    document.getElementById('btn-sim-live-fraud')?.addEventListener('click', () => {
      stateStore.simulateTransaction('FRAUD');
      render();
    });

    container.querySelectorAll('.txn-investigate-btn, .live-stream-item').forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.stopPropagation();
        const txnId = elem.getAttribute('data-txn-id');
        if (txnId) openInvestigationModal(txnId);
      });
    });
  }

  render();

  // Auto-simulate a random safe transaction every 8 seconds if active
  if (liveInterval) clearInterval(liveInterval);
  liveInterval = setInterval(() => {
    if (location.hash.includes('live-monitor') && stateStore.getState().liveMonitoring.active) {
      // 10% chance of random fraud simulation
      const isFraud = Math.random() < 0.15;
      stateStore.simulateTransaction(isFraud ? 'FRAUD' : 'SAFE');
      render();
    }
  }, 8000);
}
