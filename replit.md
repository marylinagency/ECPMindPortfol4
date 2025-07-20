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