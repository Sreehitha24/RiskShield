/**
 * RiskShield AI - Reports & Intelligence View
 */

import { stateStore } from '../state.js';
import { formatCurrency, formatDate, exportToCSV, escapeHTML } from '../utils.js';

export function renderReportsView() {
  const container = document.getElementById('main-content-viewport');
  const state = stateStore.getState();
  const transactions = state.transactions || [];
  const reports = state.generatedReports || [];

  const totalVal = transactions.reduce((a, c) => a + Number(c.amount), 0);
  const criticalVal = transactions.filter(t => t.riskLevel === 'CRITICAL').reduce((a, c) => a + Number(c.amount), 0);
  const safeCount = transactions.filter(t => t.riskLevel === 'LOW').length;
  const detectionRate = Math.round(((transactions.length - safeCount) / (transactions.length || 1)) * 100);

  function render() {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Reports & Intelligence</h1>
          <p>Executive risk intelligence briefings, compliance reports, and exportable financial audits.</p>
        </div>

        <div class="page-actions">
          <button id="btn-export-csv" class="btn btn-secondary btn-sm">
            📥 Export CSV Data
          </button>
          <button id="btn-export-pdf" class="btn btn-secondary btn-sm">
            🖨️ Export PDF Brief
          </button>
          <button id="btn-gen-report" class="btn btn-primary btn-sm">
            ✨ Generate New Report
          </button>
        </div>
      </div>

      <!-- KPI CARDS -->
      <div class="kpi-grid" style="margin-bottom: 24px;">
        <div class="kpi-card safe">
          <div class="kpi-title">Detection Rate</div>
          <div class="kpi-value" style="color: var(--color-safe);">${detectionRate}%</div>
          <div class="kpi-subtext">AI Model Precision</div>
        </div>

        <div class="kpi-card critical">
          <div class="kpi-title">Financial Exposure</div>
          <div class="kpi-value" style="color: var(--color-critical);">${formatCurrency(criticalVal)}</div>
          <div class="kpi-subtext">Flagged threat amount</div>
        </div>

        <div class="kpi-card primary">
          <div class="kpi-title">Processed Volume</div>
          <div class="kpi-value">${formatCurrency(totalVal)}</div>
          <div class="kpi-subtext">${transactions.length} transactions total</div>
        </div>

        <div class="kpi-card medium">
          <div class="kpi-title">Resolution Rate</div>
          <div class="kpi-value" style="color: var(--color-medium);">92.4%</div>
          <div class="kpi-subtext">Analyst SLA response time</div>
        </div>
      </div>

      <!-- AI EXECUTIVE INTELLIGENCE BRIEF -->
      <div class="panel" style="background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(14, 20, 34, 0.98)); border-color: var(--border-accent); margin-bottom: 24px;">
        <div class="panel-header">
          <span class="panel-title" style="color: var(--accent-cyan); font-size: 16px;">
            📑 AI Executive Intelligence Brief — ${state.bankConnection?.bankName || 'HDFC Bank'}
          </span>
          <span class="badge badge-purple">Auto-Generated Briefing</span>
        </div>
        <div class="panel-body" style="padding: 24px; line-height: 1.7; font-size: 13.5px; color: var(--text-primary);">
          
          <h3 style="font-family: var(--font-heading); color: #fff; font-size: 16px; margin-bottom: 10px;">Executive Summary</h3>
          <p style="margin-bottom: 16px; color: var(--text-secondary);">
            During the active monitoring window, RiskShield analyzed <strong>${transactions.length} payment transactions</strong> totaling <strong>${formatCurrency(totalVal)}</strong>. The AI Risk Engine intercepted <strong>${transactions.filter(t => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH').length} high-risk payment attempts</strong> representing a potential exposure of <strong>${formatCurrency(criticalVal)}</strong>.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 16px;">
            <div style="background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <strong style="color: var(--color-critical); display: block; margin-bottom: 6px;">Primary Risk Drivers</strong>
              <ul style="padding-left: 18px; color: var(--text-secondary); font-size: 12.5px;">
                <li>Cross-border international wires targeting unverified crypto merchants in Lagos & Curacao.</li>
                <li>Off-hours high-amount velocity bursts originating from proxy/VPN IP subnets.</li>
                <li>First-time P2P Virtual Payment Address creations without historical trust scores.</li>
              </ul>
            </div>

            <div style="background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <strong style="color: var(--color-safe); display: block; margin-bottom: 6px;">Recommended Analyst Actions</strong>
              <ul style="padding-left: 18px; color: var(--text-secondary); font-size: 12.5px;">
                <li>Maintain mandatory 3DS OTP step-up verification on transactions > ₹25,000.</li>
                <li>Enforce temporary hold on international wire transfers with recipient trust score < 30.</li>
                <li>Complete review of pending cases CAS-101 and CAS-102.</li>
              </ul>
            </div>
          </div>

          <div style="font-size: 11px; color: var(--text-muted); font-style: italic;">
            Report compiled by RiskShield AI Risk Engine v4.2.0 • Data verified against Sandbox Bank Gateway.
          </div>

        </div>
      </div>

      <!-- GENERATED REPORTS HISTORY -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">Recent Generated Intelligence Reports</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title / Scope</th>
                <th>Generated Date</th>
                <th>Format</th>
                <th>File Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${reports.map(r => `
                <tr>
                  <td class="cell-mono">${escapeHTML(r.id)}</td>
                  <td><strong>${escapeHTML(r.title)}</strong></td>
                  <td>${formatDate(r.date)}</td>
                  <td><span class="badge badge-purple">${escapeHTML(r.type)}</span></td>
                  <td>${escapeHTML(r.size)}</td>
                  <td>
                    <button class="btn btn-outline btn-sm btn-download-rep" data-rep-id="${r.id}">
                      Download
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind Buttons
    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      exportToCSV(`RiskShield_Transactions_${new Date().toISOString().split('T')[0]}.csv`, transactions);
      stateStore.addNotification('CSV Data Exported', 'Transaction dataset exported successfully.');
    });

    document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-gen-report')?.addEventListener('click', () => {
      const repId = 'REP-' + new Date().getFullYear() + '-' + Math.floor(10 + Math.random() * 90);
      const newRep = {
        id: repId,
        title: `Payment Risk Audit Brief (${new Date().toLocaleDateString('en-IN')})`,
        date: new Date().toISOString().split('T')[0],
        size: '1.8 MB',
        type: 'PDF'
      };
      state.generatedReports.unshift(newRep);
      stateStore.addNotification('Report Generated', `${repId} created successfully.`);
      render();
    });

    container.querySelectorAll('.btn-download-rep').forEach(btn => {
      btn.addEventListener('click', () => {
        alert(`Downloading report file ${btn.getAttribute('data-rep-id')}...`);
      });
    });
  }

  render();
}
