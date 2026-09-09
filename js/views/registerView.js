/**
 * RiskShield AI - User Registration View (Create Account)
 */

import { stateStore } from '../state.js';

export function renderRegisterView() {
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
            <span>NEW ANALYST ONBOARDING</span>
          </div>
          <h1 class="login-hero-title">Create your RiskShield Analyst Account</h1>
          <p class="login-hero-desc">
            Register a new workspace account to connect bank sandbox streams, monitor payment activity, and utilize AI risk intelligence models.
          </p>

          <div class="login-features-list">
            <div class="login-feature-item">
              <span class="login-feature-icon">✓</span>
              <span>Instant access to RiskShield AI payment monitoring suite</span>
            </div>
            <div class="login-feature-item">
              <span class="login-feature-icon">✓</span>
              <span>Seamless demo bank sandbox integration</span>
            </div>
            <div class="login-feature-item">
              <span class="login-feature-icon">✓</span>
              <span>Persistent account session & investigation workspace</span>
            </div>
          </div>
        </div>

        <div style="font-size: 12px; color: var(--text-muted);">
          RiskShield Security Platform v4.2.0 • Enterprise Edition
        </div>
      </div>

      <!-- RIGHT REGISTRATION FORM CARD -->
      <div class="login-right-panel">
        <div class="login-card">
          <h2 class="login-card-title">Create Account</h2>
          <p class="login-card-subtitle">Enter your details to register a new RiskShield analyst profile.</p>

          <div id="reg-error-msg" class="hidden" style="margin-bottom: 16px; padding: 10px 14px; background: var(--color-critical-bg); border: 1px solid var(--color-critical-border); border-radius: var(--radius-md); font-size: 12px; color: var(--color-critical);"></div>

          <form id="register-form">
            <div class="form-group">
              <label class="form-label" for="reg-name">Full Name</label>
              <input type="text" id="reg-name" class="form-control" placeholder="e.g. Rahul Sharma" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Work Email</label>
              <input type="email" id="reg-email" class="form-control" placeholder="rahul@company.com" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-password">Password</label>
              <input type="password" id="reg-password" class="form-control" placeholder="Minimum 6 characters" required>
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
              <label class="form-label" for="reg-confirm-password">Confirm Password</label>
              <input type="password" id="reg-confirm-password" class="form-control" placeholder="Re-enter password" required>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 14px; margin-bottom: 16px;">
              Create Account & Continue →
            </button>
          </form>

          <div style="text-align: center; font-size: 13px; color: var(--text-secondary);">
            Already have a RiskShield account? 
            <a href="#/login" style="color: var(--accent-cyan); font-weight: 600;">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Registration Submit
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const errorMsg = document.getElementById('reg-error-msg');

    if (password !== confirmPassword) {
      errorMsg.textContent = 'Passwords do not match. Please verify.';
      errorMsg.classList.remove('hidden');
      return;
    }

    if (password.length < 4) {
      errorMsg.textContent = 'Password must be at least 4 characters long.';
      errorMsg.classList.remove('hidden');
      return;
    }

    // Register new user in StateStore
    const registered = stateStore.registerUser({ name, email, password });
    if (!registered.success) {
      errorMsg.textContent = registered.error || 'Registration failed.';
      errorMsg.classList.remove('hidden');
      return;
    }

    // New user created -> Navigates to Connect Bank onboarding
    location.hash = '#/connect-bank';
  });
}
