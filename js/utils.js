/**
 * RiskShield AI - Utility Helpers
 */

// Currency Formatter (Indian Rupee ₹)
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(amount);
}

// Date Formatter
export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Time Ago Formatter
export function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// HTML Escaper to prevent XSS
export function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Risk Level Badge Renderer
export function renderRiskBadge(riskLevel, riskScore) {
  const level = (riskLevel || 'LOW').toUpperCase();
  let badgeClass = 'badge-low';
  if (level === 'MEDIUM') badgeClass = 'badge-medium';
  if (level === 'HIGH') badgeClass = 'badge-high';
  if (level === 'CRITICAL') badgeClass = 'badge-critical';

  return `
    <span class="badge ${badgeClass}">
      <span class="badge-dot"></span>
      ${level} ${riskScore !== undefined ? `(${riskScore})` : ''}
    </span>
  `;
}

// Status Badge Renderer
export function renderStatusBadge(status) {
  const s = status || 'Completed';
  let badgeClass = 'badge-safe';
  if (s === 'Flagged' || s === 'Critical') badgeClass = 'badge-critical';
  if (s === 'Under Review' || s === 'Under Investigation' || s === 'Investigating') badgeClass = 'badge-warning';
  if (s === 'Open') badgeClass = 'badge-high';

  return `<span class="badge ${badgeClass}">${escapeHTML(s)}</span>`;
}

// Export Transactions / Reports to CSV
export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date ? cell.toISOString() : String(cell);
        cell = cell.replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
