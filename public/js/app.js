// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      const icon = this.querySelector('span');
      if (icon) {
        icon.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
      }
    });
  }

  // Initialize tickets from localStorage if not in session
  initializeTickets();
  
  // Setup modal handlers
  setupModalHandlers();
  
  // Setup toast auto-hide
  setupToast();
  
  // Setup form validation
  setupFormValidation();
});

/**
 * Initialize tickets management
 */
function initializeTickets() {
  // Load tickets from localStorage
  const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  
  // Display tickets if on tickets page
  const ticketsGrid = document.querySelector('.tickets-grid');
  if (ticketsGrid) {
    renderTickets(tickets);
  }
}

/**
 * Render tickets to the grid
 */
function renderTickets(tickets) {
  const ticketsGrid = document.querySelector('.tickets-grid');
  const emptyState = document.querySelector('.empty-state');
  
  if (!ticketsGrid) return;
  
  if (tickets.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    ticketsGrid.style.display = 'none';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    ticketsGrid.style.display = 'grid';
    
    ticketsGrid.innerHTML = tickets.map(ticket => `
      <div class="ticket-card" data-id="${ticket.id}">
        <div class="ticket-header">
          <h3>${escapeHtml(ticket.title)}</h3>
          <span class="status-badge status-${ticket.status.replace('_', '-')}">
            ${ticket.status.replace('_', ' ')}
          </span>
        </div>
        <p class="ticket-description">${escapeHtml(ticket.description) || 'No description'}</p>
        <div class="ticket-meta">
          <span class="priority">Priority: ${ticket.priority}</span>
          <span class="date">${formatDate(ticket.createdAt)}</span>
        </div>
        <div class="ticket-actions">
          <button class="btn-icon" onclick="editTicket(${ticket.id})" title="Edit" aria-label="Edit ticket">
            ✏️
          </button>
          <button class="btn-icon delete" onclick="deleteTicket(${ticket.id})" title="Delete" aria-label="Delete ticket">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
  }
}

/**
 * Setup modal handlers
 */
function setupModalHandlers() {
  const modalOverlay = document.querySelector('.modal-overlay');
  const closeModalBtn = document.querySelector('.modal .btn-icon');
  const cancelBtn = document.querySelector('.modal .btn-outline');
  const newTicketBtn = document.querySelector('[data-action="new-ticket"]');
  
  if (newTicketBtn) {
    newTicketBtn.addEventListener('click', () => openModal());
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => closeModal());
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => closeModal());
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
  
  // Setup form submission
  const ticketForm = document.getElementById('ticket-form');
if (ticketForm) {
ticketForm.addEventListener('submit', handleTicketSubmit);
}
}
/**

Open modal for creating/editing ticket
*/
function openModal(ticket = null) {
const modalOverlay = document.querySelector('.modal-overlay');
const modalTitle = document.querySelector('.modal-header h3');
const form = document.getElementById('ticket-form');

if (!modalOverlay || !form) return;
// Reset form
form.reset();
clearErrors();
if (ticket) {
// Edit mode
modalTitle.textContent = 'Edit Ticket';
form.dataset.ticketId = ticket.id;
form.title.value = ticket.title;
form.description.value = ticket.description || '';
form.status.value = ticket.status;
form.priority.value = ticket.priority;
} else {
// Create mode
modalTitle.textContent = 'Create New Ticket';
delete form.dataset.ticketId;
}
modalOverlay.classList.add('active');
}
/**

Close modal
*/
function closeModal() {
const modalOverlay = document.querySelector('.modal-overlay');
if (modalOverlay) {
modalOverlay.classList.remove('active');
}
clearErrors();
}

/**

Handle ticket form submission
*/
function handleTicketSubmit(e) {
e.preventDefault();

const form = e.target;
const formData = {
title: form.title.value.trim(),
description: form.description.value.trim(),
status: form.status.value,
priority: form.priority.value
};
// Validate
if (!validateTicketForm(formData)) {
return;
}
// Get existing tickets
const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
if (form.dataset.ticketId) {
// Update existing ticket
const ticketId = parseInt(form.dataset.ticketId);
const index = tickets.findIndex(t => t.id === ticketId);
if (index !== -1) {
tickets[index] = {
...tickets[index],
...formData
};
showToast('Ticket updated successfully!', 'success');
}
} else {
// Create new ticket
const newTicket = {
id: Date.now(),
...formData,
createdAt: new Date().toISOString()
};
tickets.push(newTicket);
showToast('Ticket created successfully!', 'success');
}
// Save to localStorage
localStorage.setItem('tickets', JSON.stringify(tickets));
// Re-render tickets
renderTickets(tickets);
// Close modal
closeModal();
}
/**

Validate ticket form
*/
function validateTicketForm(data) {
clearErrors();
let isValid = true;

// Title validation
if (!data.title) {
showError('title', 'Title is required');
isValid = false;
} else if (data.title.length < 3) {
showError('title', 'Title must be at least 3 characters');
isValid = false;
}
// Status validation
if (!['open', 'in_progress', 'closed'].includes(data.status)) {
showError('status', 'Status must be: open, in_progress, or closed');
isValid = false;
}
// Description validation
if (data.description && data.description.length > 500) {
showError('description', 'Description must be less than 500 characters');
isValid = false;
}
return isValid;
}
/**

Show form validation error
*/
function showError(fieldName, message) {
const field = document.getElementById(fieldName);
if (!field) return;

field.classList.add('error');
let errorEl = field.parentElement.querySelector('.error-message');
if (!errorEl) {
errorEl = document.createElement('span');
errorEl.className = 'error-message';
errorEl.setAttribute('role', 'alert');
field.parentElement.appendChild(errorEl);
}
errorEl.textContent = message;
}
/**

Clear all form errors
*/
function clearErrors() {
document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
document.querySelectorAll('.error-message').forEach(el => el.remove());
}

/**

Edit ticket
*/
function editTicket(ticketId) {
const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
const ticket = tickets.find(t => t.id === ticketId);
if (ticket) {
openModal(ticket);
}
}

/**

Delete ticket
*/
function deleteTicket(ticketId) {
if (!confirm('Are you sure you want to delete this ticket?')) {
return;
}

const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
const filtered = tickets.filter(t => t.id !== ticketId);
localStorage.setItem('tickets', JSON.stringify(filtered));
renderTickets(filtered);
showToast('Ticket deleted successfully!', 'success');
}
/**

Show toast notification
*/
function showToast(message, type = 'success') {
// Remove existing toast
const existingToast = document.querySelector('.toast');
if (existingToast) {
existingToast.remove();
}

// Create toast
const toast = document.createElement('div');
toast.className = `toast ${type}`;
toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span><span>${escapeHtml(message)}</span><button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close notification">✕</button>`;
document.body.appendChild(toast);

// Basic escapeHtml function (if you don't have one)
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// Show toast
setTimeout(() => toast.classList.add('show'), 10);
// Auto-hide after 3 seconds
setTimeout(() => {
toast.classList.remove('show');
setTimeout(() => toast.remove(), 300);
}, 3000);
}
/**

Setup toast auto-hide
*/
function setupToast() {
const toast = document.querySelector('.toast');
if (toast) {
toast.classList.add('show');
setTimeout(() => {
toast.classList.remove('show');
setTimeout(() => toast.remove(), 300);
}, 3000);
}
}

/**

Setup form validation
*/
function setupFormValidation() {
// Real-time validation for login/signup forms
const forms = document.querySelectorAll('form');
forms.forEach(form => {
const inputs = form.querySelectorAll('input, textarea, select');
inputs.forEach(input => {
input.addEventListener('blur', function() {
validateField(this);
});
input.addEventListener('input', function() {
if (this.classList.contains('error')) {
this.classList.remove('error');
const error = this.parentElement.querySelector('.error-message');
if (error) error.remove();
}
});
});
});
}

/**

Validate individual field
*/
function validateField(field) {
const value = field.value.trim();
const type = field.type;
const name = field.name;

let errorMessage = '';
// Required field check
if (field.hasAttribute('required') && !value) {
    errorMessage = `${field.labels[0]?.textContent || 'This field'} is required.`;
}
// Email validation
if (type === 'email' && value && !/\S+@\S+.\S+/.test(value)) {
errorMessage = 'Please enter a valid email address';
}
// Password validation
if (type === 'password' && value && value.length < 6) {
errorMessage = 'Password must be at least 6 characters';
}
if (errorMessage) {
showError(field.id || field.name, errorMessage);
}
}
/**

Escape HTML to prevent XSS
*/
function escapeHtml(text) {
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;
}

/**

Format date
*/
function formatDate(dateString) {
const date = new Date(dateString);
return date.toLocaleDateString('en-US', {
year: 'numeric',
month: 'short',
day: 'numeric'
});
}

/**

Get status class
*/
function getStatusClass(status) {
const classes = {
'open': 'status-open',
'in_progress': 'status-progress',
'closed': 'status-closed'
};
return classes[status] || '';
}