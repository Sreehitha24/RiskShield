/**
 * RiskShield AI - Fraud Analytics View
 */

import { stateStore } from '../state.js';
import { formatCurrency, renderRiskBadge } from '../utils.js';

export function renderAnalyticsView() {
  const container = document.getElementById('main-content-viewport');
  const state = stateStore.getState();
  const transactions = state.transactions || [];

  // Compute Analytics Metrics
  const criticals = transactions.filter(t => t.riskLevel === 'CRITICAL');
  const highs = transactions.filter(t => t.riskLevel === 'HIGH');
  const totalAmount = transactions.reduce((a, c) => a + Number(c.amount), 0);
  const avgAmount = Math.round(totalAmount / (transactions.length || 1));

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Fraud Analytics & Intelligence</h1>
        <p>Behavioral pattern recognition, channel vulnerability breakdown, and AI risk prediction models.</p>
      </div>
    </div>

    <!-- A. AI RISK PREDICTION PANEL -->
    <div class="panel" style="background: linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(15, 23, 42, 0.95)); border-color: var(--border-accent);">
      <div class="panel-header">
        <span class="panel-title" style="color: var(--accent-cyan);">
          ✨ AI Payment Risk Prediction & Predictive Intelligence
        </span>
        <span class="badge badge-purple">Model Confidence: 94.8%</span>
      </div>
      <div class="panel-body" style="padding: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
        <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">PREDICTED FRAUD EXPOSURE</div>
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: var(--color-critical); margin-top: 4px;">
            ${formatCurrency(criticals.reduce((a, c) => a + Number(c.amount), 0))}
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Across ${criticals.length} high-threat events</div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">BEHAVIORAL DEVIATION INDEX</div>
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: var(--color-medium); margin-top: 4px;">
            +38.5%
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Elevated off-hour velocity</div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">RECIPIENT TRUST BASELINE</div>
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: var(--color-safe); margin-top: 4px;">
            84.2 / 100
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Counterparty confidence index</div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">AMOUNT ANOMALY INDEX</div>
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: var(--accent-cyan); margin-top: 4px;">
            42.0%
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Deviation from ₹1,800 norm</div>
        </div>
      </div>
    </div>

    <!-- B. SPENDING BASELINE & C. FRAUD TREND ANALYTICS -->
    <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; margin-bottom: 24px;">
      
      <!-- B. SPENDING PATTERN BASELINE -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">User Spending Pattern Baseline</span>
        </div>
        <div class="panel-body" style="padding: 16px;">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span>Daily Baseline (Standard: ₹5,000)</span>
                <span style="font-weight: 600; color: var(--color-critical);">₹${(avgAmount * 4).toLocaleString('en-IN')} (+180%)</span>
              </div>
              <div style="width: 100%; height: 8px; background: rgba(31, 41, 55, 0.8); border-radius: 4px; overflow: hidden;">
                <div style="width: 75%; height: 100%; background: var(--color-critical);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span>P2P Transfer Frequency (Norm: 3/day)</span>
                <span style="font-weight: 600; color: var(--color-medium);">6/day (+100%)</span>
              </div>
              <div style="width: 100%; height: 8px; background: rgba(31, 41, 55, 0.8); border-radius: 4px; overflow: hidden;">
                <div style="width: 60%; height: 100%; background: var(--color-medium);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span>Cross-Border Velocity (Norm: 0)</span>
                <span style="font-weight: 600; color: var(--color-critical);">2 Outbound Attempts</span>
              </div>
              <div style="width: 100%; height: 8px; background: rgba(31, 41, 55, 0.8); border-radius: 4px; overflow: hidden;">
                <div style="width: 90%; height: 100%; background: var(--color-critical);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- C. FRAUD TREND ANALYTICS GRAPH -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">Fraud Incidents vs Safe Transaction Baseline</span>
        </div>
        <div class="panel-body" style="padding: 16px;">
          <div class="chart-container" style="height: 180px;">
            <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none">
              <!-- Safe Baseline Line (Green) -->
              <polyline points="0,120 100,100 200,110 300,90 400,105 500,80" fill="none" stroke="#10b981" stroke-width="2.5"/>
              <!-- Fraud Spikes Line (Red) -->
              <polyline points="0,165 100,170 200,80 300,150 400,40 500,130" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,3"/>
            </svg>
          </div>
          <div style="display: flex; justify-content: center; gap: 20px; font-size: 12px; margin-top: 10px;">
            <span style="color: var(--color-safe);">— Safe Baseline (Normal)</span>
            <span style="color: var(--color-critical);">-- Fraud Spikes (Detected)</span>
          </div>
        </div>
      </div>

    </div>

    <!-- D. RISK INTELLIGENCE INSIGHTS CARDS -->
    <div style="margin-bottom: 24px;">
      <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px;">
        Risk Intelligence Threat Signals
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;">
        
        <div class="panel" style="padding: 16px; margin: 0; border-left: 3px solid var(--color-critical);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #fff; font-size: 13px;">Velocity Burst Flag</strong>
            <span class="badge badge-critical">CRITICAL</span>
          </div>
          <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
            Multiple high-value outbound payments attempted within a 15-minute time window.
          </p>
        </div>

        <div class="panel" style="padding: 16px; margin: 0; border-left: 3px solid var(--color-high);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #fff; font-size: 13px;">Recipient Anomaly</strong>
            <span class="badge badge-high">HIGH</span>
          </div>
          <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
            Counterparty Virtual Payment Address created < 48 hours ago with zero prior transaction history.
          </p>
        </div>

        <div class="panel" style="padding: 16px; margin: 0; border-left: 3px solid var(--color-medium);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #fff; font-size: 13px;">Time Window Shift</strong>
            <span class="badge badge-warning">MEDIUM</span>
          </div>
          <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
            Transactions executed between 11:00 PM and 04:00 AM outside normal user activity hours.
          </p>
        </div>

        <div class="panel" style="padding: 16px; margin: 0; border-left: 3px solid var(--accent-cyan);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #fff; font-size: 13px;">Merchant Stability</strong>
            <span class="badge badge-purple">INFO</span>
          </div>
          <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
            E-commerce merchant channels (Amazon, Swiggy) maintain 99.2% verified trust rating.
          </p>
        </div>

      </div>
    </div>

    <!-- F. CHANNEL RISK DISTRIBUTION -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Payment Channel Vulnerability & Distribution</span>
      </div>
      <div class="panel-body" style="padding: 20px;">
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; text-align: center;">
          <div style="background: rgba(15, 23, 42, 0.5); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 12px; font-weight: 600; color: #fff;">UPI Transfers</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--color-safe); margin: 6px 0;">Low Risk</div>
            <div style="font-size: 11px; color: var(--text-muted);">94% Safe Baseline</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 12px; font-weight: 600; color: #fff;">Bank Transfer</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--color-medium); margin: 6px 0;">Med Risk</div>
            <div style="font-size: 11px; color: var(--text-muted);">Offshore High Value</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 12px; font-weight: 600; color: #fff;">Credit Cards</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--color-safe); margin: 6px 0;">Low Risk</div>
            <div style="font-size: 11px; color: var(--text-muted);">3DS OTP Secured</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 12px; font-weight: 600; color: #fff;">Digital Wallet</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--color-safe); margin: 6px 0;">Low Risk</div>
            <div style="font-size: 11px; color: var(--text-muted);">Micropayments</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-critical-border); background: var(--color-critical-bg);">
            <div style="font-size: 12px; font-weight: 600; color: #fff;">International Wire</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--color-critical); margin: 6px 0;">Critical</div>
            <div style="font-size: 11px; color: var(--text-muted);">High FX Exposure</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
