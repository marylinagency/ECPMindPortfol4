// BookGenPro JavaScript functionality

// Global chart variables
// Chart variables removed - no longer using charts on homepage

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
    createTitleParticles();
    initializeTitleTracking();
    initializeChapterGeneration();
    initializeFormValidation();
    initializeTooltips();
    initializeDynamicFeatures();
    initializeRealTimeUpdates();
    initializeInteractiveElements();
    loadSavedAuthorBio();
    
    // Initialize new enhanced homepage features
    initializeHomepageFeatures();
    loadBookLibrary();
    loadRecentActivity();
    checkAIStatusOnLoad();
    loadHomepageStats();
});

// Load saved author bio from settings enhancement
function loadSavedAuthorBio() {
    const savedBio = sessionStorage.getItem('enhanced_author_bio');
    if (savedBio) {
        // Auto-fill author bio fields in both AI and manual forms
        const genAuthorBio = document.getElementById('gen_author_bio');
        if (genAuthorBio && !genAuthorBio.value) {
            genAuthorBio.value = savedBio;
        }
        
        // Also fill manual form if it exists
        const manualAuthorBio = document.getElementById('manual-author-bio');
        if (manualAuthorBio && !manualAuthorBio.value) {
            manualAuthorBio.value = savedBio;
        }
        
        // Remove from session storage after use
        sessionStorage.removeItem('enhanced_author_bio');
        
        // Show a brief notification
        showNotification('Author bio loaded from AI enhancement!', 'success');
    }
}

// Create floating particles around the title
function createTitleParticles() {
    const container = document.getElementById('title-particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            
            // Random colors
            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            container.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        }, i * 200);
    }
    
    // Continuously create new particles
    setInterval(() => {
        if (container.children.length < 15) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = '0s';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            
            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        }
    }, 400);
}

// Add mouse tracking effect to title
function initializeTitleTracking() {
    const title = document.querySelector('.enhanced-title');
    if (!title) return;
    
    title.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        this.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    title.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
}

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
            
            <form method="POST" action="/create_manual_book" enctype="multipart/form-data" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
                    <input type="text" name="book_title" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           placeholder="Enter your book title">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Book Topic/Theme</label>
                    <textarea name="topic" rows="4" required
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              placeholder="Describe your book topic, genre, and main themes..."></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Author Bio (Optional)</label>
                    <div class="relative">
                        <textarea id="manual-author-bio" name="author_bio" rows="3"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  placeholder="Tell readers about yourself - your background, expertise, and qualifications..."></textarea>
                        <div class="mt-2 text-right">
                            <a href="/settings" class="text-sm text-purple-600 hover:text-purple-800">
                                <i data-feather="sparkles" class="w-4 h-4 inline mr-1"></i>
                                Enhance with AI in Settings
                            </a>
                        </div>
                    </div>
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
                            <option value="Arabic">Arabic</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Number of Chapters</label>
                        <input type="number" name="chapters" value="8" min="3" max="25"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Writing Style</label>
                    <select name="style" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="academic">Academic</option>
                        <option value="creative">Creative</option>
                        <option value="technical">Technical</option>
                    </select>
                </div>
                
                <!-- Generation Options -->
                <div class="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">Generation Options</h4>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Chapter Titles</label>
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input type="radio" name="chapter_titles_method" value="ai" class="mr-2" checked>
                                <span class="text-gray-700 text-sm">AI Generated</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="chapter_titles_method" value="manual" class="mr-2">
                                <span class="text-gray-700 text-sm">Manual Entry</span>
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Chapter Content</label>
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input type="radio" name="content_method" value="ai" class="mr-2">
                                <span class="text-gray-700 text-sm">AI Generated</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="content_method" value="manual" class="mr-2" checked>
                                <span class="text-gray-700 text-sm">Manual Entry</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Mood Tracker -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">How are you feeling about writing today?</label>
                    <div class="grid grid-cols-4 gap-2">
                        <label class="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                            <input type="radio" name="generation_mood" value="excited" class="sr-only">
                            <span class="text-2xl mb-1">😊</span>
                            <span class="text-xs text-gray-600">Excited</span>
                        </label>
                        <label class="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                            <input type="radio" name="generation_mood" value="focused" class="sr-only">
                            <span class="text-2xl mb-1">🎯</span>
                            <span class="text-xs text-gray-600">Focused</span>
                        </label>
                        <label class="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                            <input type="radio" name="generation_mood" value="creative" class="sr-only">
                            <span class="text-2xl mb-1">🎨</span>
                            <span class="text-xs text-gray-600">Creative</span>
                        </label>
                        <label class="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                            <input type="radio" name="generation_mood" value="motivated" class="sr-only">
                            <span class="text-2xl mb-1">🚀</span>
                            <span class="text-xs text-gray-600">Motivated</span>
                        </label>
                    </div>
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
    // Auto-refresh project status only if not completed
    const statusElement = document.getElementById('generation-status');
    if (document.querySelector('[data-project-id]') && 
        (!statusElement || !statusElement.textContent.includes('completed'))) {
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
    
    // Check if project is already completed - don't start polling
    const statusElement = document.getElementById('generation-status');
    if (statusElement && statusElement.textContent.includes('completed')) {
        window.generationCompleted = true;
        return;
    }
    
    checkGenerationStatus(id);
}

function checkGenerationStatus(projectId) {
    // Don't check if already completed
    if (window.generationCompleted) return;
    
    fetch(`/check_generation_status/${projectId}`)
        .then(response => response.json())
        .then(data => {
            updateGenerationUI(data);
            
            // Continue checking if still generating
            if (data.status === 'enhancing_description' || data.status === 'generating_titles' || data.status === 'generating_content') {
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
            case 'enhancing_description':
                statusText = 'Enhancing book description...';
                statusClass = 'status-generating';
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
    
    // Only refresh page if generation just completed (not if it was already completed)
    if (data.status === 'completed' && !window.generationCompleted) {
        window.generationCompleted = true;
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
    const indicator = document.getElementById('save-indicator') || createSaveIndicator();
    
    if (status === 'saving') {
        indicator.textContent = 'Saving...';
        indicator.className = 'save-indicator text-yellow-600';
    } else {
        indicator.textContent = 'Saved';
        indicator.className = 'save-indicator text-green-600';
        
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }
}

function createSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'save-indicator';
    indicator.className = 'fixed top-4 left-4 z-50 px-3 py-1 bg-white rounded shadow-lg text-sm';
    document.body.appendChild(indicator);
    return indicator;
}

// Enhanced Homepage Features
function initializeHomepageFeatures() {
    // Initialize quick template functionality
    initializeQuickTemplates();
    
    // Initialize method selection guide
    initializeMethodGuide();
    
    // Initialize export guide
    initializeExportGuide();
    
    // Initialize AI status checking
    setupAIStatusMonitoring();
}

// Quick Templates Functionality
function initializeQuickTemplates() {
    // Template data
    const templates = {
        business: {
            title: "The Complete Business Guide to [Your Industry]",
            description: "A comprehensive business guide covering market analysis, strategic planning, financial management, and growth strategies for entrepreneurs and business leaders in [specific industry]. This book will provide practical tools, real-world case studies, and actionable insights for building successful businesses.",
            chapters: 12,
            style: "professional"
        },
        selfhelp: {
            title: "Transform Your Life: A Journey to Personal Excellence",
            description: "A personal development book focused on self-improvement, mindset transformation, goal achievement, and building lasting positive habits. This guide will help readers overcome obstacles, develop confidence, and create meaningful change in their personal and professional lives.",
            chapters: 10,
            style: "conversational"
        },
        technical: {
            title: "Mastering [Technology/Skill]: A Step-by-Step Technical Guide",
            description: "A comprehensive technical manual providing detailed instructions, best practices, troubleshooting guides, and advanced techniques for mastering [specific technology or skill]. Perfect for beginners to advanced practitioners looking to enhance their expertise.",
            chapters: 15,
            style: "technical"
        }
    };

    // Add event listeners for template buttons (if they don't exist, create them)
    window.useTemplate = function(templateKey) {
        const template = templates[templateKey];
        if (!template) return;

        // Fill the AI generation form if it exists
        const titleInput = document.getElementById('gen_book_title');
        const topicInput = document.getElementById('gen_topic');
        const chaptersInput = document.getElementById('gen_chapters');
        const styleSelect = document.getElementById('gen_style');

        if (titleInput) titleInput.value = template.title;
        if (topicInput) topicInput.value = template.description;
        if (chaptersInput) chaptersInput.value = template.chapters;
        if (styleSelect) styleSelect.value = template.style;

        // Show notification
        showNotification(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template loaded! Scroll down to customize and generate.`, 'success');
        
        // Smooth scroll to the AI generation form
        const generationForm = document.getElementById('generate-book-form');
        if (generationForm) {
            generationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Add highlight effect
            generationForm.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
            setTimeout(() => {
                generationForm.style.boxShadow = '';
            }, 3000);
        }
    };
}

// Method Selection Guide
function initializeMethodGuide() {
    window.showMethodSelection = function() {
        const modal = createModal('Choose Your Creation Method', `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onclick="selectMethod('ai')">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                                <i data-feather="zap" class="w-5 h-5 text-white"></i>
                            </div>
                            <h3 class="font-semibold">AI Generation</h3>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">Best for: Quick book creation, content ideas, getting started</p>
                        <ul class="text-xs text-gray-500 space-y-1">
                            <li>✓ Complete books in minutes</li>
                            <li>✓ AI-generated outlines and content</li>
                            <li>✓ Multiple language support</li>
                            <li>✓ Professional formatting</li>
                        </ul>
                    </div>
                    
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onclick="selectMethod('manual')">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                                <i data-feather="edit-3" class="w-5 h-5 text-white"></i>
                            </div>
                            <h3 class="font-semibold">Manual Creation</h3>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">Best for: Custom content, specific requirements, personal touch</p>
                        <ul class="text-xs text-gray-500 space-y-1">
                            <li>✓ Complete creative control</li>
                            <li>✓ Custom chapter structure</li>
                            <li>✓ Personal writing style</li>
                            <li>✓ Edit as you go</li>
                        </ul>
                    </div>
                </div>
                
                <div class="text-center pt-4 border-t border-gray-200">
                    <p class="text-sm text-gray-600 mb-4">💡 Pro Tip: You can combine both methods! Start with AI generation and then manually edit the content.</p>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    };

    window.selectMethod = function(method) {
        // Close modal
        const modal = document.querySelector('.method-selection-modal');
        if (modal) modal.remove();

        if (method === 'ai') {
            window.location.href = '/standalone_generation';
        } else {
            showManualCreationModal();
        }
    };
}

// Export Guide
function initializeExportGuide() {
    window.showExportGuide = function() {
        const modal = createModal('Export Your Books', `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                                <i data-feather="file-text" class="w-5 h-5 text-white"></i>
                            </div>
                            <h3 class="font-semibold">PDF Export</h3>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">Perfect for: Reading, sharing, publishing</p>
                        <ul class="text-xs text-gray-500 space-y-1">
                            <li>✓ Professional formatting</li>
                            <li>✓ Cover image included</li>
                            <li>✓ KDP-ready layout</li>
                            <li>✓ Print-friendly</li>
                        </ul>
                    </div>
                    
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                <i data-feather="edit-2" class="w-5 h-5 text-white"></i>
                            </div>
                            <h3 class="font-semibold">DOCX Export</h3>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">Perfect for: Editing, collaboration, submission</p>
                        <ul class="text-xs text-gray-500 space-y-1">
                            <li>✓ Editable in Word</li>
                            <li>✓ Track changes support</li>
                            <li>✓ Comments and reviews</li>
                            <li>✓ Publisher ready</li>
                        </ul>
                    </div>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-semibold text-blue-800 mb-2">📚 Publishing Tips</h4>
                    <ul class="text-sm text-blue-700 space-y-1">
                        <li>• PDF exports are ideal for Amazon KDP and other print-on-demand services</li>
                        <li>• DOCX exports work great for traditional publishers and editors</li>
                        <li>• Always review your book in preview mode before exporting</li>
                        <li>• Upload a high-quality cover image for best results</li>
                    </ul>
                </div>
                
                <div class="text-center pt-4">
                    <button onclick="document.querySelector('.export-guide-modal').remove()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Got it!
                    </button>
                </div>
            </div>
        `);
        
        modal.classList.add('export-guide-modal');
        document.body.appendChild(modal);
    };
}

// AI Status Monitoring
function setupAIStatusMonitoring() {
    // Check AI status every 30 seconds if on homepage
    if (window.location.pathname === '/') {
        setInterval(updateAIStatus, 30000);
    }
}

function checkAIStatusOnLoad() {
    // Update initial status
    updateAIStatus();
}

function updateAIStatus() {
    fetch('/api/check_ai_status')
        .then(response => response.json())
        .then(data => {
            const statusElement = document.getElementById('ai-status');
            const configStatusElement = document.getElementById('config-status');
            
            if (statusElement) {
                statusElement.textContent = data.status;
            }
            
            if (configStatusElement) {
                configStatusElement.textContent = data.detailed_status;
                configStatusElement.className = data.is_ready ? 'text-sm text-green-300' : 'text-sm text-red-300';
            }
        })
        .catch(error => {
            console.log('AI status check failed:', error);
        });
}

window.checkAIStatus = function() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Testing...';
    button.disabled = true;
    
    fetch('/api/test_ai_connection')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('✅ AI connection successful!', 'success');
                updateAIStatus(); // Refresh status
            } else {
                showNotification('❌ AI connection failed: ' + data.message, 'error');
            }
        })
        .catch(error => {
            showNotification('❌ Connection test failed', 'error');
        })
        .finally(() => {
            button.textContent = originalText;
            button.disabled = false;
        });
};

// Homepage Statistics Loading  
function loadHomepageStats() {
    fetch('/api/projects')
        .then(response => response.json())
        .then(data => {
            updateLibraryCounter(data.projects.length);
        })
        .catch(error => {
            console.log('Failed to load homepage statistics:', error);
        });

    // Update AI provider status
    updateHomepageAIStatus();
}

function updateLibraryCounter(count) {
    const counterElement = document.getElementById('stats-library-count');
    if (counterElement) {
        counterElement.textContent = `${count} book${count !== 1 ? 's' : ''}`;
    }
}

function updateHomepageAIStatus() {
    fetch('/api/check_ai_status')
        .then(response => response.json())
        .then(data => {
            const providerElement = document.getElementById('stats-ai-provider');
            const statusElement = document.getElementById('stats-ai-status');
            
            if (providerElement) {
                // Extract provider name from detailed status
                if (data.detailed_status.includes('OpenRouter')) {
                    providerElement.textContent = 'OpenRouter';
                } else if (data.detailed_status.includes('Gemini')) {
                    providerElement.textContent = 'Gemini AI';
                } else {
                    providerElement.textContent = 'Not Configured';
                }
            }
            
            if (statusElement) {
                statusElement.textContent = data.is_ready ? 'Ready for generation' : 'Setup required';
            }
        })
        .catch(error => {
            console.log('AI status check failed:', error);
            const providerElement = document.getElementById('stats-ai-provider');
            const statusElement = document.getElementById('stats-ai-status');
            
            if (providerElement) providerElement.textContent = 'Connection Error';
            if (statusElement) statusElement.textContent = 'Unable to verify status';
        });
}



// Recent Activity Loading
function loadRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;
    
    // Show loading state
    activityContainer.innerHTML = '<div class="text-gray-500 text-sm">Loading recent activity...</div>';
    
    fetch('/api/projects')
        .then(response => response.json())
        .then(data => {
            const projects = data.projects.sort((a, b) => 
                new Date(b.last_modified || 0) - new Date(a.last_modified || 0)
            ).slice(0, 3);
            
            if (projects.length === 0) {
                activityContainer.innerHTML = '<div class="text-gray-500 text-sm">No recent activity</div>';
                return;
            }
            
            const activityHTML = projects.map(project => {
                const date = project.last_modified ? 
                    new Date(project.last_modified).toLocaleDateString() : 
                    'Unknown date';
                
                return `
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-300">${project.title || 'Untitled Book'}</span>
                        <span class="text-gray-500">${date}</span>
                    </div>
                `;
            }).join('');
            
            activityContainer.innerHTML = activityHTML;
        })
        .catch(error => {
            activityContainer.innerHTML = '<div class="text-red-400 text-sm">Failed to load activity</div>';
        });
}

// Note: Completed projects are now handled by the comprehensive book library system

// Utility function to create modals
function createModal(title, content, className = '') {
    const modal = document.createElement('div');
    modal.className = `fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`;
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">${title}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i data-feather="x" class="w-6 h-6"></i>
                    </button>
                </div>
            </div>
            <div class="p-6">
                ${content}
            </div>
        </div>
    `;
    
    // Re-initialize feather icons for the modal
    setTimeout(() => feather.replace(), 100);
    
    return modal;
}

// Generate SVG cover for books without images
function generateBookCoverSVG(title) {
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ];
    
    const gradient = colors[Math.floor(Math.random() * colors.length)];
    
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
            <text x="150" y="200" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
                ${title.length > 30 ? title.substring(0, 30) + '...' : title}
            </text>
        </svg>
    `;
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
            
            // Check if API is configured using new status check
            checkAIProviderStatus().then(status => {
                if (!status.configured) {
                    showNotification(`Please configure ${status.provider_name} API in Settings first`, 'warning');
                    setTimeout(() => {
                        window.location.href = '/settings';
                    }, 2000);
                    return;
                }
                
                startGeneration(action);
                showNotification(`Starting ${action === 'generate_titles' ? 'chapter title' : 'full book'} generation...`, 'info');
            });
        });
    }
    
    // Check AI provider status on page load
    updateAIProviderStatus();
    
    // Load mood history on page load
    loadMoodHistory();
});

// AI Provider Status Functions
function checkAIProviderStatus() {
    return fetch('/check_ai_provider_status')
        .then(response => response.json())
        .catch(error => {
            console.error('Error checking AI provider status:', error);
            return { configured: false, provider_name: 'AI Provider' };
        });
}

function updateAIProviderStatus() {
    checkAIProviderStatus().then(status => {
        const statusContainer = document.getElementById('ai-provider-status');
        if (!statusContainer) return;
        
        const statusHTML = status.configured 
            ? `<div class="flex items-center text-green-300">
                   <div class="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                   <span class="text-sm font-medium">${status.provider_name}</span>
                   <span class="ml-2 text-xs bg-green-400/20 text-green-300 px-2 py-1 rounded-full">${status.model}</span>
               </div>`
            : `<div class="flex items-center text-red-300">
                   <div class="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                   <span class="text-sm">${status.provider_name} - Not Configured</span>
               </div>`;
        
        statusContainer.innerHTML = statusHTML;
    });
}

// Manual Form Functions
function showManualForm() {
    const container = document.getElementById('manual-form-container');
    const button = document.getElementById('manual-show-button');
    
    if (container && button) {
        container.classList.remove('hidden');
        button.classList.add('hidden');
        
        // Add fade-in animation
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 10);
        
        // Focus on the first input
        document.getElementById('manual_topic')?.focus();
    }
}

function hideManualForm() {
    const container = document.getElementById('manual-form-container');
    const button = document.getElementById('manual-show-button');
    
    if (container && button) {
        container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            container.classList.add('hidden');
            button.classList.remove('hidden');
            
            // Reset form
            container.querySelector('form').reset();
        }, 300);
    }
}

// Writing Mood Tracker Functions
let selectedMood = null;

function selectMood(mood, emoji, name) {
    // Remove previous selection
    document.querySelectorAll('.mood-emoji').forEach(element => {
        element.classList.remove('selected');
    });
    
    // Add selection to clicked mood
    const moodElement = document.querySelector(`[data-mood="${mood}"]`);
    if (moodElement) {
        moodElement.classList.add('selected');
    }
    
    // Store selected mood
    selectedMood = {
        mood: mood,
        emoji: emoji,
        name: name
    };
    
    // Enable save button
    const saveBtn = document.getElementById('save-mood-btn');
    if (saveBtn) {
        saveBtn.disabled = false;
    }
}

async function saveMood() {
    if (!selectedMood) {
        showNotification('Please select a mood first', 'error');
        return;
    }
    
    const note = document.getElementById('mood-note').value.trim();
    const saveBtn = document.getElementById('save-mood-btn');
    
    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i data-feather="loader" class="w-4 h-4 inline mr-2 animate-spin"></i>Saving...';
        feather.replace();
        
        const response = await fetch('/save_mood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mood: selectedMood.mood,
                note: note
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Mood saved successfully!', 'success');
            
            // Reset form
            document.querySelectorAll('.mood-emoji').forEach(element => {
                element.classList.remove('selected');
            });
            document.getElementById('mood-note').value = '';
            selectedMood = null;
            
            // Refresh mood history
            loadMoodHistory();
        } else {
            showNotification(data.message || 'Error saving mood', 'error');
        }
        
    } catch (error) {
        console.error('Error saving mood:', error);
        showNotification('Error saving mood. Please try again.', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i data-feather="heart" class="w-4 h-4 inline mr-2"></i>Save My Mood';
        feather.replace();
    }
}

async function loadMoodHistory() {
    try {
        const response = await fetch('/get_mood_history');
        const data = await response.json();
        
        if (data.success) {
            const historyContainer = document.getElementById('mood-history');
            if (!historyContainer) return;
            
            if (data.moods.length === 0) {
                historyContainer.innerHTML = `
                    <div class="flex-shrink-0 text-center text-gray-300">
                        <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                            <i data-feather="calendar" class="w-6 h-6"></i>
                        </div>
                        <span class="text-xs">No moods yet</span>
                    </div>
                `;
                feather.replace();
                return;
            }
            
            const today = new Date().toISOString().split('T')[0];
            const moodEmojis = {
                'excited': '🤩',
                'focused': '🎯', 
                'creative': '🎨',
                'tired': '😴',
                'blocked': '😵‍💫'
            };
            
            const historyHTML = data.moods.slice(0, 10).map(moodEntry => {
                const date = new Date(moodEntry.date);
                const isToday = moodEntry.date === today;
                const emoji = moodEmojis[moodEntry.mood] || '😊';
                
                return `
                    <div class="mood-history-item ${isToday ? 'today' : ''}" title="${moodEntry.note || 'No note'}">
                        <div class="emoji">${emoji}</div>
                        <div class="date">${date.getMonth() + 1}/${date.getDate()}</div>
                        <div class="mood-name">${moodEntry.mood}</div>
                    </div>
                `;
            }).join('');
            
            historyContainer.innerHTML = historyHTML;
            
        } else {
            console.error('Error loading mood history:', data.message);
        }
        
    } catch (error) {
        console.error('Error loading mood history:', error);
        const historyContainer = document.getElementById('mood-history');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="flex-shrink-0 text-center text-gray-300">
                    <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                        <i data-feather="alert-circle" class="w-6 h-6"></i>
                    </div>
                    <span class="text-xs">Error loading</span>
                </div>
            `;
            feather.replace();
        }
    }
}

// Project-specific Writing Mood Tracker Functions
let selectedProjectMood = null;

function selectProjectMood(mood, emoji, name) {
    // Remove previous selection
    document.querySelectorAll('.project-mood-emoji').forEach(element => {
        element.classList.remove('selected');
    });
    
    // Add selection to clicked mood
    const moodElement = document.querySelector(`[data-mood="${mood}"]`);
    if (moodElement) {
        moodElement.classList.add('selected');
    }
    
    // Store selected mood
    selectedProjectMood = {
        mood: mood,
        emoji: emoji,
        name: name
    };
    
    // Enable save button
    const saveBtn = document.getElementById('save-project-mood-btn');
    if (saveBtn) {
        saveBtn.disabled = false;
    }
}

async function saveProjectMood() {
    if (!selectedProjectMood) {
        showNotification('Please select a mood first', 'error');
        return;
    }
    
    // Get project ID from page
    const projectElement = document.querySelector('[data-project-id]');
    if (!projectElement) {
        showNotification('Project ID not found', 'error');
        return;
    }
    
    const projectId = projectElement.dataset.projectId;
    const note = document.getElementById('project-mood-note').value.trim();
    const saveBtn = document.getElementById('save-project-mood-btn');
    
    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i data-feather="loader" class="w-4 h-4 inline mr-2 animate-spin"></i>Saving...';
        feather.replace();
        
        const response = await fetch(`/project/${projectId}/save_project_mood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mood: selectedProjectMood.mood,
                note: note
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Project mood saved successfully!', 'success');
            
            // Reset form
            document.querySelectorAll('.project-mood-emoji').forEach(element => {
                element.classList.remove('selected');
            });
            document.getElementById('project-mood-note').value = '';
            selectedProjectMood = null;
            
            // Refresh mood history
            loadProjectMoodHistory(projectId);
        } else {
            showNotification(data.message || 'Error saving project mood', 'error');
        }
        
    } catch (error) {
        console.error('Error saving project mood:', error);
        showNotification('Error saving project mood. Please try again.', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i data-feather="heart" class="w-4 h-4 inline mr-2"></i>Save Project Mood';
        feather.replace();
    }
}

async function loadProjectMoodHistory(projectId) {
    try {
        const response = await fetch(`/project/${projectId}/get_project_mood_history`);
        const data = await response.json();
        
        if (data.success) {
            const historyContainer = document.getElementById('project-mood-history');
            if (!historyContainer) return;
            
            if (data.moods.length === 0) {
                historyContainer.innerHTML = `
                    <div class="flex-shrink-0 text-center text-gray-400">
                        <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                            <i data-feather="calendar" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs">No moods yet</span>
                    </div>
                `;
                feather.replace();
                return;
            }
            
            const today = new Date().toISOString().split('T')[0];
            const moodEmojis = {
                'excited': '🤩',
                'focused': '🎯', 
                'creative': '🎨',
                'motivated': '💪',
                'inspired': '💡',
                'tired': '😴',
                'blocked': '🧱',
                'stressed': '😰'
            };
            
            const historyHTML = data.moods.slice(0, 10).map(moodEntry => {
                const date = new Date(moodEntry.date);
                const isToday = moodEntry.date === today;
                const emoji = moodEmojis[moodEntry.mood] || '😊';
                
                return `
                    <div class="project-mood-history-item ${isToday ? 'today' : ''}" title="${moodEntry.note || 'No note'}">
                        <div class="emoji">${emoji}</div>
                        <div class="date">${date.getMonth() + 1}/${date.getDate()}</div>
                        <div class="mood-name">${moodEntry.mood}</div>
                    </div>
                `;
            }).join('');
            
            historyContainer.innerHTML = historyHTML;
            
            // Calculate and display mood streak
            calculateProjectMoodStreak(data.moods);
            
        } else {
            console.error('Error loading project mood history:', data.message);
        }
        
    } catch (error) {
        console.error('Error loading project mood history:', error);
        const historyContainer = document.getElementById('project-mood-history');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="flex-shrink-0 text-center text-gray-400">
                    <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                        <i data-feather="alert-circle" class="w-5 h-5"></i>
                    </div>
                    <span class="text-xs">Error loading</span>
                </div>
            `;
            feather.replace();
        }
    }
}

function calculateProjectMoodStreak(moods) {
    const streakElement = document.getElementById('streak-days');
    if (!streakElement || !moods || moods.length === 0) {
        if (streakElement) streakElement.textContent = '0';
        return;
    }
    
    // Sort moods by date (newest first)
    const sortedMoods = [...moods].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    // Check if there's a mood for today or yesterday
    for (const mood of sortedMoods) {
        const moodDate = new Date(mood.date);
        const diffDays = Math.floor((checkDate - moodDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Mood for current check date exists
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (diffDays === 1 && streak === 0) {
            // If no mood today but mood yesterday, start streak from yesterday
            streak++;
            checkDate.setDate(checkDate.getDate() - 2);
        } else {
            break; // Gap found, stop counting
        }
    }
    
    streakElement.textContent = streak;
    
    // Update streak display color based on streak length
    const streakContainer = document.getElementById('project-mood-streak');
    if (streakContainer) {
        if (streak >= 7) {
            streakContainer.className = 'mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200';
        } else if (streak >= 3) {
            streakContainer.className = 'mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full border border-blue-200';
        } else {
            streakContainer.className = 'mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full border border-pink-200';
        }
    }
}

// AI Generation mood selection functions
let selectedAIMood = null;

function selectAIMood(mood, emoji) {
    // Remove previous selection
    document.querySelectorAll('.ai-mood-emoji').forEach(element => {
        element.classList.remove('selected');
    });
    
    // Add selection to clicked mood
    const moodElement = document.querySelector(`[data-mood="${mood}"]`);
    if (moodElement && moodElement.classList.contains('ai-mood-emoji')) {
        moodElement.classList.add('selected');
    }
    
    // Store selected mood
    selectedAIMood = {
        mood: mood,
        emoji: emoji
    };
    
    // Update hidden input
    const hiddenInput = document.getElementById('ai_generation_mood');
    if (hiddenInput) {
        hiddenInput.value = mood;
    }
}

// Manual Creation mood selection functions
let selectedManualMood = null;

function selectManualMood(mood, emoji) {
    // Remove previous selection
    document.querySelectorAll('.manual-mood-emoji').forEach(element => {
        element.classList.remove('selected');
    });
    
    // Add selection to clicked mood
    const moodElement = document.querySelector(`[data-mood="${mood}"].manual-mood-emoji`);
    if (moodElement) {
        moodElement.classList.add('selected');
    }
    
    // Store selected mood
    selectedManualMood = {
        mood: mood,
        emoji: emoji
    };
    
    // Update hidden input
    const hiddenInput = document.getElementById('manual_generation_mood');
    if (hiddenInput) {
        hiddenInput.value = mood;
    }
}

// Modal functions for action cards
function showAIGenerationModal() {
    // Scroll to the existing AI generation form
    const formSection = document.getElementById('generate-book-form');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // Add highlight effect
        formSection.parentElement.classList.add('pulse-glow');
        setTimeout(() => {
            formSection.parentElement.classList.remove('pulse-glow');
        }, 2000);
    }
}

function showManualCreationModal() {
    // Show the manual creation form
    const manualFormContainer = document.getElementById('manual-form-container');
    const showButton = document.getElementById('manual-show-button');
    
    if (manualFormContainer && showButton) {
        showManualForm();
        
        // Scroll to the form
        setTimeout(() => {
            manualFormContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
}

// Load completed projects function
function loadCompletedProjects() {
    fetch('/api/projects')
        .then(response => response.json())
        .then(projects => {
            const grid = document.getElementById('completed-projects-grid');
            const emptyState = document.getElementById('empty-projects-state');
            const projectCount = document.getElementById('project-count');
            
            // Filter only completed projects
            const completedProjects = projects.filter(project => 
                project.status === 'completed' && project.chapters && project.chapters.length > 0
            );
            
            if (completedProjects.length === 0) {
                grid.style.display = 'none';
                emptyState.style.display = 'block';
                projectCount.textContent = '0';
                return;
            }
            
            grid.style.display = 'grid';
            emptyState.style.display = 'none';
            projectCount.textContent = completedProjects.length;
            
            grid.innerHTML = completedProjects.map(project => {
                const coverImage = project.cover_image ? 
                    `/static/uploads/${project.cover_image}` : 
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDI0MCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMzIwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8cGF0aCBkPSJNMTIwIDEwMEM5Mi4zODU4IDEwMCA3MCAxMjIuMzg2IDcwIDE1MEM3MCAxNzcuNjE0IDkyLjM4NTggMjAwIDEyMCAyMDBDMTQ3LjYxNCAyMDAgMTcwIDE3Ny42MTQgMTcwIDE1MEMxNzAgMTIyLjM4NiAxNDcuNjE0IDEwMCAxMjAgMTAwWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMF8xIiB4MT0iMCIgeTE9IjAiIHgyPSIyNDAiIHkyPSIzMjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY2N0VFQSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NjRCQTIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K';
                
                const createdDate = new Date(project.created_at || Date.now()).toLocaleDateString();
                const chapterCount = project.chapters ? project.chapters.length : 0;
                
                return `
                    <div class="project-card" onclick="window.location.href='/project/${project.id}'">
                        <div class="project-cover">
                            <img src="${coverImage}" alt="${project.topic}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDI0MCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMzIwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8cGF0aCBkPSJNMTIwIDEwMEM5Mi4zODU4IDEwMCA3MCAxMjIuMzg2IDcwIDE1MEM3MCAxNzcuNjE0IDkyLjM4NTggMjAwIDEyMCAyMDBDMTQ3LjYxNCAyMDAgMTcwIDE3Ny42MTQgMTcwIDE1MEMxNzAgMTIyLjM4NiAxNDcuNjE0IDEwMCAxMjAgMTAwWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMF8xIiB4MT0iMCIgeTE9IjAiIHgyPSIyNDAiIHkyPSIzMjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY2N0VFQSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NjRCQTIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'">
                            <div class="project-cover-gradient"></div>
                        </div>
                        <div class="project-info">
                            <h3 class="project-title">${project.topic}</h3>
                            <div class="project-meta">
                                <span><i data-feather="calendar" class="w-4 h-4 inline"></i> ${createdDate}</span>
                                <span><i data-feather="file-text" class="w-4 h-4 inline"></i> ${chapterCount} chapters</span>
                            </div>
                            <div class="project-status">
                                <i data-feather="check-circle" class="w-3 h-3"></i>
                                Completed
                            </div>
                            <div class="project-actions mt-4" onclick="event.stopPropagation()">
                                <button class="project-action-btn btn-primary" onclick="window.location.href='/project/${project.id}'">
                                    <i data-feather="eye" class="w-4 h-4 inline mr-1"></i>
                                    View
                                </button>
                                <button class="project-action-btn btn-secondary" onclick="window.location.href='/book-preview/${project.id}'">
                                    <i data-feather="book-open" class="w-4 h-4 inline mr-1"></i>
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Re-initialize Feather icons for the new content
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            const grid = document.getElementById('completed-projects-grid');
            const emptyState = document.getElementById('empty-projects-state');
            
            grid.style.display = 'none';
            emptyState.style.display = 'block';
        });
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load completed projects if on homepage
    if (document.getElementById('completed-projects-grid')) {
        loadCompletedProjects();
    }
    
    // Existing mood tracker loading for project pages
    const projectElement = document.querySelector('[data-project-id]');
    if (projectElement) {
        const projectId = projectElement.dataset.projectId;
        loadProjectMoodHistory(projectId);
    }
});

// Auto-load project mood history when on project page
document.addEventListener('DOMContentLoaded', function() {
    const projectElement = document.querySelector('[data-project-id]');
    if (projectElement) {
        const projectId = projectElement.dataset.projectId;
        loadProjectMoodHistory(projectId);
    }
});



// Book Library Functions
let currentFilter = "all";

function loadBookLibrary() {
    const libraryGrid = document.getElementById("book-library-grid");
    const emptyState = document.getElementById("library-empty-state");
    const bookCount = document.getElementById("library-book-count");
    
    if (!libraryGrid) return;
    
    // Show loading state
    libraryGrid.innerHTML = "<div class=\"col-span-full text-center text-gray-400\">Loading your book library...</div>";
    
    fetch("/api/projects")
        .then(response => response.json())
        .then(data => {
            const books = data.projects || [];
            
            if (bookCount) bookCount.textContent = books.length;
            
            if (books.length === 0) {
                libraryGrid.innerHTML = "";
                if (emptyState) emptyState.classList.remove("hidden");
                return;
            }
            
            if (emptyState) emptyState.classList.add("hidden");
            displayBooks(books);
        })
        .catch(error => {
            console.error("Error loading book library:", error);
            libraryGrid.innerHTML = "<div class=\"col-span-full text-center text-red-400\">Failed to load books</div>";
        });
}

function displayBooks(books) {
    const libraryGrid = document.getElementById("book-library-grid");
    if (!libraryGrid) return;
    
    // Filter books based on current filter
    let filteredBooks = books;
    if (currentFilter === "completed") {
        filteredBooks = books.filter(book => book.generation_status === "completed");
    } else if (currentFilter === "draft") {
        filteredBooks = books.filter(book => book.generation_status !== "completed");
    }
    
    if (filteredBooks.length === 0) {
        libraryGrid.innerHTML = `<div class="col-span-full text-center text-gray-400 py-8">No ${currentFilter === "all" ? "" : currentFilter + " "}books found</div>`;
        return;
    }
    
    const booksHTML = filteredBooks.map(book => {
        const coverImage = book.cover_image ? 
            `/static/uploads/${book.cover_image}` : 
            generateBookCoverDataURL(book.title || "Untitled");
            
        const chapterCount = Array.isArray(book.chapters) ? book.chapters.length : (book.chapters || 0);
        const createdDate = book.created_date ? 
            new Date(book.created_date).toLocaleDateString() : 
            "Unknown date";
            
        const statusColor = book.generation_status === "completed" ? "text-green-400" : 
                           book.generation_status === "generating" ? "text-yellow-400" : "text-gray-400";
        const statusIcon = book.generation_status === "completed" ? "✓" : 
                          book.generation_status === "generating" ? "⟳" : "○";
        const statusText = book.generation_status === "completed" ? "Complete" : 
                          book.generation_status === "generating" ? "Generating" : "Draft";
        
        return `
            <div class="group bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer" 
                 onclick="openBook('${book.filename.replace('.json', '')}')">
                <div class="aspect-[3/4] relative overflow-hidden">
                    <img src="${coverImage}" alt="${book.title || "Untitled"}" 
                         class="w-full h-full object-cover" 
                         onerror="this.src='${generateBookCoverDataURL(book.title || "Untitled")}'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <!-- Status Badge -->
                    <div class="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${statusColor} bg-black/30">
                        ${statusIcon} ${statusText}
                    </div>
                    
                    <!-- Hover Actions -->
                    <div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="flex space-x-2">
                            <button onclick="event.stopPropagation(); openBook('${book.filename.replace('.json', '')}')" 
                                    class="flex-1 bg-blue-600/80 backdrop-blur text-white py-2 px-3 rounded-lg text-sm text-center hover:bg-blue-700/80 transition-colors">
                                <i data-feather="eye" class="w-4 h-4 inline mr-1"></i>View
                            </button>
                            <button onclick="event.stopPropagation(); previewBook('${book.filename.replace('.json', '')}')" 
                                    class="flex-1 bg-green-600/80 backdrop-blur text-white py-2 px-3 rounded-lg text-sm text-center hover:bg-green-700/80 transition-colors">
                                <i data-feather="book-open" class="w-4 h-4 inline mr-1"></i>Preview
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="p-4">
                    <h3 class="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        ${book.title || "Untitled Book"}
                    </h3>
                    
                    <p class="text-black text-sm mb-3 line-clamp-2">
                        ${book.topic || book.description || "No description available"}
                    </p>
                    
                    <div class="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span class="flex items-center">
                            <i data-feather="file-text" class="w-3 h-3 mr-1"></i>
                            ${chapterCount} chapters
                        </span>
                        <span class="flex items-center">
                            <i data-feather="globe" class="w-3 h-3 mr-1"></i>
                            ${book.language || "English"}
                        </span>
                    </div>
                    
                    <div class="flex justify-between items-center text-xs mb-4">
                        <span class="text-gray-500">${createdDate}</span>
                        <span class="text-gray-400">${book.style || "Professional"} style</span>
                    </div>
                    
                    <!-- Bottom Action Buttons -->
                    <div class="flex space-x-2 mt-auto">
                        <button onclick="event.stopPropagation(); editBook('${book.filename.replace('.json', '')}')" 
                                class="flex-1 bg-orange-600/80 backdrop-blur text-white py-2 px-3 rounded-lg text-sm text-center hover:bg-orange-700/80 transition-colors">
                            <i data-feather="edit" class="w-3 h-3 inline mr-1"></i>Edit
                        </button>
                        <button onclick="event.stopPropagation(); deleteBook('${book.filename.replace('.json', '')}', '${(book.title || 'Untitled Book').replace(/'/g, '\\\'')}')" 
                                class="flex-1 bg-red-600/80 backdrop-blur text-white py-2 px-3 rounded-lg text-sm text-center hover:bg-red-700/80 transition-colors">
                            <i data-feather="trash-2" class="w-3 h-3 inline mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
    
    libraryGrid.innerHTML = booksHTML;
    
    // Re-initialize feather icons
    if (typeof feather !== "undefined") {
        feather.replace();
    }
}

function filterBooks(filter) {
    currentFilter = filter;
    
    // Update filter button styles
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active", "bg-blue-600", "text-white", "bg-green-600", "bg-yellow-600");
        btn.classList.add("bg-white/20", "text-gray-300");
    });
    
    const activeBtn = document.querySelector(`button[data-filter="${filter}"]`);
    if (activeBtn) {
        activeBtn.classList.remove("bg-white/20", "text-gray-300");
        if (filter === "completed") {
            activeBtn.classList.add("bg-green-600", "text-white");
        } else if (filter === "draft") {
            activeBtn.classList.add("bg-yellow-600", "text-white");
        } else {
            activeBtn.classList.add("active", "bg-blue-600", "text-white");
        }
    }
    
    // Re-fetch and display books with current filter
    fetch("/api/projects")
        .then(response => response.json())
        .then(data => {
            const books = data.projects || [];
            displayBooks(books);
        })
        .catch(error => {
            console.error("Error filtering books:", error);
        });
}

function openBook(projectId) {
    window.location.href = `/project/${projectId}`;
}

function previewBook(projectId) {
    window.location.href = `/book_preview/${projectId}`;
}

function editBook(projectId) {
    window.location.href = `/project/${projectId}`;
}

function deleteBook(projectId, bookTitle) {
    if (confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
        fetch(`/delete_project/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                if (typeof showNotification === 'function') {
                    showNotification('Book deleted successfully', 'success');
                } else {
                    alert('Book deleted successfully');
                }
                // Reload the library to reflect changes
                loadBookLibrary();
            } else {
                if (typeof showNotification === 'function') {
                    showNotification('Failed to delete book', 'error');
                } else {
                    alert('Failed to delete book');
                }
            }
        })
        .catch(error => {
            console.error('Error deleting book:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error deleting book', 'error');
            } else {
                alert('Error deleting book');
            }
        });
    }
}

function generateBookCoverDataURL(title) {
    const colors = [
        ["#667eea", "#764ba2"],
        ["#f093fb", "#f5576c"],
        ["#4facfe", "#00f2fe"],
        ["#43e97b", "#38f9d7"],
        ["#fa709a", "#fee140"]
    ];
    
    const colorPair = colors[Math.floor(Math.random() * colors.length)];
    const displayTitle = title.length > 25 ? title.substring(0, 25) + "..." : title;
    
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colorPair[0]};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${colorPair[1]};stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
            <foreignObject x="20" y="150" width="260" height="100">
                <div xmlns="http://www.w3.org/1999/xhtml" style="
                    color: white; 
                    font-family: Arial, sans-serif; 
                    font-size: 18px; 
                    font-weight: bold; 
                    text-align: center;
                    word-wrap: break-word;
                    line-height: 1.3;
                ">
                    ${displayTitle}
                </div>
            </foreignObject>
        </svg>
    `;
    
    return "data:image/svg+xml," + encodeURIComponent(svg);
}

// Load real writing progress statistics
function loadWritingProgress() {
    fetch('/api/writing_progress')
        .then(response => response.json())
        .then(data => {
            // Update completion percentage and progress bar
            const completionPercentage = data.completion_percentage || 0;
            const completionBar = document.getElementById('completion-bar');
            const completionText = document.getElementById('completion-percentage');
            
            if (completionBar && completionText) {
                completionText.textContent = completionPercentage + '%';
                completionBar.style.width = completionPercentage + '%';
            }
            
            // Update recent activity
            const recentActivityContainer = document.getElementById('recent-activity');
            if (recentActivityContainer) {
                if (data.recent_activity && data.recent_activity.length > 0) {
                    recentActivityContainer.innerHTML = '';
                    data.recent_activity.forEach(activity => {
                        const activityItem = document.createElement('div');
                        activityItem.className = 'flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer';
                        activityItem.innerHTML = `
                            <div class="flex items-center">
                                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <div>
                                    <p class="text-sm text-white font-medium">${activity.project_name}</p>
                                    <p class="text-xs text-gray-400">${activity.action} • ${activity.time_ago}</p>
                                </div>
                            </div>
                            <i data-feather="external-link" class="w-4 h-4 text-gray-400"></i>
                        `;
                        
                        // Add click handler to open project
                        activityItem.addEventListener('click', function() {
                            window.location.href = `/project/${activity.project_id}`;
                        });
                        
                        recentActivityContainer.appendChild(activityItem);
                    });
                    feather.replace(); // Replace feather icons
                } else {
                    recentActivityContainer.innerHTML = `
                        <div class="text-center p-4 bg-white/5 rounded-lg">
                            <i data-feather="book-open" class="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
                            <p class="text-sm text-gray-400">No recent activity</p>
                            <p class="text-xs text-gray-500">Start creating books to see your progress!</p>
                        </div>
                    `;
                    feather.replace();
                }
            }
            
            // Update project count in library section
            const libraryCount = document.getElementById('stats-library-count');
            if (libraryCount) {
                const totalProjects = data.total_projects || 0;
                libraryCount.textContent = `${totalProjects} book${totalProjects !== 1 ? 's' : ''}`;
            }
            
        })
        .catch(error => {
            console.error('Error loading writing progress:', error);
            // Show default empty state
            const recentActivityContainer = document.getElementById('recent-activity');
            if (recentActivityContainer) {
                recentActivityContainer.innerHTML = `
                    <div class="text-center p-4 bg-white/5 rounded-lg">
                        <i data-feather="alert-circle" class="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
                        <p class="text-sm text-gray-400">Unable to load progress</p>
                        <p class="text-xs text-gray-500">Check your connection and try again</p>
                    </div>
                `;
                feather.replace();
            }
        });
}

// Legacy project library count function for compatibility
function updateProjectLibraryCount() {
    // This is now handled by loadWritingProgress()
    console.log('Project library count will be updated by loadWritingProgress()');
}

// Load stats when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateProjectLibraryCount();
    checkAIStatus();
    loadWritingProgress();
    
    // Refresh progress every 30 seconds if user is active
    setInterval(function() {
        if (document.visibilityState === 'visible') {
            loadWritingProgress();
        }
    }, 30000);
});
