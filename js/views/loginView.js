/**
 * RiskShield AI - Login View
 * Supports Existing User Login & New User Registration paths.
 */

import { stateStore } from '../state.js';

export function renderLoginView() {
  const container = document.getElementById('unauth-view');
  container.innerHTML = `
    <div class="login-view-container">
      <!-- LEFT HERO PANEL -->
      <div class="login-left-panel">
        <div class="login-brand-header">
          <div class="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title" style="font-size: 22px;">RiskShield</span>
            <span class="brand-badge">AI PAYMENT RISK</span>
          </div>
        </div>

        <div class="login-hero-content">
          <div class="login-hero-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>NEXT-GEN FINTECH SECURITY</span>
          </div>
          <h1 class="login-hero-title">Secure your payments with intelligent risk detection</h1>
          <p class="login-hero-desc">
            RiskShield leverages real-time behavioral ML models, recipient counterparty trust signals, and anomaly metrics to prevent payment fraud before money moves.
          </p>

          <div class="login-features-list">
            <div class="login-feature-item">
              <span class="login-feature-icon">✓</span>
              <span>Autonomous real-time transaction risk scoring & probability modeling</span>
            </div>
            <div class="login-feature-item">
              <span class="login-feature-icon">✓</span>
              <span>Unified incident investigation workspace & automated audit timeline</span>
            </div>
            <div class="login-feature-item">
              <span class="login-feature-icon">✓</span>
              <span>Multi-bank simulation support with persistent account state</span>
            </div>
          </div>
        </div>

        <div style="font-size: 12px; color: var(--text-muted);">
          RiskShield Security Platform v4.2.0 • Enterprise Edition
        </div>
      </div>

      <!-- RIGHT LOGIN FORM CARD -->
      <div class="login-right-panel">
        <div class="login-card">
          <h2 class="login-card-title">Analyst Portal Sign In</h2>
          <p class="login-card-subtitle">Enter your credentials to access your RiskShield dashboard.</p>

          <div id="login-error-msg" class="hidden" style="margin-bottom: 16px; padding: 10px 14px; background: var(--color-critical-bg); border: 1px solid var(--color-critical-border); border-radius: var(--radius-md); font-size: 12px; color: var(--color-critical);"></div>

          <!-- PATH A: EXISTING USER LOGIN FORM -->
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Work Email</label>
              <input type="email" id="login-email" class="form-control" value="alex.dawson@riskshield.ai" required placeholder="name@company.com">
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input type="password" id="login-password" class="form-control" value="demo123" required>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; font-size: 12px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--text-secondary);">
                <input type="checkbox" checked style="accent-color: var(--accent-cyan);"> Remember session
              </label>
              <button type="button" id="reset-demo-link" style="background: none; border: none; color: var(--accent-cyan); cursor: pointer; font-size: 12px; padding: 0;">Reset Demo?</button>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 14px; margin-bottom: 20px;">
              Sign In to RiskShield
            </button>
          </form>

          <!-- PATH B: NEW USER REGISTRATION LINK -->
          <div style="text-align: center; padding-top: 16px; border-top: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary);">
            New to RiskShield? 
            <a href="#/register" style="color: var(--accent-cyan); font-weight: 600;">Create an Account</a>
          </div>

          <!-- QUICK DEMO ACCESS -->
          <div class="demo-account-box" style="margin-top: 20px;">
            <div class="demo-account-info">
              <span class="demo-account-label">Quick Demo Access</span>
              <span class="demo-account-creds">Existing Analyst (Alex Dawson)</span>
            </div>
            <button id="quick-demo-btn" class="btn btn-secondary btn-sm">One-Click Login</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const errorMsg = document.getElementById('login-error-msg');

  // Bind Form Submit for Existing User Login
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pwd = document.getElementById('login-password').value;

    const result = stateStore.login(email, pwd);
    if (!result.success) {
      errorMsg.textContent = result.error || 'Invalid credentials.';
      errorMsg.classList.remove('hidden');
      return;
    }

    // Existing user login: If bank is already connected, go directly to Dashboard; else to connect-bank
    if (result.user.onboardingCompleted && result.user.bankConnection?.connected) {
      location.hash = '#/dashboard';
    } else {
      location.hash = '#/connect-bank';
    }
  });

  // Quick Demo Login for existing user Alex Dawson
  document.getElementById('quick-demo-btn').addEventListener('click', () => {
    const result = stateStore.login('alex.dawson@riskshield.ai', 'demo123');
    if (result.user.onboardingCompleted && result.user.bankConnection?.connected) {
      location.hash = '#/dashboard';
    } else {
      location.hash = '#/connect-bank';
    }
  });

  // Reset Demo handler
  document.getElementById('reset-demo-link').addEventListener('click', () => {
    stateStore.resetDemo();
    location.hash = '#/login';
    location.reload();
  });
}
