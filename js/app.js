/**
 * RiskShield AI - SPA Bootstrapper & Router
 * Manages route protection, onboarding workflows, and user session persistence.
 */

import { stateStore } from './state.js';
import { renderLoginView } from './views/loginView.js';
import { renderRegisterView } from './views/registerView.js';
import { renderOnboardingView } from './views/onboardingView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderTransactionsView } from './views/transactionsView.js';
import { renderAnalyticsView } from './views/analyticsView.js';
import { renderLiveMonitorView } from './views/liveMonitorView.js';
import { renderAlertsView } from './views/alertsView.js';
import { renderCasesView } from './views/casesView.js';
import { renderReportsView } from './views/reportsView.js';
import { openInvestigationModal } from './views/investigationModal.js';
import { aiAssistant } from './components/aiAssistant.js';
import { escapeHTML } from './utils.js';

class App {
  constructor() {
    this.unauthContainer = document.getElementById('unauth-view');
    this.authShell = document.getElementById('auth-app-shell');
    this.mainContent = document.getElementById('main-content-viewport');

    this.init();
  }

  init() {
    // Bind hash change listener
    window.addEventListener('hashchange', () => this.handleRoute());

    // Subscribe to state store changes
    stateStore.subscribe((state) => {
      this.updateHeaderAndSidebar(state);
    });

    // Bind Global Search Input
    this.initGlobalSearch();

    // Bind Header Controls
    this.initHeaderControls();

    // Initial Route Handler
    this.handleRoute();
  }

  handleRoute() {
    const state = stateStore.getState();
    const rawHash = location.hash.replace('#/', '').trim();

    // 1. Unauthenticated User Guards
    if (!state.isLoggedIn) {
      if (rawHash === 'register') {
        this.showUnauthShell();
        renderRegisterView();
        return;
      }
      if (rawHash !== 'login') {
        location.hash = '#/login';
        return;
      }
      this.showUnauthShell();
      renderLoginView();
      return;
    }

    // 2. Onboarding Guard: User is logged in but has NOT completed bank connection
    const isOnboarded = state.currentUser && state.currentUser.onboardingCompleted && state.bankConnection && state.bankConnection.connected;

    if (!isOnboarded) {
      if (rawHash !== 'connect-bank') {
        location.hash = '#/connect-bank';
        return;
      }
      this.showUnauthShell();
      renderOnboardingView();
      return;
    }

    // 3. User is logged in AND onboarded: redirect auth/onboarding pages to dashboard
    if (!rawHash || rawHash === 'login' || rawHash === 'register' || rawHash === 'connect-bank') {
      location.hash = '#/dashboard';
      return;
    }

    // 4. Authenticated & Onboarded Protected Views
    this.showAuthShell();
    this.updateActiveNavLink(rawHash);
    this.updateHeaderAndSidebar(state);

    switch (rawHash) {
      case 'dashboard':
        renderDashboardView();
        break;
      case 'transactions':
        renderTransactionsView();
        break;
      case 'analytics':
        renderAnalyticsView();
        break;
      case 'live-monitor':
        renderLiveMonitorView();
        break;
      case 'alerts':
        renderAlertsView();
        break;
      case 'cases':
        renderCasesView();
        break;
      case 'reports':
        renderReportsView();
        break;
      default:
        renderDashboardView();
        break;
    }
  }

  showUnauthShell() {
    this.unauthContainer.classList.remove('hidden');
    this.authShell.classList.add('hidden');
  }

  showAuthShell() {
    this.unauthContainer.classList.add('hidden');
    this.authShell.classList.remove('hidden');
  }

  updateActiveNavLink(route) {
    const links = document.querySelectorAll('.sidebar-nav .nav-link');
    links.forEach(link => {
      const targetRoute = link.getAttribute('data-route');
      if (targetRoute === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  updateHeaderAndSidebar(state) {
    // Bank indicator
    const bank = state.bankConnection;
    if (bank) {
      document.getElementById('sb-bank-name').textContent = bank.bankName;
      document.getElementById('sb-acc-number').textContent = bank.accountNumber;
      document.getElementById('hdr-bank-text').textContent = `${bank.bankName} (${bank.accountNumber})`;
    }

    // User Profile
    if (state.currentUser) {
      document.getElementById('user-display-name').textContent = state.currentUser.name;
    }

    // Counter Badge for Alerts
    const openAlertsCount = (state.alerts || []).filter(a => a.status !== 'Resolved').length;
    const alertCounterBadge = document.getElementById('alert-counter-badge');
    if (alertCounterBadge) {
      alertCounterBadge.textContent = openAlertsCount;
      if (openAlertsCount > 0) alertCounterBadge.classList.remove('hidden');
      else alertCounterBadge.classList.add('hidden');
    }

    // Notifications List
    const notifDot = document.getElementById('notif-dot');
    const notifList = document.getElementById('notif-list-content');
    const notifs = state.notifications || [];

    if (notifs.length > 0 && notifDot) notifDot.classList.remove('hidden');
    else if (notifDot) notifDot.classList.add('hidden');

    if (notifList) {
      notifList.innerHTML = notifs.length ? notifs.map(n => `
        <div style="padding: 10px 14px; border-bottom: 1px solid var(--border-color); font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <strong style="color: #fff;">${escapeHTML(n.title)}</strong>
            <span style="color: var(--text-muted); font-size: 10px;">${escapeHTML(n.time)}</span>
          </div>
          <div style="color: var(--text-secondary);">${escapeHTML(n.message)}</div>
        </div>
      `).join('') : `
        <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">
          No notifications
        </div>
      `;
    }
  }

  initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const dropdown = document.getElementById('search-results-dropdown');

    if (!searchInput || !dropdown) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        dropdown.classList.add('hidden');
        return;
      }

      const state = stateStore.getState();
      const matchingTxns = (state.transactions || []).filter(t => 
        (t.transactionId || '').toLowerCase().includes(q) ||
        (t.recipient || '').toLowerCase().includes(q)
      );

      const matchingCases = (state.cases || []).filter(c => 
        (c.caseId || '').toLowerCase().includes(q) ||
        (c.recipient || '').toLowerCase().includes(q)
      );

      if (!matchingTxns.length && !matchingCases.length) {
        dropdown.innerHTML = `<div style="padding: 12px; font-size: 12px; color: var(--text-muted); text-align: center;">No matching records found</div>`;
      } else {
        dropdown.innerHTML = `
          ${matchingTxns.length ? `<div style="font-size: 10px; font-weight: 700; color: var(--text-muted); padding: 4px 8px;">TRANSACTIONS (${matchingTxns.length})</div>` : ''}
          ${matchingTxns.slice(0, 4).map(t => `
            <div class="search-item" data-txn-id="${t.transactionId}" style="padding: 8px; border-radius: var(--radius-sm); cursor: pointer; display: flex; justify-content: space-between; font-size: 12px;">
              <span class="cell-mono">${escapeHTML(t.transactionId)} - ${escapeHTML(t.recipient)}</span>
              <span style="color: var(--accent-cyan);">₹${Number(t.amount).toLocaleString('en-IN')}</span>
            </div>
          `).join('')}

          ${matchingCases.length ? `<div style="font-size: 10px; font-weight: 700; color: var(--text-muted); padding: 4px 8px; margin-top: 6px;">CASES (${matchingCases.length})</div>` : ''}
          ${matchingCases.slice(0, 3).map(c => `
            <div class="search-item-case" data-case-id="${c.caseId}" style="padding: 8px; border-radius: var(--radius-sm); cursor: pointer; display: flex; justify-content: space-between; font-size: 12px;">
              <span class="cell-mono">${escapeHTML(c.caseId)} - ${escapeHTML(c.recipient)}</span>
              <span style="color: var(--color-critical);">${escapeHTML(c.status)}</span>
            </div>
          `).join('')}
        `;

        dropdown.querySelectorAll('.search-item').forEach(item => {
          item.addEventListener('click', () => {
            openInvestigationModal(item.getAttribute('data-txn-id'));
            dropdown.classList.add('hidden');
            searchInput.value = '';
          });
        });
      }

      dropdown.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  initHeaderControls() {
    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      stateStore.logout();
      location.hash = '#/login';
    });

    // Mobile Sidebar Toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('main-sidebar')?.classList.toggle('open');
    });

    // Notifications Toggle
    const notifBtn = document.getElementById('notif-toggle-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown?.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!notifDropdown?.contains(e.target) && !notifBtn?.contains(e.target)) {
        notifDropdown?.classList.add('hidden');
      }
    });

    document.getElementById('notif-clear-btn')?.addEventListener('click', () => {
      stateStore.clearNotifications();
    });

    // Header Quick Simulate Fraud Button
    document.getElementById('quick-sim-fraud-btn')?.addEventListener('click', () => {
      stateStore.simulateTransaction('FRAUD');
    });
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
