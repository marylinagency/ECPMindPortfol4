import os
import json
import uuid
import hashlib
import requests
import threading
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify, send_file
from werkzeug.utils import secure_filename
from werkzeug.middleware.proxy_fix import ProxyFix
import weasyprint
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "bookgenpro-secret-key-2025")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configuration
UPLOAD_FOLDER = 'uploads'
PROJECTS_FOLDER = 'projects'
EXPORTS_FOLDER = 'exports'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

# Create directories if they don't exist
for folder in [UPLOAD_FOLDER, PROJECTS_FOLDER, EXPORTS_FOLDER]:
    os.makedirs(folder, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# License verification settings
API_URL = "https://key.ecertifpro.com/api/activate"
PROTECTION_BYPASS_TOKEN = "3f2a6d8c6f89e4d67a7d4427b9c048ad"
REQUIRED_PRODUCT = "bookgenpro"

def get_machine_id():
    """Generate a unique machine ID"""
    import platform
    import uuid
    try:
        # Try to get a more stable machine identifier
        machine_info = f"{platform.node()}-{platform.system()}-{platform.machine()}"
        # Add UUID for uniqueness if system info is generic
        if not platform.node() or platform.node() == 'localhost':
            machine_info += f"-{uuid.getnode()}"
        return hashlib.md5(machine_info.encode()).hexdigest()
    except:
        # Fallback to a generated UUID based on system info
        return hashlib.md5(f"{platform.system()}-{uuid.getnode()}".encode()).hexdigest()

def load_config():
    """Load configuration from config.json"""
    try:
        with open('config.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Create default config
        default_config = {
            "openrouter_api_key": "",
            "gemini_api_key": "",
            "ai_provider": "openrouter",  # "openrouter" or "gemini"
            "selected_model": "meta-llama/llama-3.2-3b-instruct:free",
            "gemini_model": "gemini-1.5-flash",
            "license_activated": False,
            "license_key": "",
            "email": "",
            "machine_id": get_machine_id()
        }
        save_config(default_config)
        return default_config

def save_config(config):
    """Save configuration to config.json"""
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=2)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def verify_license(license_key, email, machine_id):
    """Verify license with the API"""
    try:
        headers = {
            "x-vercel-protection-bypass": PROTECTION_BYPASS_TOKEN,
            "Content-Type": "application/json"
        }
        data = {
            "license_key": license_key,
            "email": email,
            "machine_id": machine_id
        }
        response = requests.post(API_URL, json=data, headers=headers, timeout=10)
        res_json = response.json()

        if response.status_code == 200 and res_json.get("success"):
            product_name = res_json.get("product_name", "")
            if product_name.lower() == REQUIRED_PRODUCT:
                return True, res_json
            else:
                return False, {"error": f"This license is not for {REQUIRED_PRODUCT}"}
        else:
            return False, res_json
    except Exception as e:
        return False, {"error": str(e)}

def generate_with_openrouter(prompt, api_key, model="openai/gpt-3.5-turbo"):
    """Generate content using OpenRouter API with retry logic and fallback models"""
    import time
    
    # List of free models to try as fallbacks
    free_models = [
        model,  # Try the requested model first
        "microsoft/phi-3-mini-128k-instruct:free",
        "huggingface/CodeLlama-7b-Instruct-hf:free", 
        "openchat/openchat-7b:free",
        "openai/gpt-3.5-turbo"  # Fallback to paid model if available
    ]
    
    for attempt, current_model in enumerate(free_models):
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "model": current_model,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
            
            response = requests.post("https://openrouter.ai/api/v1/chat/completions", 
                                   json=data, headers=headers, timeout=45)
            
            if response.status_code == 200:
                result = response.json()
                if 'choices' in result and len(result['choices']) > 0:
                    return True, result['choices'][0]['message']['content']
                else:
                    return False, f"No content in API response: {result}"
            elif response.status_code == 429:
                # Rate limited, try next model
                logging.warning(f"Rate limited on model {current_model}, trying next...")
                if attempt < len(free_models) - 1:
                    time.sleep(2)  # Brief wait before trying next model
                    continue
                else:
                    return False, f"All models rate limited. Please wait a few minutes and try again."
            else:
                # Other HTTP error, try next model
                logging.warning(f"HTTP {response.status_code} on model {current_model}: {response.text}")
                if attempt < len(free_models) - 1:
                    continue
                else:
                    return False, f"API Error: {response.status_code} - {response.text}"
                    
        except Exception as e:
            logging.error(f"Exception with model {current_model}: {str(e)}")
            if attempt < len(free_models) - 1:
                continue
            else:
                return False, f"Connection error: {str(e)}"
    
    return False, "All retry attempts failed"

def generate_with_gemini(prompt, api_key, model="gemini-1.5-flash"):
    """Generate content using Google Gemini API"""
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 1,
                "topP": 1,
                "maxOutputTokens": 4096,
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }
        
        response = requests.post(url, json=data, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                candidate = result['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    return True, candidate['content']['parts'][0]['text']
                else:
                    return False, f"No content in Gemini response: {result}"
            else:
                return False, f"No candidates in Gemini response: {result}"
        else:
            return False, f"Gemini API Error: {response.status_code} - {response.text}"
            
    except Exception as e:
        logging.error(f"Gemini API exception: {str(e)}")
        return False, f"Gemini connection error: {str(e)}"

def generate_content(prompt, config):
    """Generate content using the selected AI provider"""
    ai_provider = config.get('ai_provider', 'openrouter')
    
    if ai_provider == 'gemini':
        api_key = config.get('gemini_api_key', '')
        model = config.get('gemini_model', 'gemini-1.5-flash')
        if not api_key:
            return False, "Gemini API key not configured"
        return generate_with_gemini(prompt, api_key, model)
    else:
        # Default to OpenRouter
        api_key = config.get('openrouter_api_key', '')
        model = config.get('selected_model', 'meta-llama/llama-3.2-3b-instruct:free')
        if not api_key:
            return False, "OpenRouter API key not configured"
        return generate_with_openrouter(prompt, api_key, model)

@app.route('/')
def index():
    config = load_config()
    
    # Check if license is activated
    if not config.get('license_activated', False):
        return render_template('index.html', show_license=True, config=config)
    
    # Get recent projects
    recent_projects = []
    try:
        for filename in os.listdir(PROJECTS_FOLDER):
            if filename.endswith('.json'):
                filepath = os.path.join(PROJECTS_FOLDER, filename)
                with open(filepath, 'r') as f:
                    project = json.load(f)
                    project['filename'] = filename
                    recent_projects.append(project)
        recent_projects.sort(key=lambda x: x.get('last_modified', ''), reverse=True)
        recent_projects = recent_projects[:5]  # Show only 5 recent projects
    except Exception as e:
        logging.error(f"Error loading recent projects: {e}")
    
    return render_template('index.html', config=config, recent_projects=recent_projects)

@app.route('/activate_license', methods=['POST'])
def activate_license():
    license_key = request.form.get('license_key', '').strip()
    email = request.form.get('email', '').strip()
    machine_id = get_machine_id()
    
    if not license_key or not email:
        flash('Please fill in all fields', 'error')
        return redirect(url_for('index'))
    
    success, result = verify_license(license_key, email, machine_id)
    
    if success:
        config = load_config()
        config.update({
            'license_activated': True,
            'license_key': license_key,
            'email': email,
            'license_info': result
        })
        save_config(config)
        flash(f'License activated successfully! License Type: {result.get("license_type", "Unknown")}', 'success')
    else:
        flash(f'License activation failed: {result.get("error", "Unknown error")}', 'error')
    
    return redirect(url_for('index'))

@app.route('/settings')
def settings():
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    return render_template('settings.html', config=config)

@app.route('/save_settings', methods=['POST'])
def save_settings():
    config = load_config()
    config['ai_provider'] = request.form.get('ai_provider', 'openrouter')
    config['openrouter_api_key'] = request.form.get('openrouter_api_key', '')
    config['gemini_api_key'] = request.form.get('gemini_api_key', '')
    config['selected_model'] = request.form.get('model', 'meta-llama/llama-3.2-3b-instruct:free')
    config['gemini_model'] = request.form.get('gemini_model', 'gemini-1.5-flash')
    save_config(config)
    flash('Settings saved successfully!', 'success')
    return redirect(url_for('settings'))

@app.route('/create_project', methods=['POST'])
def create_project():
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    project_name = request.form.get('project_name', '').strip()
    book_topic = request.form.get('book_topic', '').strip()
    language = request.form.get('language', 'English')
    num_chapters = int(request.form.get('num_chapters', 10))
    
    if not project_name or not book_topic:
        flash('Project name and book topic are required', 'error')
        return redirect(url_for('index'))
    
    # Handle cover image upload
    cover_image = None
    if 'cover_image' in request.files:
        file = request.files['cover_image']
        if file and file.filename and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filename = f"{uuid.uuid4()}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            cover_image = filename
    
    # Create new project
    project_id = str(uuid.uuid4())
    project = {
        'id': project_id,
        'name': project_name,
        'topic': book_topic,
        'language': language,
        'num_chapters': num_chapters,
        'cover_image': cover_image,
        'chapters': [],
        'created_at': datetime.now().isoformat(),
        'last_modified': datetime.now().isoformat(),
        'generation_status': 'pending'
    }
    
    # Save project
    project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
    with open(project_file, 'w') as f:
        json.dump(project, f, indent=2)
    
    return redirect(url_for('project_view', project_id=project_id))

@app.route('/create_ai_book', methods=['POST'])
def create_ai_book():
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    topic = request.form.get('topic', '').strip()
    language = request.form.get('language', 'English')
    chapters = int(request.form.get('chapters', 8))
    style = request.form.get('style', 'professional')
    action = request.form.get('action', 'generate_titles')
    
    if not topic:
        flash('Book topic is required', 'error')
        return redirect(url_for('index'))
    
    # Generate a project name from the topic
    project_name = f"AI Book: {topic[:50]}..."
    
    # Create new project
    project_id = str(uuid.uuid4())
    project = {
        'id': project_id,
        'name': project_name,
        'topic': topic,
        'language': language,
        'num_chapters': chapters,
        'writing_style': style,
        'cover_image': None,
        'chapters': [],
        'created_at': datetime.now().isoformat(),
        'last_modified': datetime.now().isoformat(),
        'generation_status': 'pending',
        'ai_generated': True,
        'generation_action': action
    }
    
    # Save project
    project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
    with open(project_file, 'w') as f:
        json.dump(project, f, indent=2)
    
    # Start generation based on action
    if action in ['generate_titles', 'generate_full']:
        return redirect(url_for('generate_chapters', project_id=project_id))
    
    return redirect(url_for('project_view', project_id=project_id))

@app.route('/project/<project_id>')
def project_view(project_id):
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        return render_template('project.html', project=project, config=config)
    except FileNotFoundError:
        flash('Project not found', 'error')
        return redirect(url_for('index'))

@app.route('/project/<project_id>/upload_cover', methods=['POST'])
def upload_project_cover(project_id):
    """Upload or update cover image for existing project"""
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        if 'cover_image' not in request.files:
            flash('No file selected', 'error')
            return redirect(url_for('project_view', project_id=project_id))
        
        file = request.files['cover_image']
        if file.filename == '':
            flash('No file selected', 'error')
            return redirect(url_for('project_view', project_id=project_id))
        
        if file and allowed_file(file.filename):
            # Remove old cover image if exists
            if project.get('cover_image'):
                old_cover_path = os.path.join(UPLOAD_FOLDER, project['cover_image'])
                if os.path.exists(old_cover_path):
                    os.remove(old_cover_path)
            
            # Save new cover image
            filename = secure_filename(file.filename)
            filename = f"{project_id}_{filename}"
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            
            # Resize image if needed
            try:
                with Image.open(file_path) as img:
                    # Convert to RGB if necessary
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img = img.convert('RGB')
                    
                    # Resize to reasonable dimensions while maintaining aspect ratio
                    img.thumbnail((800, 1200), Image.Resampling.LANCZOS)
                    img.save(file_path, 'JPEG', quality=85)
                    
            except Exception as e:
                flash(f'Error processing image: {str(e)}', 'error')
                return redirect(url_for('project_view', project_id=project_id))
            
            # Update project data
            project['cover_image'] = filename
            project['last_modified'] = datetime.now().isoformat()
            
            with open(project_file, 'w') as f:
                json.dump(project, f, indent=2)
            
            flash('Cover image updated successfully!', 'success')
        else:
            flash('Invalid file type. Please upload an image file.', 'error')
        
        return redirect(url_for('project_view', project_id=project_id))
        
    except Exception as e:
        flash(f'Error updating cover image: {str(e)}', 'error')
        return redirect(url_for('project_view', project_id=project_id))

@app.route('/project/<project_id>/preview')
def book_preview(project_id):
    """Live book preview with real-time editing"""
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        return render_template('book_preview.html', project=project, config=config)
    except FileNotFoundError:
        flash('Project not found', 'error')
        return redirect(url_for('index'))

@app.route('/api/update_project/<project_id>', methods=['POST'])
def update_project_content(project_id):
    """Update project content via AJAX"""
    config = load_config()
    if not config.get('license_activated', False):
        return jsonify({'success': False, 'message': 'License not activated'})
    
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        edit_type = request.form.get('editType')
        
        if edit_type == 'cover':
            project['name'] = request.form.get('name', project['name'])
            project['topic'] = request.form.get('topic', project['topic'])
        elif edit_type == 'chapter':
            chapter_index = int(request.form.get('chapterIndex'))
            if 0 <= chapter_index < len(project.get('chapters', [])):
                project['chapters'][chapter_index]['title'] = request.form.get('title')
                project['chapters'][chapter_index]['content'] = request.form.get('content')
        
        project['last_modified'] = datetime.now().isoformat()
        
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        return jsonify({'success': True, 'message': 'Project updated successfully'})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/generate_chapters/<project_id>')
def generate_chapters(project_id):
    config = load_config()
    ai_provider = config.get('ai_provider', 'openrouter')
    
    # Check if the selected AI provider has API key configured
    if ai_provider == 'gemini':
        api_key = config.get('gemini_api_key', '')
        if not api_key:
            flash('Please configure your Gemini API key in settings', 'error')
            return redirect(url_for('project_view', project_id=project_id))
    else:
        api_key = config.get('openrouter_api_key', '')
        if not api_key:
            flash('Please configure your OpenRouter API key in settings', 'error')
            return redirect(url_for('project_view', project_id=project_id))
    
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        # Start background generation
        thread = threading.Thread(target=generate_chapters_background, 
                                args=(project_id, project, config))
        thread.daemon = True
        thread.start()
        
        flash('Chapter generation started! Please wait...', 'info')
        return redirect(url_for('project_view', project_id=project_id))
        
    except Exception as e:
        flash(f'Error starting generation: {str(e)}', 'error')
        return redirect(url_for('project_view', project_id=project_id))

def generate_chapters_background(project_id, project, config):
    """Background task to generate chapters"""
    project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
    try:
        # Update status
        project['generation_status'] = 'generating_titles'
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        # Generate chapter titles
        titles_prompt = f"""Generate {project['num_chapters']} compelling chapter titles for a book about "{project['topic']}" in {project['language']}. 
        Return only the titles, one per line, numbered from 1 to {project['num_chapters']}."""
        
        success, titles_result = generate_content(titles_prompt, config)
        
        if not success:
            project['generation_status'] = f'error: {titles_result}'
            with open(project_file, 'w') as f:
                json.dump(project, f, indent=2)
            return
        
        # Parse chapter titles
        titles = []
        for line in titles_result.strip().split('\n'):
            line = line.strip()
            if line and ('.' in line or ':' in line):
                # Remove numbering
                title = line.split('.', 1)[-1].split(':', 1)[-1].strip()
                if title:
                    titles.append(title)
        
        if len(titles) < project['num_chapters']:
            # Fill missing titles
            for i in range(len(titles), project['num_chapters']):
                titles.append(f"Chapter {i+1}")
        
        # Initialize chapters
        project['chapters'] = []
        for i, title in enumerate(titles[:project['num_chapters']]):
            project['chapters'].append({
                'id': str(uuid.uuid4()),
                'number': i + 1,
                'title': title,
                'content': '',
                'status': 'pending'
            })
        
        project['generation_status'] = 'generating_content'
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        # Generate content for each chapter
        for i, chapter in enumerate(project['chapters']):
            chapter['status'] = 'generating'
            with open(project_file, 'w') as f:
                json.dump(project, f, indent=2)
            
            content_prompt = f"""Write comprehensive, professional content for Chapter {chapter['number']}: "{chapter['title']}" 
            for a book about "{project['topic']}" in {project['language']}. 

            IMPORTANT FORMATTING REQUIREMENTS:
            - Write in clean, professional prose suitable for Amazon KDP publishing
            - Do NOT use any Markdown formatting (no ##, ###, **, *, _, etc.)
            - Use proper paragraph breaks for readability
            - Write section headings as regular text with proper capitalization
            - The content should be detailed, engaging, and approximately 1000-1500 words
            - Use professional book formatting with clear paragraph structure
            - No bullet points with asterisks - use proper paragraph flow instead
            
            Create content that flows naturally like a professionally published book."""
            
            success, content_result = generate_content(content_prompt, config)
            
            if success:
                # Clean markdown formatting from generated content
                import re
                clean_content = content_result.strip()
                # Remove markdown headers
                clean_content = re.sub(r'^#{1,6}\s+', '', clean_content, flags=re.MULTILINE)
                # Remove bold/italic markers
                clean_content = re.sub(r'\*{1,2}([^*]+)\*{1,2}', r'\1', clean_content)
                clean_content = re.sub(r'_{1,2}([^_]+)_{1,2}', r'\1', clean_content)
                # Remove bullet point markers
                clean_content = re.sub(r'^\*\s+', '', clean_content, flags=re.MULTILINE)
                clean_content = re.sub(r'^\-\s+', '', clean_content, flags=re.MULTILINE)
                
                chapter['content'] = clean_content
                chapter['status'] = 'completed'
            else:
                chapter['content'] = f"Error generating content: {content_result}"
                chapter['status'] = 'error'
            
            with open(project_file, 'w') as f:
                json.dump(project, f, indent=2)
        
        # Mark as completed
        project['generation_status'] = 'completed'
        project['last_modified'] = datetime.now().isoformat()
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
            
    except Exception as e:
        project['generation_status'] = f'error: {str(e)}'
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)

@app.route('/api/project_status/<project_id>')
def project_status(project_id):
    """Get project generation status via AJAX"""
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        completed_chapters = len([c for c in project.get('chapters', []) if c.get('status') == 'completed'])
        total_chapters = len(project.get('chapters', []))
        
        return jsonify({
            'status': project.get('generation_status', 'pending'),
            'chapters': project.get('chapters', []),
            'progress': (completed_chapters / max(total_chapters, 1) * 100) if total_chapters > 0 else 0,
            'completed_chapters': completed_chapters,
            'total_chapters': total_chapters
        })
    except FileNotFoundError:
        return jsonify({'status': 'error', 'message': 'Project not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/regenerate_chapter/<project_id>/<chapter_id>')
def regenerate_chapter(project_id, chapter_id):
    """Regenerate a specific chapter"""
    config = load_config()
    ai_provider = config.get('ai_provider', 'openrouter')
    
    # Check if the selected AI provider has API key configured
    if ai_provider == 'gemini':
        api_key = config.get('gemini_api_key', '')
        if not api_key:
            flash('Please configure your Gemini API key in settings', 'error')
            return redirect(url_for('project_view', project_id=project_id))
    else:
        api_key = config.get('openrouter_api_key', '')
        if not api_key:
            flash('Please configure your OpenRouter API key in settings', 'error')
            return redirect(url_for('project_view', project_id=project_id))
    
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        # Find the chapter
        chapter = None
        for c in project['chapters']:
            if c['id'] == chapter_id:
                chapter = c
                break
        
        if not chapter:
            flash('Chapter not found', 'error')
            return redirect(url_for('project_view', project_id=project_id))
        
        # Start background regeneration
        thread = threading.Thread(target=regenerate_single_chapter, 
                                args=(project_id, chapter_id, project, config))
        thread.daemon = True
        thread.start()
        
        flash(f'Chapter "{chapter["title"]}" regeneration started!', 'info')
        return redirect(url_for('project_view', project_id=project_id))
        
    except Exception as e:
        flash(f'Error starting regeneration: {str(e)}', 'error')
        return redirect(url_for('project_view', project_id=project_id))

def regenerate_single_chapter(project_id, chapter_id, project, config):
    """Background task to regenerate a single chapter"""
    project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
    
    try:
        # Find and update the chapter
        for chapter in project['chapters']:
            if chapter['id'] == chapter_id:
                chapter['status'] = 'generating'
                with open(project_file, 'w') as f:
                    json.dump(project, f, indent=2)
                
                content_prompt = f"""Write comprehensive content for Chapter {chapter['number']}: "{chapter['title']}" 
                for a book about "{project['topic']}" in {project['language']}. 
                The content should be detailed, engaging, and approximately 1000-1500 words. 
                Use proper formatting with paragraphs and sections where appropriate."""
                
                success, content_result = generate_content(content_prompt, config)
                
                if success:
                    chapter['content'] = content_result.strip()
                    chapter['status'] = 'completed'
                else:
                    chapter['content'] = f"Error generating content: {content_result}"
                    chapter['status'] = 'error'
                
                project['last_modified'] = datetime.now().isoformat()
                with open(project_file, 'w') as f:
                    json.dump(project, f, indent=2)
                break
                
    except Exception as e:
        # Update chapter with error
        for chapter in project['chapters']:
            if chapter['id'] == chapter_id:
                chapter['status'] = 'error'
                chapter['content'] = f"Error: {str(e)}"
                with open(project_file, 'w') as f:
                    json.dump(project, f, indent=2)
                break

@app.route('/edit_chapter/<project_id>/<chapter_id>', methods=['POST'])
def edit_chapter(project_id, chapter_id):
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        new_title = request.form.get('title', '').strip()
        new_content = request.form.get('content', '').strip()
        
        # Find and update chapter
        for chapter in project['chapters']:
            if chapter['id'] == chapter_id:
                chapter['title'] = new_title
                chapter['content'] = new_content
                break
        
        project['last_modified'] = datetime.now().isoformat()
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        flash('Chapter updated successfully!', 'success')
        return redirect(url_for('project_view', project_id=project_id))
        
    except Exception as e:
        flash(f'Error updating chapter: {str(e)}', 'error')
        return redirect(url_for('project_view', project_id=project_id))

@app.route('/export_pdf/<project_id>')
def export_pdf(project_id):
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        # Generate HTML content
        html_content = render_template('book_export.html', project=project)
        
        # Fix relative URLs to absolute paths for PDF generation
        current_dir = os.path.dirname(os.path.abspath(__file__))
        static_path = os.path.join(current_dir, 'static', 'uploads')
        html_content = html_content.replace('/static/uploads/', f'file://{static_path}/')
        
        # Convert to PDF
        pdf_filename = f"{project['name']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = os.path.join(EXPORTS_FOLDER, pdf_filename)
        
        weasyprint.HTML(string=html_content, base_url=request.url_root).write_pdf(pdf_path)
        
        return send_file(pdf_path, as_attachment=True, download_name=pdf_filename)
        
    except Exception as e:
        flash(f'Error exporting PDF: {str(e)}', 'error')
        return redirect(url_for('project_view', project_id=project_id))

@app.route('/save_chapter/<chapter_id>', methods=['POST'])
def save_chapter_content(chapter_id):
    """Save edited chapter content and title via API"""
    try:
        data = request.get_json()
        content = data.get('content', '')
        title = data.get('title', '')
        
        # Find the project containing this chapter
        for filename in os.listdir(PROJECTS_FOLDER):
            if filename.endswith('.json'):
                project_file = os.path.join(PROJECTS_FOLDER, filename)
                with open(project_file, 'r') as f:
                    project = json.load(f)
                
                # Find and update the chapter
                for chapter in project.get('chapters', []):
                    if chapter['id'] == chapter_id:
                        chapter['content'] = content
                        if title:
                            chapter['title'] = title
                        project['last_modified'] = datetime.now().isoformat()
                        
                        with open(project_file, 'w') as f:
                            json.dump(project, f, indent=2)
                        
                        return jsonify({'success': True})
        
        return jsonify({'success': False, 'message': 'Chapter not found'}), 404
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500



@app.route('/check_generation_status/<project_id>')
def check_generation_status(project_id):
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        return jsonify({
            'status': project.get('generation_status', 'unknown'),
            'chapters': len(project.get('chapters', [])),
            'completed_chapters': len([c for c in project.get('chapters', []) if c.get('status') == 'completed'])
        })
    except:
        return jsonify({'status': 'error'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
