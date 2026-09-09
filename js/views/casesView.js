/**
 * RiskShield AI - Case Management View & Case Workspace Workspace Modal
 */

import { stateStore } from '../state.js';
import { formatDate, formatCurrency, renderRiskBadge, renderStatusBadge, escapeHTML } from '../utils.js';
import { openInvestigationModal } from './investigationModal.js';

export function renderCasesView() {
  const container = document.getElementById('main-content-viewport');
  const state = stateStore.getState();
  const cases = state.cases || [];

  let currentFilter = 'ALL';
  let searchQuery = '';

  function renderList() {
    const totalCases = cases.length;
    const openCases = cases.filter(c => c.status === 'Open').length;
    const investigatingCases = cases.filter(c => c.status === 'Under Investigation').length;
    const resolvedCases = cases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

    let filtered = cases.filter(c => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const mId = (c.caseId || '').toLowerCase().includes(q);
        const mTxn = (c.transactionId || '').toLowerCase().includes(q);
        const mRec = (c.recipient || '').toLowerCase().includes(q);
        if (!mId && !mTxn && !mRec) return false;
      }
      if (currentFilter === 'OPEN') return c.status === 'Open';
      if (currentFilter === 'INVESTIGATING') return c.status === 'Under Investigation';
      if (currentFilter === 'RESOLVED') return c.status === 'Resolved' || c.status === 'Closed';
      return true;
    });

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Investigation Case Management</h1>
          <p>Managed security incident cases, analyst note timeline, and evidence verification.</p>
        </div>
      </div>

      <!-- KPI METRICS -->
      <div class="kpi-grid" style="margin-bottom: 20px;">
        <div class="kpi-card primary">
          <div class="kpi-title">Total Cases</div>
          <div class="kpi-value">${totalCases}</div>
        </div>
        <div class="kpi-card critical">
          <div class="kpi-title">Open Queue</div>
          <div class="kpi-value" style="color: var(--color-critical);">${openCases}</div>
        </div>
        <div class="kpi-card medium">
          <div class="kpi-title">Under Investigation</div>
          <div class="kpi-value" style="color: var(--color-medium);">${investigatingCases}</div>
        </div>
        <div class="kpi-card safe">
          <div class="kpi-title">Resolved / Closed</div>
          <div class="kpi-value" style="color: var(--color-safe);">${resolvedCases}</div>
        </div>
      </div>

      <!-- FILTER & SEARCH BAR -->
      <div class="panel" style="margin-bottom: 20px;">
        <div class="panel-body" style="padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm case-filter-btn ${currentFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">All Cases (${totalCases})</button>
            <button class="btn btn-secondary btn-sm case-filter-btn ${currentFilter === 'OPEN' ? 'active' : ''}" data-filter="OPEN">Open (${openCases})</button>
            <button class="btn btn-secondary btn-sm case-filter-btn ${currentFilter === 'INVESTIGATING' ? 'active' : ''}" data-filter="INVESTIGATING">Investigating (${investigatingCases})</button>
            <button class="btn btn-secondary btn-sm case-filter-btn ${currentFilter === 'RESOLVED' ? 'active' : ''}" data-filter="RESOLVED">Resolved (${resolvedCases})</button>
          </div>
          <div style="width: 260px;">
            <input type="text" id="case-search-input" class="form-control" placeholder="Search Case ID, Recipient..." value="${escapeHTML(searchQuery)}">
          </div>
        </div>
      </div>

      <!-- CASE TABLE -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">Active Cases (${filtered.length})</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Priority</th>
                <th>Related Transaction</th>
                <th>Counterparty / Amount</th>
                <th>Assigned Analyst</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length ? filtered.map(c => `
                <tr>
                  <td class="cell-mono">${escapeHTML(c.caseId)}</td>
                  <td>${renderRiskBadge(c.priority)}</td>
                  <td class="cell-mono" style="color: var(--accent-cyan); cursor: pointer;" onclick="window.openTxnModal('${c.transactionId}')">
                    ${escapeHTML(c.transactionId)}
                  </td>
                  <td>
                    <div><strong>${escapeHTML(c.recipient || 'Counterparty')}</strong></div>
                    <div class="cell-amount" style="font-size: 11px; color: var(--text-secondary);">${formatCurrency(c.amount)}</div>
                  </td>
                  <td>${escapeHTML(c.assignedAnalyst)}</td>
                  <td>${formatDate(c.createdDate)}</td>
                  <td>${renderStatusBadge(c.status)}</td>
                  <td>
                    <button class="btn btn-primary btn-sm btn-open-case-workspace" data-case-id="${c.caseId}">
                      Workspace Case
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    No investigation cases found matching filter criteria.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bindings
    container.querySelectorAll('.case-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');
        renderList();
      });
    });

    document.getElementById('case-search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderList();
    });

    container.querySelectorAll('.btn-open-case-workspace').forEach(btn => {
      btn.addEventListener('click', () => {
        const caseId = btn.getAttribute('data-case-id');
        openCaseWorkspaceModal(caseId);
      });
    });

    window.openTxnModal = openInvestigationModal;
  }

  renderList();
}

// OPEN CASE WORKSPACE MODAL
export function openCaseWorkspaceModal(caseId) {
  const backdrop = document.getElementById('modal-backdrop');
  const container = document.getElementById('modal-container');

  function renderWorkspace() {
    const state = stateStore.getState();
    const c = state.cases.find(item => item.caseId === caseId);

    if (!c) return;

    container.innerHTML = `
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; background: rgba(239, 68, 68, 0.14); border: 1px solid var(--color-critical-border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-critical);">
            📁
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h2 class="modal-title">Case Workspace: ${escapeHTML(c.caseId)}</h2>
              ${renderRiskBadge(c.priority)}
              ${renderStatusBadge(c.status)}
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
              Assigned Analyst: <strong>${escapeHTML(c.assignedAnalyst)}</strong> • Created ${formatDate(c.createdDate)}
            </p>
          </div>
        </div>
        <button id="modal-close-x" class="modal-close-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>

      <div class="modal-body">
        <div class="case-workspace-grid">
          
          <!-- LEFT SIDE: CASE OVERVIEW & EVIDENCE CHECKLIST -->
          <div>
            <div class="panel" style="margin-bottom: 16px;">
              <div class="panel-header"><span class="panel-title">Case & Transaction Details</span></div>
              <div class="panel-body" style="padding: 14px; font-size: 13px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: var(--text-muted);">Related Transaction:</span>
                  <span class="cell-mono" style="cursor: pointer;" onclick="window.openTxnModal('${c.transactionId}')">${escapeHTML(c.transactionId)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: var(--text-muted);">Recipient / Merchant:</span>
                  <strong style="color: #fff;">${escapeHTML(c.recipient)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Exposure Amount:</span>
                  <strong style="color: var(--color-critical);">${formatCurrency(c.amount)}</strong>
                </div>
              </div>
            </div>

            <!-- EVIDENCE CHECKLIST -->
            <div class="panel">
              <div class="panel-header"><span class="panel-title">Evidence Checklist</span></div>
              <div class="panel-body" style="padding: 14px;">
                <div class="evidence-checklist">
                  ${(c.evidenceChecklist || []).map(item => `
                    <label class="evidence-item">
                      <input type="checkbox" class="ev-check-item" data-ev-id="${item.id}" ${item.checked ? 'checked' : ''}>
                      <span style="${item.checked ? 'text-decoration: line-through; color: var(--text-muted);' : 'color: var(--text-primary);'}">
                        ${escapeHTML(item.text)}
                      </span>
                    </label>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT SIDE: NOTES & ACTIONS -->
          <div>
            <div class="panel" style="margin-bottom: 16px;">
              <div class="panel-header"><span class="panel-title">Analyst Case Actions</span></div>
              <div class="panel-body" style="padding: 14px; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <button id="btn-case-resolve" class="btn btn-success btn-sm">Mark Resolved</button>
                  <button id="btn-case-fraud" class="btn btn-danger btn-sm">Confirm Fraud</button>
                </div>
                <button id="btn-case-investigating" class="btn btn-secondary btn-sm">Set Under Investigation</button>
              </div>
            </div>

            <!-- INVESTIGATION NOTES -->
            <div class="panel">
              <div class="panel-header"><span class="panel-title">Investigation Notes & Log</span></div>
              <div class="panel-body" style="padding: 14px;">
                <div class="form-group" style="margin-bottom: 10px;">
                  <textarea id="case-note-input" class="form-control" rows="2" placeholder="Add analyst investigation note..."></textarea>
                </div>
                <button id="btn-add-note" class="btn btn-primary btn-sm" style="width: 100%; margin-bottom: 14px;">
                  + Post Case Note
                </button>

                <div class="notes-timeline">
                  ${(c.notes || []).map(n => `
                    <div class="note-card">
                      <div class="note-header">
                        <strong>${escapeHTML(n.author)}</strong>
                        <span>${escapeHTML(n.time)}</span>
                      </div>
                      <div class="note-text">${escapeHTML(n.text)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="modal-footer">
        <button id="modal-close-btn" class="btn btn-secondary">Close Workspace</button>
      </div>
    `;

    document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
    document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);

    container.querySelectorAll('.ev-check-item').forEach(chk => {
      chk.addEventListener('change', () => {
        const evId = chk.getAttribute('data-ev-id');
        stateStore.toggleCaseEvidence(caseId, evId);
        renderWorkspace();
      });
    });

    document.getElementById('btn-add-note')?.addEventListener('click', () => {
      const noteInput = document.getElementById('case-note-input');
      if (noteInput && noteInput.value.trim()) {
        stateStore.addCaseNote(caseId, noteInput.value.trim());
        renderWorkspace();
      }
    });

    document.getElementById('btn-case-resolve')?.addEventListener('click', () => {
      stateStore.updateCaseStatus(caseId, 'Resolved');
      renderWorkspace();
    });

    document.getElementById('btn-case-fraud')?.addEventListener('click', () => {
      stateStore.updateCaseStatus(caseId, 'Closed');
      renderWorkspace();
    });

    document.getElementById('btn-case-investigating')?.addEventListener('click', () => {
      stateStore.updateCaseStatus(caseId, 'Under Investigation');
      renderWorkspace();
    });
  }

  function closeModal() {
    backdrop.classList.add('hidden');
    renderCasesView(); // Refresh list behind
  }

  renderWorkspace();
  backdrop.classList.remove('hidden');

  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };
}
