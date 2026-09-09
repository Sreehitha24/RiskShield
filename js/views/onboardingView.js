/**
 * RiskShield AI - Bank Connection Onboarding View
 */

import { stateStore } from '../state.js';
import { formatCurrency } from '../utils.js';

const DEMO_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦', accType: 'Savings Account', maskAcc: '•••• 8921', defaultBal: 248590.50 },
  { id: 'icici', name: 'ICICI Bank', logo: '🏛️', accType: 'Salary Account', maskAcc: '•••• 4410', defaultBal: 184200.00 },
  { id: 'sbi', name: 'State Bank of India', logo: '🏬', accType: 'Current Account', maskAcc: '•••• 7732', defaultBal: 512000.00 },
  { id: 'axis', name: 'Axis Bank', logo: '🏢', accType: 'Savings Account', maskAcc: '•••• 9102', defaultBal: 95400.00 },
  { id: 'demo', name: 'Other / Demo Bank', logo: '💳', accType: 'Corporate Account', maskAcc: '•••• 1029', defaultBal: 350000.00 }
];

export function renderOnboardingView() {
  const container = document.getElementById('unauth-view');
  let selectedBank = DEMO_BANKS[0];
  let isConnecting = false;
  let isConnectedSuccess = false;

  function updateUI() {
    container.innerHTML = `
      <div class="onboarding-container">
        <div class="onboarding-card">
          <div class="onboarding-header">
            <div class="brand-logo" style="margin: 0 auto 16px auto; width: 44px; height: 44px;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h1 class="onboarding-title">Connect your bank account</h1>
            <p class="onboarding-subtitle">Securely connect a bank account to analyze payment activity, baseline spending, and detect financial risk.</p>
          </div>

          ${isConnecting ? `
            <div class="connection-anim-container">
              <div class="spinner-pulse"></div>
              <h3 style="font-family: var(--font-heading); color: #fff; font-size: 18px; margin-bottom: 6px;">Authenticating Sandbox OAuth Token...</h3>
              <p style="font-size: 13px; color: var(--text-secondary);">Establishing encrypted handshake with ${selectedBank.name} API gateway...</p>
            </div>
          ` : isConnectedSuccess ? `
            <div class="connection-anim-container">
              <div style="width: 54px; height: 54px; background: var(--color-safe-bg); border: 1px solid var(--color-safe-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-safe); font-size: 26px; margin-bottom: 16px;">✓</div>
              <h3 style="font-family: var(--font-heading); color: #fff; font-size: 20px; margin-bottom: 6px;">Bank Account Connected Successfully</h3>
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 24px;">Your payment stream is now synchronized with RiskShield AI Risk Engine.</p>
              
              <div style="width: 100%; max-width: 440px; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; text-align: left; margin-bottom: 28px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: var(--text-muted); font-size: 12px;">Bank Institution:</span>
                  <span style="font-weight: 600; color: #fff; font-size: 13px;">${selectedBank.name}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: var(--text-muted); font-size: 12px;">Account Number:</span>
                  <span style="font-family: var(--font-mono); color: var(--accent-cyan); font-size: 13px;">${selectedBank.maskAcc}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted); font-size: 12px;">Available Balance:</span>
                  <span style="font-weight: 700; color: var(--color-safe); font-size: 14px;">${formatCurrency(selectedBank.defaultBal)}</span>
                </div>
              </div>

              <button id="btn-goto-dashboard" class="btn btn-primary" style="padding: 12px 28px; font-size: 14px;">
                Continue to RiskShield Dashboard →
              </button>
            </div>
          ` : `
            <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px;">Select Demo Bank Partner:</div>
            
            <div class="bank-grid">
              ${DEMO_BANKS.map(bank => `
                <div class="bank-select-card ${selectedBank.id === bank.id ? 'selected' : ''}" data-bank-id="${bank.id}">
                  <div class="bank-logo-icon">${bank.logo}</div>
                  <div class="bank-name-label">${bank.name}</div>
                </div>
              `).map(html => html).join('')}
            </div>

            <div class="bank-account-details-form">
              <div>
                <label class="form-label">Account Holder</label>
                <input type="text" class="form-control" value="${stateStore.getState().currentUser.name}" readonly>
              </div>
              <div>
                <label class="form-label">Account Type</label>
                <input type="text" class="form-control" value="${selectedBank.accType}" readonly>
              </div>
              <div>
                <label class="form-label">Masked Account Number</label>
                <input type="text" class="form-control" value="${selectedBank.maskAcc}" readonly>
              </div>
              <div>
                <label class="form-label">Starting Balance</label>
                <input type="text" class="form-control" value="${formatCurrency(selectedBank.defaultBal)}" readonly>
              </div>
            </div>

            <button id="btn-connect-bank" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 14px;">
              Connect Securely (Demo Sandbox)
            </button>
          `}
        </div>
      </div>
    `;

    // Event Bindings
    if (!isConnecting && !isConnectedSuccess) {
      container.querySelectorAll('.bank-select-card').forEach(card => {
        card.addEventListener('click', () => {
          const bankId = card.getAttribute('data-bank-id');
          selectedBank = DEMO_BANKS.find(b => b.id === bankId);
          updateUI();
        });
      });

      document.getElementById('btn-connect-bank')?.addEventListener('click', () => {
        isConnecting = true;
        updateUI();

        setTimeout(() => {
          isConnecting = false;
          isConnectedSuccess = true;
          // Save connected bank in state store
          stateStore.connectBank({
            bankName: selectedBank.name,
            accountType: selectedBank.accType,
            accountNumber: selectedBank.maskAcc,
            balance: selectedBank.defaultBal
          });
          updateUI();
        }, 1500);
      });
    }

    if (isConnectedSuccess) {
      document.getElementById('btn-goto-dashboard')?.addEventListener('click', () => {
        location.hash = '#/dashboard';
      });
    }
  }

  updateUI();
}
