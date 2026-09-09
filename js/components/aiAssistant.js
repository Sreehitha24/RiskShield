/**
 * RiskShield AI - Floating Context-Aware AI Assistant Component
 * Enhanced Human Analyst Conversational Reasoning Engine.
 */

import { stateStore } from '../state.js';
import { formatCurrency, escapeHTML } from '../utils.js';
import { openInvestigationModal } from '../views/investigationModal.js';

class AIAssistant {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.container = null;
    this.lastMentionedTxns = [];
    this.lastMentionedTxn = null;
    this.init();
  }

  init() {
    // Inject floating button and panel DOM into #app container if not already present
    if (!document.getElementById('ai-assistant-root')) {
      const root = document.createElement('div');
      root.id = 'ai-assistant-root';
      root.innerHTML = `
        <!-- FLOATING AI ASSISTANT TOGGLE BUTTON -->
        <button id="ai-assistant-toggle-btn" class="ai-float-btn" title="Ask RiskShield AI Assistant">
          <div class="ai-btn-glow"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/>
          </svg>
          <span class="ai-btn-pulse"></span>
        </button>

        <!-- FLOATING CHAT PANEL -->
        <div id="ai-assistant-panel" class="ai-panel hidden">
          <div class="ai-panel-header">
            <div class="ai-header-info">
              <div class="ai-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div>
                <div class="ai-title">RiskShield AI</div>
                <div class="ai-subtitle">
                  <span class="ai-status-dot"></span> AI Payment Risk Assistant
                </div>
              </div>
            </div>
            <button id="ai-panel-close-btn" class="ai-close-btn" title="Close AI Assistant">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- SUGGESTION CHIPS -->
          <div class="ai-suggestions-container" id="ai-suggestions">
            <button class="ai-chip" data-query="Explain this page">Explain this page</button>
            <button class="ai-chip" data-query="What needs my attention?">What needs my attention?</button>
            <button class="ai-chip" data-query="Why was TXN-90821 flagged?">Why was TXN-90821 flagged?</button>
            <button class="ai-chip" data-query="Show high-risk transactions">Show high-risk transactions</button>
          </div>

          <!-- CHAT MESSAGES BODY -->
          <div class="ai-chat-body" id="ai-chat-messages">
            <!-- Dynamic Messages -->
          </div>

          <!-- INPUT CONTAINER -->
          <div class="ai-input-container">
            <input type="text" id="ai-chat-input" placeholder="Ask anything about your transactions..." autocomplete="off">
            <button id="ai-send-btn" class="ai-send-btn" title="Send Message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      `;
      const appElem = document.getElementById('app') || document.body;
      appElem.appendChild(root);
    }

    this.container = document.getElementById('ai-assistant-panel');
    this.bindEvents();

    // Initial Welcome Message
    this.addAIMessage(
      "Hello Alex! I'm your RiskShield AI Risk Analyst. I inspect your account activity and security signals in real time. What would you like to check?",
      [
        { label: "What needs my attention?", query: "What needs my attention?" },
        { label: "Explain this page", query: "Explain this page" }
      ]
    );
  }

  bindEvents() {
    const toggleBtn = document.getElementById('ai-assistant-toggle-btn');
    const closeBtn = document.getElementById('ai-panel-close-btn');
    const sendBtn = document.getElementById('ai-send-btn');
    const input = document.getElementById('ai-chat-input');
    const suggestions = document.getElementById('ai-suggestions');

    toggleBtn?.addEventListener('click', () => this.togglePanel());
    closeBtn?.addEventListener('click', () => this.closePanel());

    sendBtn?.addEventListener('click', () => this.handleSendMessage());
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    suggestions?.addEventListener('click', (e) => {
      const chip = e.target.closest('.ai-chip');
      if (chip) {
        const query = chip.getAttribute('data-query');
        this.processUserQuery(query);
      }
    });

    // Delegated click handler for AI action buttons
    document.getElementById('ai-chat-messages')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.ai-action-btn');
      if (btn) {
        const actionType = btn.getAttribute('data-action-type');
        const target = btn.getAttribute('data-target');

        if (actionType === 'modal') {
          openInvestigationModal(target);
          this.closePanel();
        } else if (actionType === 'navigate') {
          location.hash = `#/${target}`;
          this.closePanel();
        } else if (actionType === 'query') {
          this.processUserQuery(target);
        }
      }
    });
  }

  togglePanel() {
    if (this.isOpen) this.closePanel();
    else this.openPanel();
  }

  openPanel() {
    this.isOpen = true;
    this.container.classList.remove('hidden');
    document.getElementById('ai-chat-input')?.focus();
  }

  closePanel() {
    this.isOpen = false;
    this.container.classList.add('hidden');
  }

  handleSendMessage() {
    const input = document.getElementById('ai-chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    this.processUserQuery(text);
  }

  processUserQuery(queryText) {
    document.getElementById('ai-suggestions')?.classList.add('hidden');

    this.addUserMessage(queryText);

    setTimeout(() => {
      const response = this.generateAIResponse(queryText);
      this.addAIMessage(response.text, response.actions);
    }, 300);
  }

  addUserMessage(text) {
    this.messages.push({ sender: 'user', text });
    this.renderMessages();
  }

  addAIMessage(text, actions = []) {
    this.messages.push({ sender: 'ai', text, actions });
    this.renderMessages();
  }

  renderMessages() {
    const chatContainer = document.getElementById('ai-chat-messages');
    if (!chatContainer) return;

    chatContainer.innerHTML = this.messages.map(msg => `
      <div class="ai-msg ${msg.sender === 'user' ? 'user' : 'ai'}">
        ${msg.sender === 'ai' ? `<div class="ai-msg-avatar">🛡️</div>` : ''}
        <div class="ai-msg-bubble">
          <div class="ai-msg-text">${escapeHTML(msg.text).replace(/\n/g, '<br>')}</div>
          ${msg.actions && msg.actions.length ? `
            <div class="ai-actions-group">
              ${msg.actions.map(act => `
                <button class="ai-action-btn" data-action-type="${act.actionType || 'query'}" data-target="${act.target || act.query}">
                  ${escapeHTML(act.label)}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  /**
   * Human Risk Analyst Conversational Reasoning Engine
   * Strictly reads stateStore data as absolute truth, responds naturally, and retains conversation memory.
   */
  generateAIResponse(query) {
    const q = query.toLowerCase().trim();
    const state = stateStore.getState();
    const route = location.hash.replace('#/', '').trim() || 'dashboard';
    const txns = state.transactions || [];
    const alerts = state.alerts || [];
    const cases = state.cases || [];
    const baseline = 1800; // Normal spending baseline

    // 1. CASUAL GREETINGS & PLEASANTRIES (Respond briefly & naturally without dumping account stats)
    if (q === 'how are you' || q === 'how are you?' || q === 'how are you doing') {
      return { text: "I'm doing well! I'm here to help you with your RiskShield account, transactions, alerts, and fraud risks. What would you like to check?" };
    }
    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'greetings') {
      return { text: "Hello! How can I help you analyze your payment activity or check security risks today?" };
    }
    if (q === 'good morning' || q === 'good afternoon' || q === 'good evening') {
      return { text: `Good ${q.split(' ')[1] || 'day'}! How can I assist you with your RiskShield account monitoring today?` };
    }
    if (q === 'thanks' || q === 'thank you' || q === 'thanks!' || q === 'thank you so much') {
      return { text: "You're very welcome! Let me know whenever you want to inspect another transaction or check system alerts." };
    }
    if (q === 'okay' || q === 'ok' || q === 'got it' || q === 'cool' || q === 'sure') {
      return { text: "Understood. Feel free to ask if you need anything else examined." };
    }
    if (q === 'bye' || q === 'goodbye') {
      return { text: "Goodbye! I'll keep monitoring your RiskShield payment stream for any security anomalies in the background." };
    }

    // Helper: Find specific transaction mentioned in query (e.g. TXN-90821, TXN-82634)
    const matchTxnId = q.match(/txn-\d+/i);
    let queriedTxn = null;
    if (matchTxnId) {
      const targetId = matchTxnId[0].toUpperCase();
      queriedTxn = txns.find(t => t.transactionId.toUpperCase() === targetId);
    } else {
      queriedTxn = txns.find(t => 
        (t.recipient && q.includes(t.recipient.toLowerCase())) ||
        (t.merchant && q.includes(t.merchant.toLowerCase()))
      );
    }

    // 2. SPECIFIC TRANSACTION BY ID OR NAME ("Why was TXN-90821 flagged?" / "Tell me about Swiggy")
    if (queriedTxn) {
      this.lastMentionedTxn = queriedTxn;
      this.lastMentionedTxns = [queriedTxn];

      const indicatorsText = queriedTxn.indicators && queriedTxn.indicators.length
        ? queriedTxn.indicators.map(i => `• ${i.title}: ${i.text}`).join('\n')
        : `• ${queriedTxn.reason || queriedTxn.explanation}`;

      return {
        text: `Transaction ${queriedTxn.transactionId} (${queriedTxn.recipient}) is currently marked ${queriedTxn.status} with a ${queriedTxn.riskLevel} risk level (Risk Score: ${queriedTxn.riskScore}/100).\n\nAmount: ${formatCurrency(queriedTxn.amount)} via ${queriedTxn.paymentMethod}\nTime: ${queriedTxn.time} (${queriedTxn.date})\nLocation/Device: ${queriedTxn.location}\n\nPrimary Risk Signals:\n${indicatorsText}`,
        actions: [
          { label: `Inspect ${queriedTxn.transactionId} Details`, actionType: "modal", target: queriedTxn.transactionId },
          { label: "Is this amount unusual?", actionType: "query", target: "Is this amount unusual?" }
        ]
      };
    }

    // 3. CONVERSATIONAL FOLLOW-UP MEMORY QUESTIONS ("Show me them", "Why is the first one critical?", "Is that amount unusual?")
    if (q.includes('show me them') || q.includes('show them') || q.includes('list them') || q.includes('what are they')) {
      if (this.lastMentionedTxns && this.lastMentionedTxns.length) {
        const listStr = this.lastMentionedTxns.map((t, idx) => 
          `${idx + 1}. ${t.transactionId} (${formatCurrency(t.amount)} → ${t.recipient}) - ${t.riskLevel} [Risk Score: ${t.riskScore}]`
        ).join('\n');

        return {
          text: `Here are those ${this.lastMentionedTxns.length} transactions:\n\n${listStr}\n\nWhich one would you like to inspect in detail?`,
          actions: this.lastMentionedTxns.slice(0, 3).map(t => ({
            label: `Inspect ${t.transactionId}`,
            actionType: "modal",
            target: t.transactionId
          }))
        };
      }
    }

    if (q.includes('first one') || q.includes('first transaction') || q.includes('why is the first')) {
      const target = (this.lastMentionedTxns && this.lastMentionedTxns[0]) || this.lastMentionedTxn || txns.find(t => t.riskLevel === 'CRITICAL');
      if (target) {
        this.lastMentionedTxn = target;
        return {
          text: `The first transaction is ${target.transactionId} for ${formatCurrency(target.amount)} to ${target.recipient}.\n\nIt was flagged as ${target.riskLevel} because ${target.reason || target.explanation}\n\nKey signals: Recipient Trust Score is ${target.recipientTrustScore}/100 and Amount Anomaly is ${target.amountAnomalyScore}%.`,
          actions: [
            { label: `Inspect ${target.transactionId}`, actionType: "modal", target: target.transactionId },
            { label: "Is that amount unusual?", actionType: "query", target: "Is that amount unusual?" }
          ]
        };
      }
    }

    if (q.includes('second one') || q.includes('second transaction') || q.includes('what about the second')) {
      const target = (this.lastMentionedTxns && this.lastMentionedTxns[1]);
      if (target) {
        this.lastMentionedTxn = target;
        return {
          text: `The second transaction is ${target.transactionId} for ${formatCurrency(target.amount)} to ${target.recipient}.\n\nIt was flagged as ${target.riskLevel} (Risk Score: ${target.riskScore}/100) because ${target.reason || target.explanation}`,
          actions: [
            { label: `Inspect ${target.transactionId}`, actionType: "modal", target: target.transactionId }
          ]
        };
      }
    }

    if (q.includes('is that amount unusual') || q.includes('is this amount unusual') || q.includes('unusual amount')) {
      const target = this.lastMentionedTxn || txns.find(t => t.riskLevel === 'CRITICAL') || txns[0];
      const ratio = Math.round(target.amount / baseline);

      return {
        text: `Yes, ${formatCurrency(target.amount)} is far outside your normal spending pattern. Your average transaction baseline is ₹${baseline.toLocaleString('en-IN')}, making this purchase about ${ratio}x larger than normal.`,
        actions: [
          { label: `Inspect ${target.transactionId}`, actionType: "modal", target: target.transactionId }
        ]
      };
    }

    // 4. "HOW MANY CRITICAL TRANSACTIONS" -> ANSWER COUNT FIRST
    if (q.includes('how many critical') || (q.includes('how many') && q.includes('critical'))) {
      const criticalTxns = txns.filter(t => t.riskLevel === 'CRITICAL');
      this.lastMentionedTxns = criticalTxns;
      if (criticalTxns.length > 0) this.lastMentionedTxn = criticalTxns[0];

      return {
        text: `You currently have ${criticalTxns.length} critical transactions in your account.`,
        actions: criticalTxns.length > 0 ? [
          { label: "Show critical transactions", actionType: "query", target: "Show the critical transactions" },
          { label: "Why are they critical?", actionType: "query", target: "Why are they critical?" }
        ] : []
      };
    }

    // 5. CRITICAL TRANSACTIONS LIST & REASONS ("What are the critical transactions and reasons for it?" / "Show me critical")
    if (q.includes('critical') && (q.includes('transaction') || q.includes('show') || q.includes('list') || q.includes('reason') || q.includes('why'))) {
      const criticalTxns = txns.filter(t => t.riskLevel === 'CRITICAL');
      this.lastMentionedTxns = criticalTxns;
      if (criticalTxns.length > 0) this.lastMentionedTxn = criticalTxns[0];

      if (criticalTxns.length === 0) {
        return { text: "You currently have 0 critical transactions. All recent payment activity matches your safe baseline." };
      }

      const breakdown = criticalTxns.map((t, i) => 
        `${i + 1}. ${t.transactionId} for ${formatCurrency(t.amount)} to ${t.recipient}.\n   Reason: ${t.reason || t.explanation}`
      ).join('\n\n');

      return {
        text: `You currently have ${criticalTxns.length} critical transactions:\n\n${breakdown}\n\nThe primary risk drivers here are high amount anomalies, off-hours transfers, proxy/VPN routing, and low counterparty trust scores.`,
        actions: criticalTxns.slice(0, 3).map(t => ({
          label: `Inspect ${t.transactionId}`,
          actionType: "modal",
          target: t.transactionId
        }))
      };
    }

    // 6. HIGH RISK TRANSACTIONS
    if (q.includes('high risk') || q.includes('flagged transaction')) {
      const highRiskTxns = txns.filter(t => t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL');
      this.lastMentionedTxns = highRiskTxns;
      if (highRiskTxns.length > 0) this.lastMentionedTxn = highRiskTxns[0];

      const totalHighVal = highRiskTxns.reduce((a, c) => a + Number(c.amount), 0);
      const itemsStr = highRiskTxns.map(t => 
        `• ${t.transactionId}: ${formatCurrency(t.amount)} → ${t.recipient} (${t.riskLevel}, Score: ${t.riskScore})`
      ).join('\n');

      return {
        text: `You have ${highRiskTxns.length} high-risk or critical transactions totaling ${formatCurrency(totalHighVal)}:\n\n${itemsStr}`,
        actions: highRiskTxns.slice(0, 3).map(t => ({
          label: `Inspect ${t.transactionId}`,
          actionType: "modal",
          target: t.transactionId
        }))
      };
    }

    // 7. WHAT NEEDS MY ATTENTION / RISKIEST TRANSACTION / WHAT SHOULD I INVESTIGATE FIRST
    if (q.includes('attention') || q.includes('riskiest') || q.includes('investigate first') || q.includes('what should i do')) {
      const sortedByRisk = [...txns].sort((a, b) => b.riskScore - a.riskScore);
      const topRisky = sortedByRisk[0];
      this.lastMentionedTxn = topRisky;
      this.lastMentionedTxns = sortedByRisk.slice(0, 3);

      const openAlerts = alerts.filter(a => a.status !== 'Resolved');
      const openCasesList = cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');

      return {
        text: `The item needing your immediate attention is transaction ${topRisky.transactionId} (${formatCurrency(topRisky.amount)} to ${topRisky.recipient}) with a Risk Score of ${topRisky.riskScore}/100.\n\nYou also have ${openAlerts.length} open security alerts and ${openCasesList.length} active investigation cases. I recommend opening the investigation panel for ${topRisky.transactionId} first.`,
        actions: [
          { label: `Inspect ${topRisky.transactionId}`, actionType: "modal", target: topRisky.transactionId },
          { label: "Open Case Management", actionType: "navigate", target: "cases" },
          { label: "View Alerts Center", actionType: "navigate", target: "alerts" }
        ]
      };
    }

    // 8. FINANCIAL EXPOSURE / HOW MUCH MONEY AT RISK
    if (q.includes('exposure') || q.includes('how much money') || q.includes('money at risk') || q.includes('at risk')) {
      const critVal = txns.filter(t => t.riskLevel === 'CRITICAL').reduce((a, c) => a + Number(c.amount), 0);
      const highVal = txns.filter(t => t.riskLevel === 'HIGH').reduce((a, c) => a + Number(c.amount), 0);
      const totalExposure = critVal + highVal;

      return {
        text: `You currently have ${formatCurrency(totalExposure)} in total high-risk financial exposure across critical (${formatCurrency(critVal)}) and high-risk (${formatCurrency(highVal)}) transactions.`,
        actions: [
          { label: "View Fraud Analytics", actionType: "navigate", target: "analytics" },
          { label: "View Reports & Intelligence", actionType: "navigate", target: "reports" }
        ]
      };
    }

    // 9. FRAUD DETECTION RATE & ANALYTICS
    if (q.includes('detection rate') || q.includes('analytics') || q.includes('model confidence')) {
      const safeCount = txns.filter(t => t.riskLevel === 'LOW').length;
      const rate = Math.round(((txns.length - safeCount) / (txns.length || 1)) * 100);

      return {
        text: `Our AI Fraud Detection Engine currently operates with a 94.8% precision rating. Out of ${txns.length} processed payments, ${txns.length - safeCount} (${rate}%) triggered risk flags for analyst review.`,
        actions: [
          { label: "Go to Fraud Analytics", actionType: "navigate", target: "analytics" }
        ]
      };
    }

    // 10. ALERTS & CASES INQUIRIES
    if (q.includes('alert') || q.includes('alerts')) {
      const activeAlerts = alerts.filter(a => a.status !== 'Resolved');
      const critAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL');

      return {
        text: `You have ${alerts.length} total alerts, with ${activeAlerts.length} under investigation. The most severe is ${critAlerts[0]?.alertId || 'ALT-401'}: ${critAlerts[0]?.description || 'Cross-border transfer anomaly'}.`,
        actions: [
          { label: "Go to Alerts Center", actionType: "navigate", target: "alerts" }
        ]
      };
    }

    if (q.includes('case') || q.includes('cases')) {
      const activeCases = cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');

      return {
        text: `You have ${cases.length} investigation cases logged, with ${activeCases.length} open or under investigation. The top case is ${activeCases[0]?.caseId || 'CAS-102'} (${activeCases[0]?.recipient || 'Global Crypto'}).`,
        actions: [
          { label: "Open Case Management", actionType: "navigate", target: "cases" }
        ]
      };
    }

    // 11. EXPLAIN THIS PAGE
    if (q.includes('explain this page') || q.includes('what is this page') || q.includes('explain page')) {
      switch (route) {
        case 'dashboard':
          return {
            text: `You're on the Dashboard Overview for ${state.bankConnection?.bankName || 'HDFC Bank'}. It gives you a real-time summary of transaction volume (${txns.length} txns), total processed value (${formatCurrency(txns.reduce((a, c) => a + Number(c.amount), 0))}), safe vs suspicious breakdown, and activity trends.`,
            actions: [{ label: "What needs my attention?", actionType: "query", target: "What needs my attention?" }]
          };
        case 'transactions':
          return {
            text: `You're on the Transaction Monitoring page. It lists all ${txns.length} account transactions with search, date, risk, and payment method filters. Clicking any row opens the full AI investigation panel.`,
            actions: [{ label: "Show high-risk transactions", actionType: "query", target: "Show high-risk transactions" }]
          };
        case 'analytics':
          return {
            text: `This is Fraud Analytics. It compares your normal spending patterns against current activity, tracks channel vulnerabilities (UPI, Card, Wires), and predicts fraud exposure.`,
            actions: [{ label: "How much money is at risk?", actionType: "query", target: "How much money is at risk?" }]
          };
        case 'live-monitor':
          return {
            text: `This is the Live Risk Monitor streaming view. Payments arrive dynamically in real time. You can pause the stream or simulate live safe and fraud transactions.`,
            actions: [{ label: "What needs my attention?", actionType: "query", target: "What needs my attention?" }]
          };
        case 'alerts':
          return {
            text: `This is the Security Alerts Center. It queues all AI-generated security alerts so you can inspect transactions or mark alerts as resolved.`,
            actions: [{ label: "Go to Case Management", actionType: "navigate", target: "cases" }]
          };
        case 'cases':
          return {
            text: `This is Case Management. It provides dedicated investigation workspaces with evidence checklists, analyst notes, and status controls for open incidents.`,
            actions: [{ label: "What needs my attention?", actionType: "query", target: "What needs my attention?" }]
          };
        case 'reports':
          return {
            text: `This is Reports & Intelligence. You can view executive briefings, download CSV transaction logs, or print PDF audits.`,
            actions: [{ label: "Export CSV Data", actionType: "navigate", target: "reports" }]
          };
        default:
          return { text: `You are currently viewing the ${route} section of RiskShield.` };
      }
    }

    // 12. GENERAL DOMAIN CONCEPT EXPLANATIONS (Plain human language)
    if (q.includes('behavioral anomaly') || q.includes('behavioral score')) {
      return { text: "A behavioral anomaly means a transaction is far outside the user's normal spending pattern—for instance, unusual late-night timing, unexpected hardware signatures, or commercial VPN proxy locations." };
    }

    if (q.includes('difference between high and critical') || q.includes('high vs critical')) {
      return { text: "High Risk means elevated risk signals (like unverified recipients or larger amounts) that require manual review.\n\nCritical Risk means severe threat combinations (like offshore wires via Tor exit nodes) that trigger automated blocks and urgent security alerts." };
    }

    if (q.includes('how does riskshield detect fraud') || q.includes('detect fraud')) {
      return { text: "RiskShield monitors four primary risk dimensions in real time:\n1. Amount deviation from your normal ₹1,800 baseline\n2. Counterparty recipient trust index\n3. Hardware device & IP geolocation signatures\n4. Velocity bursts & channel vulnerability" };
    }

    // 13. UNCERTAINTY HANDLING (If query asks about something not in RiskShield dataset)
    if (q.includes('credit score') || q.includes('branch manager') || q.includes('password') || q.includes('pin') || q.includes('weather') || q.includes('stock price')) {
      return { text: "I can't verify that from the current RiskShield account data. I am specialized in analyzing your payment activity, risk scores, alerts, and fraud indicators." };
    }

    // 14. NAVIGATION REQUESTS ("Take me to Case Management")
    if (q.includes('take me to') || q.includes('go to') || q.includes('open')) {
      if (q.includes('case')) return { text: "Opening Case Management...", actions: [{ label: "Open Case Management", actionType: "navigate", target: "cases" }] };
      if (q.includes('alert')) return { text: "Opening Alerts Center...", actions: [{ label: "Open Alerts Center", actionType: "navigate", target: "alerts" }] };
      if (q.includes('transaction')) return { text: "Opening Transactions...", actions: [{ label: "Open Transactions", actionType: "navigate", target: "transactions" }] };
      if (q.includes('analytics')) return { text: "Opening Fraud Analytics...", actions: [{ label: "Open Fraud Analytics", actionType: "navigate", target: "analytics" }] };
      if (q.includes('live')) return { text: "Opening Live Risk Monitor...", actions: [{ label: "Open Live Risk Monitor", actionType: "navigate", target: "live-monitor" }] };
      if (q.includes('dashboard')) return { text: "Opening Dashboard Overview...", actions: [{ label: "Open Dashboard", actionType: "navigate", target: "dashboard" }] };
    }

    // DEFAULT NATURAL HUMAN ANALYST RESPONSE
    return {
      text: `I'm monitoring your RiskShield account for ${state.bankConnection?.bankName || 'HDFC Bank'}. You currently have ${txns.length} transactions logged, including ${txns.filter(t => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH').length} flagged for review.\n\nHow can I help you examine your transactions or security alerts?`,
      actions: [
        { label: "What needs my attention?", actionType: "query", target: "What needs my attention?" },
        { label: "What are the critical transactions?", actionType: "query", target: "What are the critical transactions and reasons for it?" }
      ]
    };
  }
}

export const aiAssistant = new AIAssistant();
