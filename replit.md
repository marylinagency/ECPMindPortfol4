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

### 2025-07-20: Integrated AI Generation System with Project Saving
- Built complete standalone AI generation system that integrates with main project system
- Created dedicated generation page (/standalone_generation) with real-time progress tracking
- Implemented dual generation modes: "Generate Chapter Titles" and "Generate Full Book"
- Added automatic project saving to main system with unique project IDs and proper metadata
- Built comprehensive background generation process with status tracking and error handling
- Created seamless redirect to project view after successful generation completion
- Enhanced AI generation with description enhancement, title generation, and content creation
- Added support for both OpenRouter and Gemini AI providers with automatic fallback
- Implemented session-based generation tracking with progress indicators and visual feedback
- Updated homepage AI Generation button to use new integrated system
- Added professional export capabilities (PDF/DOCX) directly from generation interface
- Built complete project management integration maintaining all existing functionality
- Enhanced error handling and user feedback throughout generation process

### 2025-07-20: Complete Manual Editing & DOCX Export System
- Added comprehensive manual editing capabilities for project titles, descriptions, and chapter content
- Implemented click-to-edit functionality with visual hover indicators and edit icons throughout project pages
- Built modal-based content editing system with large textarea for comfortable chapter content modification
- Created JavaScript functions for real-time editing of project titles and descriptions with server updates
- Added backend API routes (/api/update_project and /api/update_chapter) for seamless content updates
- Integrated DOCX export functionality using python-docx library for professional Word document generation
- Built complete DOCX export with proper document structure, title page, table of contents, and formatted chapters
- Added professional document formatting with proper margins, font sizes, and paragraph alignment
- Enhanced project interface with edit icons and hover effects for intuitive content modification
- Removed footer containing "Developed by ECPMind" and promotional content from all pages
- Created responsive editing modals with save/cancel functionality and loading states
- Implemented automatic markdown cleaning in DOCX exports for clean document formatting
- Added chapter numbering and professional styling in exported DOCX documents

### 2025-07-20: Complete Homepage Redesign with Project Gallery
- Completely redesigned homepage from scratch with new modern layout and attractive visual design
- Created professional header section with gradient background, dotted pattern overlay, and centered branding
- Built left sidebar with three main sections: AI Generation, Manual Creation, and Quick Templates
- Added Quick Templates section with Business Guide, Self-Help Book, and Technical Manual templates
- Implemented main projects gallery with 3-column grid layout showing completed books only
- Created vertical rectangular project cards with full cover images (280px height) and gradient overlays
- Added project metadata display including creation date, chapter count, and completion status
- Built interactive project cards with hover effects, scale transformations, and professional styling
- Implemented project action buttons (View and Preview) with gradient styling and hover states
- Added API endpoint /api/projects to fetch all projects with proper sorting and error handling
- Created JavaScript function to dynamically load completed projects with cover images
- Added empty state display for when no completed books exist with call-to-action
- Enhanced project cards with backdrop blur effects, glass morphism, and modern border styling
- Implemented proper image handling with fallback SVG covers for projects without uploaded images
- Added project counter showing total number of completed books in the header

### 2025-07-21: Complete Homepage Overhaul with Charts & Book Library
- Added interactive Chart.js visualizations for total books and chapters statistics on homepage
- Built line chart for books showing growth trend over time with emerald green styling
- Built bar chart for chapters displaying weekly writing activity with cyan blue styling
- Implemented comprehensive "Your Book Library" section displaying all books in system
- Created responsive grid layout (2-4 columns) with professional book card design
- Added filtering system with All/Completed/Draft options for library organization
- Built hover effects revealing View and Preview action buttons on book cards
- Added status badges showing completion status with color-coded indicators
- Implemented dynamic book cover generation for books without uploaded images
- Created empty state display encouraging first book creation when library is empty
- Enhanced book cards with metadata including chapter count, language, creation date, and style
- Added library counter showing total number of books in collection
- Integrated click-to-open functionality directing to project view or book preview pages

### 2025-07-21: Enhanced AI Integration & Mood Tracker  
- Updated Gemini AI integration to use new google-genai library instead of deprecated google-generativeai
- Fixed all Gemini API calls to use centralized generate_with_gemini function with proper error handling
- Enhanced AI provider system with better fallback mechanisms and comprehensive status checking

### 2025-07-21: Enhanced Manual Creation with AI/Manual Options
- Added Book Title field to Manual Creation form for clearer project identification
- Implemented flexible generation options allowing users to choose AI or manual methods for:
  - Chapter titles: AI-generated or manual entry
  - Chapter content: AI-generated or manual entry
- Enhanced manual creation backend to handle new generation methods with intelligent fallbacks
- Added AI chapter title generation function using configured AI providers (OpenRouter/Gemini)
- Built background AI content generation system for mixed manual/AI projects
- Updated both homepage form and JavaScript modal to include new generation options
- Added proper error handling and fallback mechanisms when AI generation fails
- Created seamless user experience allowing combination of manual and AI-assisted content creation
- Enhanced project creation workflow to support hybrid generation approaches
- Fixed JavaScript syntax errors and improved Book Library filtering functionality

### 2025-07-21: Homepage Redesign - Removed Statistics Charts
- Removed total books and total chapters statistics charts from homepage as requested
- Replaced center statistics dashboard with clean welcome message and AI status overview
- Added new AI provider status card showing current configured provider (OpenRouter/Gemini)
- Added library counter showing total number of books in user's collection
- Removed Chart.js chart initialization and data loading functions from JavaScript
- Updated homepage layout to focus on essential features and quick actions
- Simplified homepage statistics to show only relevant information: AI status and library count
- Enhanced homepage with cleaner, more focused design prioritizing book creation actions
- Fixed mood tracker redirect from /mood_tracker to /mood-tracker for consistent URL structure
- Added license countdown timer with real-time updates showing days:hours:minutes:seconds until expiration
- Implemented visual warning system (red under 7 days, yellow under 30 days) for license expiration
- Enhanced homepage dashboard with comprehensive project statistics and recent activity tracking
- Fixed session handling issues in standalone AI generation with proper error checking
- Added missing API endpoints for project management and statistics tracking
- Updated default configuration to include 90-day license demo for testing purposes

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