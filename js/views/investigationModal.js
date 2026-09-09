/**
 * RiskShield AI - Unified Reusable Transaction Investigation Modal Component
 */

import { stateStore } from '../state.js';
import { formatCurrency, formatDate, renderRiskBadge, renderStatusBadge, escapeHTML } from '../utils.js';

export function openInvestigationModal(transactionId) {
  const state = stateStore.getState();
  const txn = state.transactions.find(t => t.transactionId === transactionId);

  if (!txn) {
    console.error('Transaction not found:', transactionId);
    return;
  }

  const backdrop = document.getElementById('modal-backdrop');
  const container = document.getElementById('modal-container');

  function renderModalContent() {
    // Refresh latest transaction state
    const currentTxn = stateStore.getState().transactions.find(t => t.transactionId === transactionId) || txn;

    container.innerHTML = `
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 34px; height: 34px; background: rgba(6, 182, 212, 0.12); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h2 class="modal-title">Transaction Investigation: ${escapeHTML(currentTxn.transactionId)}</h2>
              ${renderStatusBadge(currentTxn.status)}
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
              Initiated on ${formatDate(currentTxn.date)} at ${currentTxn.time}
            </p>
          </div>
        </div>
        <button id="modal-close-x" class="modal-close-btn" title="Close Modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="investigation-grid">
          
          <!-- LEFT COLUMN: TRANSACTION DETAILS & AI SCORES -->
          <div>
            <div class="panel" style="margin-bottom: 16px;">
              <div class="panel-header">
                <span class="panel-title">Overview & Counterparty</span>
                <span class="cell-amount" style="font-size: 18px; color: var(--accent-cyan);">${formatCurrency(currentTxn.amount)}</span>
              </div>
              <div class="panel-body" style="padding: 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div>
                  <div class="form-label">Recipient / Merchant</div>
                  <div style="font-weight: 600; color: #fff; font-size: 13px;">${escapeHTML(currentTxn.recipient)}</div>
                  <div style="font-size: 11px; color: var(--text-muted);">${escapeHTML(currentTxn.merchant || '')}</div>
                </div>
                <div>
                  <div class="form-label">Payment Method</div>
                  <div style="font-weight: 500; font-size: 13px;">${escapeHTML(currentTxn.paymentMethod)}</div>
                </div>
                <div>
                  <div class="form-label">Location / IP Address</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">${escapeHTML(currentTxn.location)}</div>
                </div>
                <div>
                  <div class="form-label">Device Fingerprint</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">${escapeHTML(currentTxn.device)}</div>
                </div>
              </div>
            </div>

            <!-- AI RISK SCORES GRID -->
            <div class="panel" style="margin-bottom: 16px;">
              <div class="panel-header">
                <span class="panel-title">AI Fraud Metrics Engine</span>
                ${renderRiskBadge(currentTxn.riskLevel, currentTxn.riskScore)}
              </div>
              <div class="panel-body" style="padding: 16px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; text-align: center;">
                  <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">FRAUD PROBABILITY</div>
                    <div style="font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: ${currentTxn.fraudProbability > 50 ? 'var(--color-critical)' : 'var(--color-safe)'};">
                      ${currentTxn.fraudProbability}%
                    </div>
                  </div>
                  <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">RECIPIENT TRUST</div>
                    <div style="font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: ${currentTxn.recipientTrustScore < 40 ? 'var(--color-critical)' : 'var(--color-safe)'};">
                      ${currentTxn.recipientTrustScore}/100
                    </div>
                  </div>
                  <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">AMOUNT ANOMALY</div>
                    <div style="font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: ${currentTxn.amountAnomalyScore > 60 ? 'var(--color-medium)' : 'var(--color-safe)'};">
                      ${currentTxn.amountAnomalyScore}%
                    </div>
                  </div>
                </div>

                <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 12px; font-size: 12px; color: var(--text-primary); line-height: 1.5;">
                  <strong>AI Explanation:</strong> ${escapeHTML(currentTxn.reason || currentTxn.explanation)}
                </div>
              </div>
            </div>

            <!-- RISK INDICATORS LIST -->
            ${currentTxn.indicators && currentTxn.indicators.length ? `
              <div class="panel">
                <div class="panel-header"><span class="panel-title">Detected Risk Signals</span></div>
                <div class="panel-body" style="padding: 12px;">
                  <div class="risk-indicators-list">
                    ${currentTxn.indicators.map(ind => `
                      <div class="risk-indicator-chip">
                        <span class="badge badge-${ind.severity.toLowerCase()}">${ind.severity}</span>
                        <div>
                          <strong style="color: #fff;">${escapeHTML(ind.title)}:</strong>
                          <span style="color: var(--text-secondary);">${escapeHTML(ind.text)}</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- RIGHT COLUMN: AI RECOMMENDATION, ACTIONS & AUDIT TIMELINE -->
          <div>
            <div class="panel" style="margin-bottom: 16px;">
              <div class="panel-header">
                <span class="panel-title">AI Decision & Analyst Action</span>
              </div>
              <div class="panel-body" style="padding: 16px;">
                <div style="margin-bottom: 16px;">
                  <div class="form-label">System Recommendation</div>
                  <div style="font-weight: 700; color: ${currentTxn.riskLevel === 'CRITICAL' ? 'var(--color-critical)' : 'var(--color-safe)'}; font-size: 14px;">
                    ${escapeHTML(currentTxn.recommendedAction || 'Monitor Transaction')}
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <button id="btn-act-legitimate" class="btn btn-success" style="width: 100%;">
                    ✓ Mark as Legitimate
                  </button>
                  <button id="btn-act-escalate" class="btn btn-danger" style="width: 100%;">
                    ⚠️ Flag & Escalate to Case
                  </button>
                  <button id="btn-act-block" class="btn btn-secondary" style="width: 100%; border-color: var(--color-critical-border); color: var(--color-critical);">
                    🚫 Block / Flag Recipient
                  </button>
                </div>
              </div>
            </div>

            <!-- AUDIT TIMELINE -->
            <div class="panel">
              <div class="panel-header">
                <span class="panel-title">Audit Log & Event History</span>
              </div>
              <div class="panel-body" style="padding: 16px;">
                <div class="audit-timeline-list">
                  ${(currentTxn.auditTimeline || [
                    { time: currentTxn.time, desc: 'Transaction submitted' },
                    { time: currentTxn.time, desc: 'AI Risk Engine scored transaction' }
                  ]).map(item => `
                    <div class="audit-event">
                      <div class="audit-time">${escapeHTML(item.time)}</div>
                      <div class="audit-desc">${escapeHTML(item.desc)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="modal-footer">
        <button id="modal-close-btn" class="btn btn-secondary">Close Panel</button>
      </div>
    `;

    // Bind Close events
    document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
    document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);

    // Bind Action buttons
    document.getElementById('btn-act-legitimate')?.addEventListener('click', () => {
      stateStore.updateTransactionStatus(currentTxn.transactionId, 'Legitimate', 'Cleared by analyst after review.');
      renderModalContent();
    });

    document.getElementById('btn-act-escalate')?.addEventListener('click', () => {
      stateStore.updateTransactionStatus(currentTxn.transactionId, 'Under Review', 'Escalated to dedicated investigation case.');
      renderModalContent();
    });

    document.getElementById('btn-act-block')?.addEventListener('click', () => {
      stateStore.updateTransactionStatus(currentTxn.transactionId, 'Flagged', 'Recipient counterparty blocked by analyst.');
      renderModalContent();
    });
  }

  function closeModal() {
    backdrop.classList.add('hidden');
  }

  renderModalContent();
  backdrop.classList.remove('hidden');

  // Backdrop click outside modal container closes modal
  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };
}
