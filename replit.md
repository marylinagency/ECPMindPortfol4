# BookGenPro - AI-Powered Book Generation Platform

## Overview

BookGenPro is a Flask-based web application that enables users to generate complete books using AI through the OpenRouter API. The application features a modern web interface with Tailwind CSS styling, project management capabilities, and PDF/HTML export functionality with a licensing system for product activation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Traditional server-side rendered Flask templates with Jinja2
- **Styling**: Tailwind CSS for responsive design with custom CSS for animations
- **JavaScript**: Vanilla JavaScript for client-side interactions, real-time status updates, and UI enhancements
- **UI Components**: Custom animated backgrounds, status badges, form validation, and tooltips

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Structure**: Single-file application architecture with modular template system
- **Session Management**: Flask sessions with configurable secret key
- **File Handling**: Werkzeug for secure file uploads with size limits (16MB)
- **PDF Generation**: WeasyPrint for HTML-to-PDF conversion
- **Image Processing**: PIL (Python Imaging Library) for cover image handling

### Authentication & Authorization
- **Licensing System**: External API-based license validation
- **Machine ID**: Hardware-based fingerprinting for license binding
- **Session-based**: Flask session management for user state
- **API Protection**: Custom bypass tokens for external service communication

## Key Components

### Core Features
1. **AI Book Generation**: Multi-language book creation using OpenRouter API
2. **Project Management**: Create, save, load, and manage book projects
3. **Chapter Editing**: Manual and AI-assisted chapter content editing
4. **Cover Image Support**: Upload and manage book cover images
5. **Export System**: PDF and HTML export with professional styling

### File Structure
- `app.py`: Main Flask application with all routes and business logic
- `main.py`: Application entry point for development server
- `config.json`: Configuration storage for API keys and settings
- `templates/`: Jinja2 templates for all pages (base, index, project, settings, export)
- `static/`: CSS, JavaScript, and static assets
- `uploads/`: User-uploaded cover images
- `projects/`: Serialized project data storage
- `exports/`: Generated PDF and HTML files

### Template System
- **Base Template**: Common layout with navigation, animated background, and responsive design
- **Modular Pages**: Specialized templates for different functionality areas
- **Export Template**: Professional book formatting for PDF generation

## Data Flow

### Project Creation Flow
1. User creates new project with topic, language, and chapter count
2. Optional cover image upload and processing
3. Project metadata saved to JSON file in projects folder
4. AI generation initiated through OpenRouter API

### Content Generation Flow
1. Chapter titles generated first using AI API
2. Individual chapter content generated sequentially
3. Real-time status updates via AJAX polling
4. Generated content stored in project data structure

### Export Flow
1. Project data rendered using export template
2. HTML styling applied with embedded CSS
3. WeasyPrint converts HTML to PDF with proper formatting
4. Generated files stored in exports folder for download

## External Dependencies

### AI Services
- **OpenRouter API**: Primary AI service for content generation
- **Model Support**: Multiple AI models (GPT-3.5-turbo, etc.) with user selection

### Licensing Service
- **External API**: `https://key.ecertifpro.com/api/activate`
- **Product Validation**: Machine ID-based license verification
- **Protection Bypass**: Custom token system for API access

### Frontend Libraries
- **Tailwind CSS**: CDN-based responsive styling framework
- **Feather Icons**: Icon library for consistent UI elements
- **Google Fonts**: Typography enhancement for export formatting

### Python Dependencies
- **Flask**: Web framework and templating
- **Werkzeug**: File handling and security utilities
- **WeasyPrint**: HTML-to-PDF conversion engine
- **PIL**: Image processing for cover images
- **Requests**: HTTP client for external API calls

## Deployment Strategy

### Development Setup
- **Entry Point**: `main.py` runs Flask development server
- **Host Configuration**: Binds to `0.0.0.0:5000` for external access
- **Debug Mode**: Enabled for development with detailed error reporting

### Production Considerations
- **WSGI**: Application configured with ProxyFix middleware
- **Session Security**: Environment variable for session secret key
- **File Storage**: Local filesystem for projects and uploads
- **Logging**: Configurable logging level for debugging

### Scalability Notes
- Current architecture uses file-based storage for projects
- Session data stored in Flask sessions (server-side)
- Upload and export folders require persistent storage
- API rate limiting may be needed for OpenRouter integration

### Security Features
- **File Upload Validation**: Restricted file types and size limits
- **Filename Security**: Werkzeug secure_filename for uploaded files
- **License Verification**: Machine ID binding prevents license sharing
- **Session Management**: Secure session handling with configurable keys

## Recent Changes: Latest modifications with dates

### 2025-07-20: Complete Writing Mood Tracker Implementation
- Built comprehensive mood tracking system with 5 emotional states (Excited, Focused, Creative, Tired, Blocked)
- Added interactive mood selection interface with animated emoji buttons and visual feedback
- Created backend API routes for saving daily moods and retrieving 30-day mood history
- Implemented mood data persistence using JSON file storage with date-based organization
- Added optional note functionality for detailed mood tracking and context
- Built mood history visualization with horizontal scrolling timeline and today highlighting
- Created automatic mood history loading on page initialization with error handling
- Added visual mood indicators with appropriate emojis and responsive design
- Integrated smooth animations and hover effects for enhanced user experience
- Fixed JavaScript errors by implementing all required mood tracker functions
- Built project-specific mood tracking with individual project mood history storage
- Added dedicated project mood tracker UI in project pages with tailored styling
- Created separate API endpoints for project-specific mood data management
- Enhanced project view with personalized writing mood tracking per book project
- Removed duplicate mood tracker implementations and consolidated into single enhanced version
- Expanded mood options from 5 to 8 emotions (excited, focused, creative, motivated, inspired, tired, blocked, stressed)
- Added dynamic mood streak counter that changes colors based on consecutive days (pink < 3, blue 3-6, green 7+)
- Implemented responsive grid layout that adapts to different screen sizes (3 cols mobile, 5 tablet, 8 desktop)
- Enhanced mood history visualization with proper emoji mapping and improved tooltips
- Integrated mood tracking into AI book generation and manual book creation forms
- Added generation mood storage to both project creation workflows with backend data persistence
- Enhanced recent projects display with improved cover image handling and hover effects
- Fixed cover image paths and added professional gradient overlays for better visual presentation

### 2025-07-20: Enhanced AI Provider Management & Manual Generation System
- Added comprehensive AI provider status display on main page with real-time configuration checking
- Implemented dynamic provider status updates showing green/red indicators and current model information
- Created complete manual book generation system with expandable form interface
- Added manual project creation route with customizable chapter structure and professional settings
- Enhanced settings page with improved dual AI provider setup guides (OpenRouter + Gemini)
- Built real-time provider status checking API endpoint for seamless user experience
- Updated API usage guidelines with detailed setup instructions, cost management tips, and quality recommendations
- Added professional gradient card design for both OpenRouter and Gemini configuration sections
- Integrated expandable manual creation form with smooth animations and validation
- Enhanced JavaScript form handling with better error messages and provider-specific validation

### 2025-07-20: AI-Powered Author Bio Enhancement System
- Added comprehensive AI author bio enhancement feature in settings page using Gemini or OpenRouter
- Implemented professional bio generator with multiple style options (professional, conversational, academic, creative)
- Added configurable bio length options (short, medium, long) for different use cases
- Created seamless integration between settings enhancement and project creation forms
- Added auto-populate functionality to load enhanced bios into both AI and manual creation forms
- Built copy-to-clipboard and "Use Bio" functionality with visual feedback and notifications
- Enhanced settings page with beautiful gradient UI and professional bio generation interface
- Integrated with existing dual AI provider system supporting both Gemini and OpenRouter APIs
- Added real-time bio enhancement with loading states and error handling
- Created session storage system to transfer enhanced bios between pages

### 2025-07-20: Enhanced Book Generation & Author Bio System  
- Added comprehensive description enhancement step before chapter title generation
- Implemented author bio field in book creation form for professional author information
- Enhanced chapter title generation using AI-analyzed enhanced descriptions for better context
- Added author bio section in book exports with professional formatting and page breaks
- Improved cover page with full-screen background image support in exports
- Enhanced content generation prompts to use enhanced descriptions for consistent quality
- Updated JavaScript status tracking to include new "enhancing_description" stage
- Added proper author bio display in exported PDFs with dedicated "About the Author" page
- Enhanced book export footer to indicate when author bio is included

### 2025-07-20: Modern UI Transformation with Sliding Animations
- Completely redesigned background with modern sliding gradient animations using clear colors
- Implemented glass morphism effects with enhanced backdrop blur and transparency
- Added comprehensive sliding animations (slide-in-left, slide-in-right, slide-in-up, slide-in-down)
- Created modern button effects with shimmer animations and hover transformations  
- Enhanced glass cards with animated shine effects and 3D hover interactions
- Built staggered animation system with customizable delays for smooth content reveals
- Added pulse glow effects for important interactive elements
- Integrated clear color gradients (blue, purple, cyan, emerald, amber, red) for better visibility
- Enhanced navigation with animated underline effects and smooth transitions
- Implemented floating light effects and shimmer overlays on the animated background

### 2025-07-20: Complete Chapter Viewing & Editing System
- Added comprehensive chapter viewing capabilities with full-screen modal display
- Implemented inline chapter editing with title and content modification
- Created dedicated book preview page with professional formatting and table of contents
- Added edit mode toggle for safe content modification in preview mode
- Built modal-based editing system with real-time save functionality
- Enhanced project view with "View Full Chapter" buttons for expanded content access
- Integrated print-friendly styling for book preview with proper page breaks
- Added visual edit overlays and hover effects for intuitive editing experience
- Implemented smooth scrolling navigation between chapters in preview mode
- Created comprehensive export functionality with PDF generation capabilities

### 2025-07-20: Stable UI & Auto-Refresh Fix
- Fixed automatic page refresh issue on completed projects 
- Prevented unnecessary polling for completed generation status
- Added stable UI state management to avoid constant reloading
- Enhanced JavaScript error handling with null checks
- Created clean project view without disruptive auto-refresh behavior
- Improved user experience with stable interface for completed books

### 2025-07-20: Dual AI Provider Integration with Status System  
- Added Google Gemini API integration as alternative to OpenRouter
- Implemented dual AI provider system with automatic fallback for rate limits
- Added provider selection in settings page with dynamic configuration sections
- Created header status indicator showing current AI provider configuration (green/red dots)
- Removed Configuration card from homepage for cleaner interface design
- Fixed critical bugs: division by zero in progress, file path security, LSP errors
- Enhanced error handling with improved retry logic and user feedback
- Added comprehensive provider switching functionality with real-time status updates
- Set up automatic failover system to handle rate limiting across providers

### 2025-07-20: Dynamic Real-Time Book Preview System
- Implemented comprehensive live book preview with page-by-page navigation
- Created interactive zoom controls (50% - 200%) with smooth scaling animations
- Added professional page layout with Amazon KDP 6"x9" format and proper margins
- Built real-time edit mode with click-to-edit functionality on any book element
- Integrated auto-save system with visual indicators and change tracking
- Added live word count, character count, and reading time estimation
- Created smooth page transitions with opacity and scale animations
- Implemented keyboard shortcuts (arrows for pages, Ctrl+E for edit mode, Ctrl+S to save)
- Added touch/swipe support for mobile navigation between pages
- Built comprehensive preview controls panel with quick navigation to cover, TOC, chapters
- Created modal-based editing system with real-time content preview updates
- Added professional book statistics tracking (pages, words, chapters)
- Implemented cover image background integration in live preview
- Built responsive design that works on desktop, tablet, and mobile devices

### 2025-07-20: Professional Amazon KDP Book Export System
- Fixed Markdown formatting removal for clean, professional book content
- Added professional Amazon KDP page sizing (6" x 9") with proper margins
- Implemented automatic page numbering starting from Chapter 1
- Created cover background image integration using uploaded images
- Built clean content export without any Markdown symbols (##, ###, **, *)
- Added professional typography with Crimson Text and Playfair Display fonts
- Implemented proper page breaks and print formatting for PDF generation

### 2025-07-20: Cover Image Management System
- Added hover-to-edit cover image functionality on project pages
- Created seamless cover image upload and replacement system
- Implemented automatic image processing with size optimization
- Built visual feedback system with upload progress and success notifications
- Added default gradient cover for projects without uploaded images
- Integrated cover images as backgrounds in book exports and previews

### 2025-07-20: Complete Dynamic App Transformation
- Transformed static interface into fully dynamic interactive experience
- Added real-time form validation with visual feedback and icons
- Implemented interactive background nodes that respond to mouse movement
- Created dynamic button animations with ripple effects and hover transformations
- Added scroll-triggered animations for smooth content reveals
- Integrated floating action button with quick access menu
- Built real-time notification system with slide animations
- Added dynamic progress bars with color-changing based on completion
- Implemented auto-save functionality with visual indicators
- Created interactive tooltips and hover effects throughout the app
- Added celebration effects (confetti) for completed book generation
- Built connection monitoring with online/offline status updates
- Implemented skeleton loading states for better UX
- Added dynamic modal system with backdrop blur effects
- Created comprehensive help system accessible via floating button
- Enhanced cards with interactive shine effects and 3D transformations
- Added status bar with real-time updates and auto-hide functionality