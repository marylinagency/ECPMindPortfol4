// BookGenPro JavaScript functionality

// Animated background nodes
function createAnimatedBackground() {
    const container = document.querySelector('.animated-bg');
    if (!container) return;
    
    // Create nodes
    for (let i = 0; i < 50; i++) {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.left = Math.random() * 100 + '%';
        node.style.animationDelay = Math.random() * 20 + 's';
        node.style.animationDuration = (Math.random() * 10 + 15) + 's';
        container.appendChild(node);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    createAnimatedBackground();
    initializeChapterGeneration();
    initializeFormValidation();
    initializeTooltips();
});

// Chapter generation status checking
function initializeChapterGeneration() {
    const projectId = document.querySelector('[data-project-id]');
    if (!projectId) return;
    
    const id = projectId.getAttribute('data-project-id');
    checkGenerationStatus(id);
}

function checkGenerationStatus(projectId) {
    fetch(`/check_generation_status/${projectId}`)
        .then(response => response.json())
        .then(data => {
            updateGenerationUI(data);
            
            // Continue checking if still generating
            if (data.status === 'generating_titles' || data.status === 'generating_content') {
                setTimeout(() => checkGenerationStatus(projectId), 2000);
            }
        })
        .catch(error => {
            console.error('Error checking generation status:', error);
        });
}

function updateGenerationUI(data) {
    const statusElement = document.getElementById('generation-status');
    const progressElement = document.getElementById('generation-progress');
    const chaptersContainer = document.getElementById('chapters-container');
    
    if (statusElement) {
        let statusText = '';
        let statusClass = '';
        
        switch (data.status) {
            case 'pending':
                statusText = 'Ready to generate';
                statusClass = 'status-pending';
                break;
            case 'generating_titles':
                statusText = 'Generating chapter titles...';
                statusClass = 'status-generating';
                break;
            case 'generating_content':
                statusText = `Generating content (${data.completed_chapters}/${data.chapters} chapters)`;
                statusClass = 'status-generating';
                break;
            case 'completed':
                statusText = 'Generation completed';
                statusClass = 'status-completed';
                break;
            default:
                if (data.status.startsWith('error:')) {
                    statusText = 'Generation failed';
                    statusClass = 'status-error';
                }
        }
        
        statusElement.textContent = statusText;
        statusElement.className = `status-badge ${statusClass}`;
    }
    
    if (progressElement && data.chapters > 0) {
        const progress = (data.completed_chapters / data.chapters) * 100;
        progressElement.style.width = progress + '%';
    }
    
    // Refresh page if generation is completed
    if (data.status === 'completed') {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    showFieldError(field, 'This field is required');
                } else {
                    field.classList.remove('border-red-500');
                    hideFieldError(field);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields', 'error');
            }
        });
    });
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.className = 'field-error text-red-500 text-sm mt-1';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white opacity-70 hover:opacity-100">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip fixed z-50 bg-gray-900 text-white px-2 py-1 rounded text-sm pointer-events-none';
    tooltip.textContent = text;
    tooltip.id = 'active-tooltip';
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('active-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Chapter editing
function editChapter(chapterId) {
    const chapterCard = document.querySelector(`[data-chapter-id="${chapterId}"]`);
    if (!chapterCard) return;
    
    const title = chapterCard.querySelector('.chapter-title').textContent;
    const content = chapterCard.querySelector('.chapter-content').textContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-full overflow-y-auto">
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Edit Chapter</h3>
                <form method="POST" action="/edit_chapter/${document.querySelector('[data-project-id]').getAttribute('data-project-id')}/${chapterId}">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Chapter Title</label>
                        <input type="text" name="title" value="${title}" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2">Chapter Content</label>
                        <textarea name="content" rows="15" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required>${content}</textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// File upload preview
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    const preview = document.getElementById('cover-preview');
    if (!preview) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Cover preview" class="w-full h-full object-cover rounded-lg">`;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Loading states
function setLoading(element, isLoading) {
    if (isLoading) {
        element.disabled = true;
        element.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
        `;
    } else {
        element.disabled = false;
    }
}

// Auto-save functionality
let autoSaveTimeout;

function enableAutoSave(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                saveFormData(form);
            }, 2000);
        });
    });
}

function saveFormData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Save to localStorage
    localStorage.setItem(`autosave_${form.id}`, JSON.stringify(data));
    
    // Show save indicator
    showNotification('Changes saved automatically', 'info');
}

function loadFormData(form) {
    const saved = localStorage.getItem(`autosave_${form.id}`);
    if (!saved) return;
    
    try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    } catch (e) {
        console.error('Error loading saved form data:', e);
    }
}
