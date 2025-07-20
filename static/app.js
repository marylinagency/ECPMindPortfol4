// BookGenPro JavaScript functionality

// Dynamic animated background nodes with real-time interaction
function createAnimatedBackground() {
    const container = document.querySelector('.animated-bg');
    if (!container) return;
    
    // Create dynamic nodes that respond to user interaction
    for (let i = 0; i < 60; i++) {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.left = Math.random() * 100 + '%';
        node.style.animationDelay = Math.random() * 20 + 's';
        node.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        // Add dynamic size variation
        const size = Math.random() * 6 + 2;
        node.style.width = size + 'px';
        node.style.height = size + 'px';
        
        // Add mouse interaction
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(2)';
            this.style.opacity = '0.8';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.opacity = '0.3';
        });
        
        container.appendChild(node);
    }
    
    // Add mouse movement effect
    document.addEventListener('mousemove', function(e) {
        const nodes = document.querySelectorAll('.node');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        nodes.forEach((node, index) => {
            const speed = (index % 3 + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            if (index % 4 === 0) {
                node.style.transform += ` translate(${x * 20}px, ${y * 20}px)`;
            }
        });
    });
}

// Initialize on page load with dynamic features
document.addEventListener('DOMContentLoaded', function() {
    createAnimatedBackground();
    initializeChapterGeneration();
    initializeFormValidation();
    initializeTooltips();
    initializeDynamicFeatures();
    initializeRealTimeUpdates();
    initializeInteractiveElements();
});

// Sparkle effect for hover interactions
function createSparkles(element) {
    const sparkleCount = 15;
    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping pointer-events-none';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 0.5 + 's';
            sparkle.style.zIndex = '10';
            
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        }, i * 50);
    }
}

function removeSparkles(element) {
    const sparkles = element.querySelectorAll('.animate-ping');
    sparkles.forEach(sparkle => sparkle.remove());
}

// Template filling functions
function fillTemplate(type) {
    const templates = {
        business: {
            topic: "A comprehensive guide to starting and scaling a successful online business. Cover market research, business planning, digital marketing strategies, customer acquisition, financial management, and scaling operations for modern entrepreneurs.",
            chapters: 12,
            style: "professional"
        },
        tech: {
            topic: "A practical guide to modern web development, covering HTML5, CSS3, JavaScript ES6+, React framework, API integration, database design, deployment strategies, and best practices for building scalable web applications.",
            chapters: 15,
            style: "technical"
        },
        fiction: {
            topic: "An epic fantasy adventure following a young hero's journey through mystical lands, ancient prophecies, magical creatures, political intrigue, personal growth, friendship, betrayal, and the ultimate battle between good and evil.",
            chapters: 20,
            style: "creative"
        },
        educational: {
            topic: "An interactive learning guide for mathematics fundamentals, covering algebra, geometry, statistics, problem-solving techniques, real-world applications, study strategies, and practical exercises for students and lifelong learners.",
            chapters: 10,
            style: "academic"
        }
    };
    
    const template = templates[type];
    if (template) {
        document.getElementById('gen_topic').value = template.topic;
        document.getElementById('gen_chapters').value = template.chapters;
        document.getElementById('gen_style').value = template.style;
        
        // Add visual feedback
        const textarea = document.getElementById('gen_topic');
        textarea.style.transform = 'scale(1.02)';
        textarea.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.3)';
        setTimeout(() => {
            textarea.style.transform = 'scale(1)';
            textarea.style.boxShadow = '';
        }, 300);
    }
}

// Show manual project form
function showManualForm() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-900">Create Manual Project</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i data-feather="x" class="w-6 h-6"></i>
                </button>
            </div>
            
            <form method="POST" action="/create_project" enctype="multipart/form-data" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input type="text" name="project_name" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           placeholder="Enter project name">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Book Topic/Theme</label>
                    <textarea name="book_topic" rows="4" required
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              placeholder="Describe your book topic, genre, and main themes..."></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select name="language" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Italian">Italian</option>
                            <option value="Portuguese">Portuguese</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Number of Chapters</label>
                        <input type="number" name="num_chapters" value="10" min="3" max="50"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>
                    <input type="file" name="cover_image" accept="image/*"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="flex space-x-4">
                    <button type="button" onclick="closeModal()" 
                            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    feather.replace(); // Re-initialize feather icons
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

// Dynamic features initialization
function initializeDynamicFeatures() {
    // Dynamic typing effects
    initializeTypingEffects();
    
    // Real-time form validation
    initializeRealTimeValidation();
    
    // Dynamic content loading
    initializeLazyLoading();
    
    // Interactive animations
    initializeScrollAnimations();
}

// Real-time updates system
function initializeRealTimeUpdates() {
    // Auto-refresh project status
    if (document.querySelector('[data-project-id]')) {
        setInterval(updateProjectStatus, 3000);
    }
    
    // Real-time license status check
    if (document.querySelector('#license_key')) {
        initializeLicenseValidation();
    }
    
    // Dynamic model availability check
    if (document.querySelector('#model')) {
        checkModelAvailability();
    }
}

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

// Dynamic typing effects
function initializeTypingEffects() {
    const typingElements = document.querySelectorAll('[data-typing]');
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        typeWriter(element, text, 0);
    });
}

function typeWriter(element, text, i) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        setTimeout(() => typeWriter(element, text, i + 1), 50);
    }
}

// Real-time form validation
function initializeRealTimeValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateFieldRealTime(this);
        });
        
        input.addEventListener('blur', function() {
            validateFieldRealTime(this);
        });
    });
}

function validateFieldRealTime(field) {
    const value = field.value.trim();
    const isValid = field.checkValidity();
    
    // Remove existing validation classes
    field.classList.remove('border-green-500', 'border-red-500');
    
    // Add dynamic validation styling
    if (value && isValid) {
        field.classList.add('border-green-500');
        addValidationIcon(field, 'check', 'text-green-500');
    } else if (value && !isValid) {
        field.classList.add('border-red-500');
        addValidationIcon(field, 'x', 'text-red-500');
    } else {
        removeValidationIcon(field);
    }
}

function addValidationIcon(field, icon, colorClass) {
    removeValidationIcon(field);
    const iconElement = document.createElement('i');
    iconElement.setAttribute('data-feather', icon);
    iconElement.className = `validation-icon absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colorClass}`;
    
    if (field.parentElement.style.position !== 'relative') {
        field.parentElement.style.position = 'relative';
    }
    
    field.parentElement.appendChild(iconElement);
    feather.replace();
}

function removeValidationIcon(field) {
    const existingIcon = field.parentElement.querySelector('.validation-icon');
    if (existingIcon) {
        existingIcon.remove();
    }
}

// Interactive elements
function initializeInteractiveElements() {
    // Hover effects for cards
    const cards = document.querySelectorAll('.page-turn, .chapter-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Dynamic button interactions
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            createRippleEffect(this);
        });
    });
}

// Ripple effect for buttons
function createRippleEffect(button) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Scroll animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0)';
            }
        });
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Project status updates
function updateProjectStatus() {
    const projectId = document.querySelector('[data-project-id]')?.getAttribute('data-project-id');
    if (!projectId) return;
    
    fetch(`/check_generation_status/${projectId}`)
        .then(response => response.json())
        .then(data => {
            updateGenerationUI(data);
            updateProgressBars(data);
            
            if (data.status === 'completed') {
                showCompletionEffect();
            }
        })
        .catch(error => console.log('Status check error:', error));
}

function updateProgressBars(data) {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = (data.completed_chapters / data.chapters) * 100;
        bar.style.width = progress + '%';
        
        // Add dynamic color based on progress
        if (progress < 30) {
            bar.style.background = 'linear-gradient(to right, #ef4444, #f97316)';
        } else if (progress < 70) {
            bar.style.background = 'linear-gradient(to right, #f97316, #eab308)';
        } else {
            bar.style.background = 'linear-gradient(to right, #22c55e, #16a34a)';
        }
    });
}

function showCompletionEffect() {
    // Create celebration effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 100);
    }
    
    showNotification('🎉 Book generation completed successfully!', 'success');
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 5)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    
    document.body.appendChild(confetti);
    
    let pos = 0;
    const fall = setInterval(() => {
        pos += 5;
        confetti.style.top = pos + 'px';
        confetti.style.transform = `rotate(${pos}deg)`;
        
        if (pos > window.innerHeight) {
            clearInterval(fall);
            confetti.remove();
        }
    }, 20);
}

// License validation
function initializeLicenseValidation() {
    const licenseInput = document.querySelector('#license_key');
    const emailInput = document.querySelector('#email');
    
    if (licenseInput && emailInput) {
        licenseInput.addEventListener('input', debounce(validateLicense, 1000));
        emailInput.addEventListener('input', debounce(validateLicense, 1000));
    }
}

function validateLicense() {
    const licenseKey = document.querySelector('#license_key')?.value;
    const email = document.querySelector('#email')?.value;
    
    if (licenseKey && email && licenseKey.length > 10 && email.includes('@')) {
        showLicenseStatus('Validating license...', 'info');
        // Add visual feedback for validation in progress
    }
}

function showLicenseStatus(message, type) {
    const statusDiv = document.querySelector('#license-status') || createLicenseStatusDiv();
    statusDiv.textContent = message;
    statusDiv.className = `text-sm mt-2 text-${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'}-600`;
}

function createLicenseStatusDiv() {
    const div = document.createElement('div');
    div.id = 'license-status';
    document.querySelector('#email').parentElement.appendChild(div);
    return div;
}

// Model availability check
function checkModelAvailability() {
    const modelSelect = document.querySelector('#model');
    if (!modelSelect) return;
    
    // Add loading indicator to model dropdown
    const loadingOption = document.createElement('option');
    loadingOption.textContent = 'Checking model availability...';
    loadingOption.disabled = true;
    modelSelect.insertBefore(loadingOption, modelSelect.firstChild);
    
    // Simulate API check (replace with actual API call)
    setTimeout(() => {
        loadingOption.remove();
        addModelStatusIndicators();
    }, 2000);
}

function addModelStatusIndicators() {
    const options = document.querySelectorAll('#model option');
    options.forEach(option => {
        if (option.value.includes(':free')) {
            option.textContent += ' ✅';
        } else if (option.value.includes('gpt-4')) {
            option.textContent += ' 🔥';
        }
    });
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for dynamic content
function initializeLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadDynamicContent(entry.target);
                lazyObserver.unobserve(entry.target);
            }
        });
    });
    
    lazyElements.forEach(el => lazyObserver.observe(el));
}

function loadDynamicContent(element) {
    const contentType = element.getAttribute('data-lazy');
    
    switch (contentType) {
        case 'recent-projects':
            loadRecentProjects(element);
            break;
        case 'model-stats':
            loadModelStatistics(element);
            break;
    }
}

function loadRecentProjects(element) {
    // Add skeleton loading
    element.innerHTML = '<div class="animate-pulse bg-gray-200 h-32 rounded-lg"></div>';
    
    // Simulate loading (replace with actual fetch)
    setTimeout(() => {
        element.innerHTML = '<p class="text-gray-600">Recent projects loaded dynamically!</p>';
    }, 1000);
}

// Enhanced auto-save functionality
let autoSaveTimeout;

function enableAutoSave(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            showSaveIndicator('saving');
            
            autoSaveTimeout = setTimeout(() => {
                saveFormData(form);
            }, 2000);
        });
    });
}

function saveFormData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Save to localStorage with timestamp
    const saveData = {
        data: data,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`autosave_${form.id}`, JSON.stringify(saveData));
    showSaveIndicator('saved');
}

function showSaveIndicator(status) {
    const indicator = document.querySelector('.save-indicator') || createSaveIndicator();
    
    if (status === 'saving') {
        indicator.innerHTML = '<i data-feather="loader" class="w-4 h-4 animate-spin"></i> Saving...';
        indicator.className = 'save-indicator fixed top-4 left-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm z-50';
    } else if (status === 'saved') {
        indicator.innerHTML = '<i data-feather="check" class="w-4 h-4"></i> Saved';
        indicator.className = 'save-indicator fixed top-4 left-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm z-50';
        
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }, 2000);
    }
    
    feather.replace();
}

function createSaveIndicator() {
    const indicator = document.createElement('div');
    document.body.appendChild(indicator);
    return indicator;
}

// Quick actions for floating button
function showQuickActions() {
    const actions = [
        { icon: 'plus', text: 'New Project', action: () => scrollToNewProject() },
        { icon: 'folder', text: 'My Projects', action: () => scrollToProjects() },
        { icon: 'settings', text: 'Settings', action: () => window.location.href = '/settings' },
        { icon: 'help-circle', text: 'Help', action: () => showHelp() }
    ];
    
    showActionMenu(actions);
}

function showActionMenu(actions) {
    // Remove existing menu
    const existingMenu = document.querySelector('.action-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'action-menu fixed bottom-20 right-4 bg-white rounded-lg shadow-lg border py-2 z-50';
    
    actions.forEach(action => {
        const item = document.createElement('button');
        item.className = 'w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3';
        item.innerHTML = `<i data-feather="${action.icon}" class="w-4 h-4"></i><span>${action.text}</span>`;
        item.onclick = () => {
            action.action();
            menu.remove();
        };
        menu.appendChild(item);
    });
    
    document.body.appendChild(menu);
    feather.replace();
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.closest('.fab')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function scrollToNewProject() {
    document.querySelector('#new-project-form')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToProjects() {
    const projectsSection = document.querySelector('[data-lazy="recent-projects"]') || 
                           document.querySelector('h2:contains("Recent Projects")');
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showHelp() {
    showModal('Help & Tips', `
        <div class="space-y-4">
            <div>
                <h4 class="font-semibold mb-2">Getting Started:</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Fill in your book topic and preferences</li>
                    <li>• Choose number of chapters (3-50)</li>
                    <li>• Select your preferred language</li>
                    <li>• Optionally upload a cover image</li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-2">AI Generation:</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Chapter titles are generated first</li>
                    <li>• Content is created chapter by chapter</li>
                    <li>• You can edit content manually anytime</li>
                    <li>• Multiple AI models available in Settings</li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-2">Export Options:</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                    <li>• PDF export with professional styling</li>
                    <li>• HTML export for web publishing</li>
                    <li>• Cover images included in exports</li>
                </ul>
            </div>
        </div>
    `);
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="modal-content bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold">${title}</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="text-gray-400 hover:text-gray-600">
                    <i data-feather="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="mt-6 text-right">
                <button onclick="this.closest('.modal-overlay').remove()" 
                        class="btn-dynamic text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    feather.replace();
}

// Status bar functions
function toggleStatusBar() {
    const statusBar = document.querySelector('#status-bar');
    statusBar?.classList.add('hidden');
}

function updateStatus(message, type = 'info') {
    const statusBar = document.querySelector('#status-bar');
    const statusText = document.querySelector('#status-text');
    
    if (statusText) {
        statusText.textContent = message;
    }
    
    if (statusBar) {
        statusBar.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusBar.classList.add('hidden');
        }, 5000);
    }
}

// Enhanced notifications with animations
function showNotification(message, type = 'info', duration = 4000) {
    const container = document.querySelector('#notifications-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification-enter px-4 py-3 rounded-lg shadow-lg text-white max-w-sm transform transition-all duration-300`;
    
    // Set background color based on type
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    notification.classList.add(colors[type] || colors.info);
    
    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i data-feather="${icons[type] || icons.info}" class="w-5 h-5"></i>
            <span>${message}</span>
            <button onclick="removeNotification(this.parentElement.parentElement)" class="ml-2">
                <i data-feather="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    
    container.appendChild(notification);
    feather.replace();
    
    // Auto-remove notification
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
}

function removeNotification(notification) {
    if (notification) {
        notification.classList.add('notification-exit');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Real-time connection monitoring
function monitorConnection() {
    window.addEventListener('online', () => {
        updateConnectionStatus(true);
        showNotification('Connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
        updateConnectionStatus(false);
        showNotification('Connection lost', 'warning');
    });
    
    // Initial check
    updateConnectionStatus(navigator.onLine);
}

function updateConnectionStatus(isOnline) {
    const statusElement = document.querySelector('#connection-status');
    if (statusElement) {
        if (isOnline) {
            statusElement.className = 'status-indicator status-completed';
            statusElement.textContent = 'Online';
        } else {
            statusElement.className = 'status-indicator status-error';
            statusElement.textContent = 'Offline';
        }
    }
}

// Initialize connection monitoring
document.addEventListener('DOMContentLoaded', () => {
    monitorConnection();
    
    // Show welcome message for new users
    if (!localStorage.getItem('visited_before')) {
        setTimeout(() => {
            showNotification('Welcome to BookGenPro! Start by creating your first book project.', 'info', 6000);
            localStorage.setItem('visited_before', 'true');
        }, 1000);
    }
    
    // Auto-enable forms with validation
    document.querySelectorAll('form[data-validate]').forEach(form => {
        enableAutoSave(form);
        loadSavedFormData(form);
    });
});

function loadSavedFormData(form) {
    const saved = localStorage.getItem(`autosave_${form.id}`);
    if (!saved) return;
    
    try {
        const saveData = JSON.parse(saved);
        const data = saveData.data;
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
        
        // Show restore indicator
        showNotification(`Restored previous form data from ${new Date(saveData.timestamp).toLocaleString()}`, 'info', 3000);
    } catch (e) {
        console.error('Error loading saved form data:', e);
    }
}

// Template functions for quick generation
function fillTemplate(type) {
    const templates = {
        business: {
            topic: "A comprehensive business guide covering entrepreneurship fundamentals, market research, business planning, digital marketing strategies, financial management, leadership skills, and scaling operations. Target audience: aspiring entrepreneurs and small business owners looking to start or grow their business.",
            chapters: 12,
            style: "professional"
        },
        tech: {
            topic: "A complete programming tutorial covering modern web development, including HTML/CSS fundamentals, JavaScript programming, React framework, backend development with Node.js, database design, API development, deployment strategies, and best practices for code quality and testing.",
            chapters: 15,
            style: "technical"
        },
        fiction: {
            topic: "An engaging fiction novel about a young protagonist who discovers they have unique abilities and must navigate a hidden world while facing personal challenges, making difficult choices, and ultimately finding their true purpose. Genre: contemporary fantasy with elements of coming-of-age.",
            chapters: 20,
            style: "creative"
        },
        educational: {
            topic: "An educational guide for effective learning techniques, covering cognitive science principles, memory enhancement strategies, study methods, time management, critical thinking skills, research techniques, and practical applications for students and lifelong learners.",
            chapters: 10,
            style: "academic"
        }
    };
    
    const template = templates[type];
    if (!template) return;
    
    // Fill both forms (project creation and generation)
    const forms = ['#new-project-form', '#generate-book-form'];
    forms.forEach(formSelector => {
        const form = document.querySelector(formSelector);
        if (form) {
            // Fill topic fields
            const topicFields = form.querySelectorAll('[name="topic"], [name="book_topic"]');
            topicFields.forEach(field => {
                field.value = template.topic;
                // Trigger validation
                validateFieldRealTime(field);
            });
            
            // Fill chapters
            const chaptersField = form.querySelector('[name="chapters"], [name="num_chapters"]');
            if (chaptersField) {
                chaptersField.value = template.chapters;
            }
            
            // Fill style if available
            const styleField = form.querySelector('[name="style"]');
            if (styleField) {
                styleField.value = template.style;
            }
        }
    });
    
    // Scroll to generation form
    document.querySelector('#generate-book-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Show notification
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} template loaded! You can now generate the book.`, 'success', 4000);
}

// Book generation management
function startGeneration(action) {
    const statusDiv = document.querySelector('#generation-status');
    const progressBar = document.querySelector('#progress-bar');
    const progressText = document.querySelector('#progress-text');
    const currentChapter = document.querySelector('#current-chapter');
    
    if (statusDiv) {
        statusDiv.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = 'Starting generation...';
        currentChapter.textContent = '';
    }
    
    // Simulate generation progress (replace with actual API calls)
    simulateGenerationProgress(action);
}

function simulateGenerationProgress(action) {
    const progressBar = document.querySelector('#progress-bar');
    const progressText = document.querySelector('#progress-text');
    const currentChapter = document.querySelector('#current-chapter');
    
    const chapters = parseInt(document.querySelector('#gen_chapters').value) || 8;
    const isFullGeneration = action === 'generate_full';
    
    let currentChapterNum = 0;
    let progress = 0;
    
    const interval = setInterval(() => {
        if (isFullGeneration) {
            progress = (currentChapterNum / chapters) * 100;
            progressText.textContent = `Generating chapter ${currentChapterNum + 1} of ${chapters}`;
            currentChapter.textContent = `Working on: Chapter ${currentChapterNum + 1}`;
        } else {
            progress = (currentChapterNum / chapters) * 100;
            progressText.textContent = `Creating chapter titles... ${currentChapterNum + 1}/${chapters}`;
            currentChapter.textContent = `Generating title for chapter ${currentChapterNum + 1}`;
        }
        
        progressBar.style.width = progress + '%';
        
        currentChapterNum++;
        
        if (currentChapterNum >= chapters) {
            clearInterval(interval);
            completeGeneration();
        }
    }, 2000);
    
    // Store interval ID for stopping
    window.generationInterval = interval;
}

function completeGeneration() {
    const progressText = document.querySelector('#progress-text');
    const currentChapter = document.querySelector('#current-chapter');
    const progressBar = document.querySelector('#progress-bar');
    
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    if (progressText) {
        progressText.textContent = 'Generation completed!';
    }
    
    if (currentChapter) {
        currentChapter.textContent = 'All chapters generated successfully';
    }
    
    // Show completion effects
    showCompletionEffect();
    
    // Hide status after delay
    setTimeout(() => {
        const statusDiv = document.querySelector('#generation-status');
        if (statusDiv) {
            statusDiv.classList.add('hidden');
        }
    }, 5000);
}

function stopGeneration() {
    if (window.generationInterval) {
        clearInterval(window.generationInterval);
        window.generationInterval = null;
    }
    
    const progressText = document.querySelector('#progress-text');
    const currentChapter = document.querySelector('#current-chapter');
    
    if (progressText) {
        progressText.textContent = 'Generation stopped';
    }
    
    if (currentChapter) {
        currentChapter.textContent = 'User cancelled generation';
    }
    
    showNotification('Book generation stopped', 'warning');
    
    setTimeout(() => {
        const statusDiv = document.querySelector('#generation-status');
        if (statusDiv) {
            statusDiv.classList.add('hidden');
        }
    }, 2000);
}

// Enhanced form submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle generation form submission
    const genForm = document.querySelector('#generate-book-form');
    if (genForm) {
        genForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const action = e.submitter?.value || 'generate_full';
            const topic = document.querySelector('#gen_topic').value.trim();
            
            if (!topic) {
                showNotification('Please enter a book topic first', 'error');
                document.querySelector('#gen_topic').focus();
                return;
            }
            
            // Check if API is configured
            const apiConfigured = document.querySelector('.text-green-600');
            if (!apiConfigured) {
                showNotification('Please configure OpenRouter API in Settings first', 'warning');
                setTimeout(() => {
                    window.location.href = '/settings';
                }, 2000);
                return;
            }
            
            startGeneration(action);
            showNotification(`Starting ${action === 'generate_titles' ? 'chapter title' : 'full book'} generation...`, 'info');
        });
    }
});
