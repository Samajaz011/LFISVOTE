// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize page-specific functionality
    initializePageSpecific();
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Initialize scroll animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        });
    });
}

// Initialize page-specific functionality
function initializePageSpecific() {
    const currentPage = document.body.dataset.page;
    
    switch(currentPage) {
        case 'voting':
            initializeVotingPage();
            break;
        case 'admin':
            initializeAdminPage();
            break;
        default:
            initializeDefaultPage();
    }
}

// Voting page functionality
function initializeVotingPage() {
    const candidateCards = document.querySelectorAll('.candidate-card');
    const votingForm = document.getElementById('votingForm');
    
    if (candidateCards.length > 0) {
        candidateCards.forEach(card => {
            card.addEventListener('click', function() {
                selectCandidate(this);
            });
        });
    }
    
    if (votingForm) {
        votingForm.addEventListener('submit', function(event) {
            if (!validateVoteForm()) {
                event.preventDefault();
                showAlert('Please complete all required fields before submitting your vote.', 'warning');
            }
        });
    }
}

// Select candidate functionality
function selectCandidate(card) {
    const position = card.dataset.position;
    const candidateId = card.dataset.candidate;
    
    // Remove selection from other cards of the same position
    document.querySelectorAll(`.candidate-card[data-position="${position}"]`).forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
    
    // Update hidden input
    const hiddenInput = document.getElementById(`${position}_candidate`);
    if (hiddenInput) {
        hiddenInput.value = candidateId;
    }
    
    // Add visual feedback
    showSelectionFeedback(card);
    
    // Check if form is complete
    updateVoteFormStatus();
}

// Show selection feedback
function showSelectionFeedback(card) {
    const indicator = card.querySelector('.selection-indicator');
    if (indicator) {
        indicator.style.transform = 'scale(1.2)';
        setTimeout(() => {
            indicator.style.transform = 'scale(1)';
        }, 200);
    }
}

// Update vote form status
function updateVoteFormStatus() {
    const studentId = document.getElementById('student_id');
    const headBoySelected = document.getElementById('head_boy_candidate');
    const headGirlSelected = document.getElementById('head_girl_candidate');
    const submitBtn = document.getElementById('submitVote');
    
    if (studentId && headBoySelected && headGirlSelected && submitBtn) {
        const isComplete = studentId.value && headBoySelected.value && headGirlSelected.value;
        
        submitBtn.disabled = !isComplete;
        
        if (isComplete) {
            submitBtn.classList.remove('btn-secondary');
            submitBtn.classList.add('btn-success');
            submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Submit My Vote';
        } else {
            submitBtn.classList.remove('btn-success');
            submitBtn.classList.add('btn-primary');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit My Vote';
        }
    }
}

// Validate vote form
function validateVoteForm() {
    const studentId = document.getElementById('student_id');
    const headBoySelected = document.getElementById('head_boy_candidate');
    const headGirlSelected = document.getElementById('head_girl_candidate');
    
    if (!studentId || !studentId.value.trim()) {
        showAlert('Please enter your Student ID.', 'warning');
        return false;
    }
    
    if (!headBoySelected || !headBoySelected.value) {
        showAlert('Please select a Head Boy candidate.', 'warning');
        return false;
    }
    
    if (!headGirlSelected || !headGirlSelected.value) {
        showAlert('Please select a Head Girl candidate.', 'warning');
        return false;
    }
    
    return true;
}

// Admin page functionality
function initializeAdminPage() {
    initializeDataTables();
    initializeCharts();
    initializeAdminActions();
}

// Initialize data tables
function initializeDataTables() {
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        // Add search functionality
        addTableSearch(table);
        
        // Add sorting functionality
        addTableSort(table);
    });
}

// Add table search functionality
function addTableSearch(table) {
    const searchInput = table.parentElement.querySelector('.table-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

// Add table sorting functionality
function addTableSort(table) {
    const headers = table.querySelectorAll('th[data-sort]');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.dataset.sort;
            const direction = this.classList.contains('sort-asc') ? 'desc' : 'asc';
            
            sortTable(table, column, direction);
            
            // Update sort indicators
            headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
            this.classList.add(`sort-${direction}`);
        });
    });
}

// Sort table functionality
function sortTable(table, column, direction) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aVal = a.cells[column].textContent.trim();
        const bVal = b.cells[column].textContent.trim();
        
        if (direction === 'asc') {
            return aVal.localeCompare(bVal);
        } else {
            return bVal.localeCompare(aVal);
        }
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// Initialize charts
function initializeCharts() {
    const chartContainers = document.querySelectorAll('.chart-container');
    
    chartContainers.forEach(container => {
        const chartType = container.dataset.chart;
        const chartData = JSON.parse(container.dataset.data || '{}');
        
        if (chartType === 'results') {
            createResultsChart(container, chartData);
        }
    });
}

// Create results chart
function createResultsChart(container, data) {
    // This would integrate with Chart.js if needed
    console.log('Chart data:', data);
}

// Initialize admin actions
function initializeAdminActions() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const resetButton = document.getElementById('resetVotesBtn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const itemName = this.dataset.name;
            const itemId = this.dataset.id;
            
            if (confirm(`Are you sure you want to delete ${itemName}?`)) {
                // Perform delete action
                deleteItem(itemId, this.dataset.type);
            }
        });
    });
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all votes? This action cannot be undone.')) {
                // Perform reset action
                resetVotes();
            }
        });
    }
}

// Edit candidate functionality
function editCandidate(candidateId) {
    // Fetch candidate data from the API
    fetch(`/admin/get_candidate/${candidateId}`)
        .then(response => response.json())
        .then(data => {
            // Populate the modal fields
            document.getElementById('edit_candidate_id').value = data.id;
            document.getElementById('edit_name').value = data.name;
            document.getElementById('edit_class_name').value = data.class_name;
            document.getElementById('edit_position').value = data.position;
            document.getElementById('edit_photo_url').value = data.photo_url;
            document.getElementById('edit_description').value = data.description;
            document.getElementById('edit_achievements').value = data.achievements;
            document.getElementById('edit_is_active').value = data.is_active ? '1' : '0';
        })
        .catch(error => {
            console.error('Error fetching candidate data:', error);
            showAlert('Error loading candidate data', 'error');
        });
}

// Delete item functionality
function deleteItem(itemId, itemType) {
    showAlert(`${itemType} deleted successfully.`, 'success');
    // This would make an actual API call in a real implementation
}

// Reset votes functionality
function resetVotes() {
    showAlert('All votes have been reset successfully.', 'success');
    // This would make an actual API call in a real implementation
}

// Default page functionality
function initializeDefaultPage() {
    // Initialize common functionality for all pages
    initializeNavigation();
    initializeScrollEffects();
}

// Initialize navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (this.getAttribute('href').startsWith('#')) {
                event.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Utility functions
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertContainer, container.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertContainer.remove();
        }, 5000);
    }
}

function showLoading(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    element.disabled = true;
    
    return function hideLoading() {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Event listeners for dynamic content
document.addEventListener('click', function(event) {
    // Handle dynamic button clicks
    if (event.target.matches('.btn-confirm')) {
        const message = event.target.dataset.confirm;
        if (!confirm(message)) {
            event.preventDefault();
        }
    }
    
    // Handle modal triggers
    if (event.target.matches('[data-bs-toggle="modal"]')) {
        const modalId = event.target.getAttribute('data-bs-target');
        const modal = document.querySelector(modalId);
        
        if (modal) {
            // Pre-populate modal if needed
            const data = event.target.dataset;
            populateModal(modal, data);
        }
    }
});

// Populate modal with data
function populateModal(modal, data) {
    Object.keys(data).forEach(key => {
        const input = modal.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = data[key];
        }
    });
}

// Handle form submissions
document.addEventListener('submit', function(event) {
    const form = event.target;
    
    if (form.classList.contains('ajax-form')) {
        event.preventDefault();
        handleAjaxForm(form);
    }
});

// Handle AJAX form submissions
function handleAjaxForm(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = showLoading(submitButton);
    
    fetch(form.action, {
        method: form.method,
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            showAlert(data.message, 'success');
            form.reset();
            
            // Close modal if in modal
            const modal = form.closest('.modal');
            if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                }
            }
        } else {
            showAlert(data.message || 'An error occurred', 'danger');
        }
    })
    .catch(error => {
        hideLoading();
        showAlert('An error occurred. Please try again.', 'danger');
        console.error('Error:', error);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Admin shortcuts
    if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('.table-search');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Voting shortcuts
    if (event.key === 'Enter' && event.target.matches('.candidate-card')) {
        selectCandidate(event.target);
    }
});

// Page visibility handling
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
    }
});

// Online/offline handling
window.addEventListener('online', function() {
    showAlert('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showAlert('Connection lost. Please check your internet connection.', 'warning');
});

// Photo upload preview functionality
function previewPhoto(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = preview.querySelector('img');
            const placeholder = preview.querySelector('.upload-placeholder');
            
            img.src = e.target.result;
            img.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Social media sharing functions
function shareResults(platform) {
    const url = window.location.origin + '/admin/results';
    const text = 'Check out the latest election results from Little Flower International School!';
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyResultsLink() {
    const url = window.location.origin + '/admin/results';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showAlert('Results link copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showAlert('Results link copied to clipboard!', 'success');
    } catch (err) {
        showAlert('Unable to copy link. Please copy manually: ' + text, 'warning');
    }
    
    document.body.removeChild(textArea);
}

// Live voting data refresh
function refreshVotingData() {
    const button = document.querySelector('button[onclick="refreshVotingData()"]');
    const originalContent = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Refreshing...';
    button.disabled = true;
    
    // Update timestamp
    document.getElementById('lastUpdateTime').textContent = new Date().toLocaleString();
    
    // Simulate data refresh (in real implementation, this would fetch from server)
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;
        showAlert('Voting data refreshed successfully!', 'success');
        
        // Refresh chart if it exists
        if (window.liveVotingChart) {
            updateLiveChart();
        }
    }, 1500);
}

// Initialize live voting chart
function initializeLiveVotingChart() {
    const canvas = document.getElementById('liveVotingChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Create a simple chart using canvas
    const data = {
        labels: ['Head Boy Votes', 'Head Girl Votes', 'Remaining Students'],
        values: [15, 18, 67], // Example data
        colors: ['#2563EB', '#059669', '#E5E7EB']
    };
    
    drawPieChart(ctx, data, canvas.width, canvas.height);
    
    // Store chart reference for updates
    window.liveVotingChart = { ctx, data, canvas };
}

function drawPieChart(ctx, data, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    const total = data.values.reduce((sum, value) => sum + value, 0);
    let currentAngle = -Math.PI / 2; // Start from top
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw pie slices
    data.values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = data.colors[index];
        ctx.fill();
        
        // Add text labels
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value, labelX, labelY);
        
        currentAngle += sliceAngle;
    });
    
    // Add legend
    data.labels.forEach((label, index) => {
        const legendY = 20 + index * 25;
        
        // Color box
        ctx.fillStyle = data.colors[index];
        ctx.fillRect(10, legendY - 8, 15, 15);
        
        // Label text
        ctx.fillStyle = '#333333';
        ctx.font = '12px Inter';
        ctx.textAlign = 'left';
        ctx.fillText(label, 30, legendY + 3);
    });
}

function updateLiveChart() {
    if (!window.liveVotingChart) return;
    
    const { ctx, data, canvas } = window.liveVotingChart;
    
    // Update with new data (in real implementation, fetch from server)
    data.values = [Math.floor(Math.random() * 30), Math.floor(Math.random() * 30), Math.floor(Math.random() * 50)];
    
    drawPieChart(ctx, data, canvas.width, canvas.height);
}

// Initialize chart when admin page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('liveVotingChart')) {
        initializeLiveVotingChart();
    }
});

// Export functions for external use
window.VotingApp = {
    showAlert,
    showLoading,
    formatDate,
    formatTime,
    selectCandidate,
    validateVoteForm,
    previewPhoto,
    shareResults,
    copyResultsLink,
    refreshVotingData
};
