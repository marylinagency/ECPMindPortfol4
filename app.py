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
UPLOAD_FOLDER = 'static/uploads'
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

@app.route('/mood-tracker')
def mood_tracker():
    """Writing Mood Tracker page"""
    config = load_config()
    
    # Check if license is activated
    if not config.get('license_activated', False):
        return redirect(url_for('index'))
    
    return render_template('mood_tracker.html', config=config)

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
    flash('Settings saved successfully! AI provider updated.', 'success')
    return redirect(url_for('settings'))

@app.route('/check_ai_provider_status')
def check_ai_provider_status():
    """Check the current AI provider configuration status"""
    config = load_config()
    ai_provider = config.get('ai_provider', 'openrouter')
    
    if ai_provider == 'gemini':
        api_key = config.get('gemini_api_key', '')
        model = config.get('gemini_model', 'gemini-1.5-flash')
        configured = bool(api_key)
        provider_name = 'Google Gemini'
    else:
        api_key = config.get('openrouter_api_key', '')
        model = config.get('selected_model', 'meta-llama/llama-3.2-3b-instruct:free')
        configured = bool(api_key)
        provider_name = 'OpenRouter'
    
    return jsonify({
        'provider': ai_provider,
        'provider_name': provider_name,
        'model': model,
        'configured': configured,
        'status': 'ready' if configured else 'not_configured'
    })

@app.route('/create_manual_book', methods=['POST'])
def create_manual_book():
    """Create a manual book project"""
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    try:
        # Get form data
        topic = request.form.get('topic', '').strip()
        author_bio = request.form.get('author_bio', '').strip()
        language = request.form.get('language', 'English')
        num_chapters = int(request.form.get('chapters', 8))
        style = request.form.get('style', 'professional')
        generation_mood = request.form.get('generation_mood', '')
        
        if not topic:
            flash('Please provide a book topic', 'error')
            return redirect(url_for('index'))
        
        # Create project
        project_id = str(uuid.uuid4())[:8]
        project = {
            'id': project_id,
            'name': topic[:50] + ('...' if len(topic) > 50 else ''),
            'topic': topic,
            'author_bio': author_bio,
            'language': language,
            'style': style,
            'num_chapters': num_chapters,
            'creation_method': 'manual',
            'generation_status': 'manual',
            'created_at': datetime.now().isoformat(),
            'last_modified': datetime.now().isoformat(),
            'chapters': [],
            'generation_mood': generation_mood,
            'cover_image': None
        }
        
        # Create empty chapters for manual editing
        for i in range(1, num_chapters + 1):
            chapter = {
                'id': str(uuid.uuid4())[:8],
                'number': i,
                'title': f'Chapter {i}',
                'content': f'Content for Chapter {i} - Click to edit and add your own content here.',
                'status': 'manual',
                'word_count': 0
            }
            project['chapters'].append(chapter)
        
        # Save project
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        flash(f'Manual book project "{project["name"]}" created successfully! Start editing chapters.', 'success')
        return redirect(url_for('project_view', project_id=project_id))
        
    except Exception as e:
        flash(f'Error creating manual project: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/save_mood', methods=['POST'])
def save_mood():
    """Save user's writing mood for today"""
    try:
        data = request.get_json()
        mood = data.get('mood')
        note = data.get('note', '')
        
        if not mood:
            return jsonify({'success': False, 'message': 'Mood is required'})
        
        # Load or create mood data
        mood_file = 'mood_data.json'
        try:
            with open(mood_file, 'r') as f:
                mood_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            mood_data = {'moods': []}
        
        # Get today's date
        today = datetime.now().strftime('%Y-%m-%d')
        
        # Check if mood already exists for today
        existing_mood_index = None
        for i, entry in enumerate(mood_data['moods']):
            if entry.get('date') == today:
                existing_mood_index = i
                break
        
        # Create mood entry
        mood_entry = {
            'date': today,
            'mood': mood,
            'note': note,
            'timestamp': datetime.now().isoformat()
        }
        
        # Update or add mood entry
        if existing_mood_index is not None:
            mood_data['moods'][existing_mood_index] = mood_entry
        else:
            mood_data['moods'].append(mood_entry)
        
        # Keep only last 30 days
        mood_data['moods'] = mood_data['moods'][-30:]
        
        # Save mood data
        with open(mood_file, 'w') as f:
            json.dump(mood_data, f, indent=2)
        
        return jsonify({'success': True, 'message': 'Mood saved successfully'})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error saving mood: {str(e)}'})

@app.route('/get_mood_history')
def get_mood_history():
    """Get user's mood history"""
    try:
        mood_file = 'mood_data.json'
        try:
            with open(mood_file, 'r') as f:
                mood_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            mood_data = {'moods': []}
        
        # Sort by date (newest first)
        mood_data['moods'].sort(key=lambda x: x['date'], reverse=True)
        
        return jsonify({'success': True, 'moods': mood_data['moods']})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error loading mood history: {str(e)}'})

@app.route('/project/<project_id>/save_project_mood', methods=['POST'])
def save_project_mood(project_id):
    """Save user's writing mood for specific project"""
    try:
        data = request.get_json()
        mood = data.get('mood')
        note = data.get('note', '')
        
        if not mood:
            return jsonify({'success': False, 'message': 'Mood is required'})
        
        # Load or create project-specific mood data
        mood_file = f'project_{project_id}_mood.json'
        try:
            with open(mood_file, 'r') as f:
                mood_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            mood_data = {'project_id': project_id, 'moods': []}
        
        # Get today's date
        today = datetime.now().strftime('%Y-%m-%d')
        
        # Check if mood already exists for today
        existing_mood_index = None
        for i, entry in enumerate(mood_data['moods']):
            if entry.get('date') == today:
                existing_mood_index = i
                break
        
        # Create mood entry
        mood_entry = {
            'date': today,
            'mood': mood,
            'note': note,
            'timestamp': datetime.now().isoformat(),
            'project_id': project_id
        }
        
        # Update or add mood entry
        if existing_mood_index is not None:
            mood_data['moods'][existing_mood_index] = mood_entry
        else:
            mood_data['moods'].append(mood_entry)
        
        # Keep only last 30 days
        mood_data['moods'] = mood_data['moods'][-30:]
        
        # Save mood data
        with open(mood_file, 'w') as f:
            json.dump(mood_data, f, indent=2)
        
        return jsonify({'success': True, 'message': 'Project mood saved successfully'})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error saving project mood: {str(e)}'})

@app.route('/project/<project_id>/get_project_mood_history')
def get_project_mood_history(project_id):
    """Get project-specific mood history"""
    try:
        mood_file = f'project_{project_id}_mood.json'
        try:
            with open(mood_file, 'r') as f:
                mood_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            mood_data = {'project_id': project_id, 'moods': []}
        
        # Sort by date (newest first)
        mood_data['moods'].sort(key=lambda x: x['date'], reverse=True)
        
        return jsonify({'success': True, 'moods': mood_data['moods'], 'project_id': project_id})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error loading project mood history: {str(e)}'})

@app.route('/create_project', methods=['POST'])
def create_project():
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    project_name = request.form.get('project_name', '').strip()
    book_topic = request.form.get('book_topic', '').strip()
    author_bio = request.form.get('author_bio', '').strip()
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
        'author_bio': author_bio,
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

def enhance_book_title(title, topic, language="English"):
    """Enhance book title using AI"""
    try:
        config = load_config()
        
        prompt = f"""You are a professional book title consultant. Enhance and improve this book title to make it more engaging, marketable, and compelling.

Original Title: "{title}"
Book Topic/Description: {topic}
Target Language: {language}

Guidelines:
- Make it catchy and marketable
- Keep it relevant to the topic
- Consider the target audience
- Add subtitle if beneficial
- Maximum 100 characters total
- Return ONLY the enhanced title, nothing else

Enhanced title:"""

        if config['ai_provider'] == 'gemini' and config.get('gemini_api_key'):
            import google.genai as genai
            client = genai.Client(api_key=config['gemini_api_key'])
            response = client.models.generate_content(
                model=config.get('gemini_model', 'gemini-2.5-flash'),
                contents=prompt
            )
            return response.text.strip() if response.text else title
        
        elif config.get('openrouter_api_key'):
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {config['openrouter_api_key']}"},
                json={
                    "model": config.get('selected_model', 'anthropic/claude-3.5-sonnet:beta'),
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 200
                }
            )
            return response.json()['choices'][0]['message']['content'].strip()
        
        return title
        
    except Exception as e:
        logging.error(f"Error enhancing title: {e}")
        return title

def generate_book_description(title, topic, author_bio="", language="English"):
    """Generate professional book description using AI"""
    try:
        config = load_config()
        
        prompt = f"""You are a professional book marketing copywriter. Create a compelling, professional book description for Amazon KDP and other book platforms.

Book Title: {title}
Topic/Content: {topic}
Author Info: {author_bio if author_bio else "Not provided"}
Language: {language}

Create a description that includes:
1. A compelling hook that grabs attention
2. What readers will learn or gain
3. Target audience
4. Key benefits and outcomes
5. Professional tone suitable for book marketing
6. 150-300 words total

Write in {language}. Return ONLY the book description:"""

        if config['ai_provider'] == 'gemini' and config.get('gemini_api_key'):
            import google.genai as genai
            client = genai.Client(api_key=config['gemini_api_key'])
            response = client.models.generate_content(
                model=config.get('gemini_model', 'gemini-2.5-flash'),
                contents=prompt
            )
            return response.text.strip() if response.text else "Professional book covering essential topics and insights."
        
        elif config.get('openrouter_api_key'):
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {config['openrouter_api_key']}"},
                json={
                    "model": config.get('selected_model', 'anthropic/claude-3.5-sonnet:beta'),
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 500
                }
            )
            return response.json()['choices'][0]['message']['content'].strip()
        
        return "Professional book covering essential topics and insights."
        
    except Exception as e:
        logging.error(f"Error generating description: {e}")
        return "Professional book covering essential topics and insights."

@app.route('/create_ai_book', methods=['POST'])
def create_ai_book():
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    book_title = request.form.get('book_title', '').strip()
    topic = request.form.get('topic', '').strip()
    author_bio = request.form.get('author_bio', '').strip()
    language = request.form.get('language', 'English')
    chapters = int(request.form.get('chapters', 8))
    style = request.form.get('style', 'professional')
    action = request.form.get('action', 'generate_titles')
    generation_mood = request.form.get('generation_mood', '')
    
    if not book_title or not topic:
        flash('Book title and topic are required', 'error')
        return redirect(url_for('index'))
    
    # Enhance the book title using AI
    enhanced_title = enhance_book_title(book_title, topic, language)
    
    # Generate book description using AI
    book_description = generate_book_description(enhanced_title, topic, author_bio, language)
    
    # Use enhanced title as project name
    project_name = enhanced_title[:80]
    
    # Create new project
    project_id = str(uuid.uuid4())
    project = {
        'id': project_id,
        'name': project_name,
        'title': enhanced_title,
        'original_title': book_title,
        'description': book_description,
        'topic': topic,
        'author_bio': author_bio,
        'language': language,
        'num_chapters': chapters,
        'writing_style': style,
        'cover_image': None,
        'chapters': [],
        'created_at': datetime.now().isoformat(),
        'last_modified': datetime.now().isoformat(),
        'generation_status': 'pending',
        'ai_generated': True,
        'generation_action': action,
        'generation_mood': generation_mood
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
        
        if file and file.filename and allowed_file(file.filename):
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

@app.route('/delete_project/<project_id>', methods=['POST', 'DELETE'])
def delete_project(project_id):
    """Delete a project and all its associated files"""
    config = load_config()
    if not config.get('license_activated', False):
        flash('Please activate your license first', 'error')
        return redirect(url_for('index'))
    
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        
        # Load project to get cover image path
        if os.path.exists(project_file):
            with open(project_file, 'r') as f:
                project = json.load(f)
            
            # Remove cover image if it exists
            if project.get('cover_image'):
                cover_path = os.path.join(UPLOAD_FOLDER, project['cover_image'])
                if os.path.exists(cover_path):
                    os.remove(cover_path)
            
            # Remove project file
            os.remove(project_file)
            
            flash('Project deleted successfully!', 'success')
        else:
            flash('Project not found', 'error')
            
    except Exception as e:
        flash(f'Error deleting project: {str(e)}', 'error')
    
    return redirect(url_for('index'))

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
            chapter_index_str = request.form.get('chapterIndex')
            if chapter_index_str is not None:
                chapter_index = int(chapter_index_str)
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
        
        # Enhanced description step before generating titles
        project['generation_status'] = 'enhancing_description'
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        # First enhance the topic description for better context
        description_prompt = f"""Analyze and enhance this book topic: "{project['topic']}" in {project['language']}.
        
        Create a comprehensive book description that includes:
        1. Main theme and purpose
        2. Target audience 
        3. Key concepts to be covered
        4. Writing style and tone
        5. Learning outcomes or takeaways
        
        Return a detailed, professional description that will guide chapter creation."""
        
        success, enhanced_description = generate_content(description_prompt, config)
        
        if success:
            project['enhanced_description'] = enhanced_description.strip()
        else:
            project['enhanced_description'] = project['topic']  # Fallback to original topic
        
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        # Update status for title generation
        project['generation_status'] = 'generating_titles'
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        # Generate chapter titles using enhanced description
        titles_prompt = f"""Based on this enhanced book description: "{project.get('enhanced_description', project['topic'])}"
        
        Generate {project['num_chapters']} compelling, specific chapter titles in {project['language']} that:
        1. Follow a logical progression
        2. Cover all key aspects mentioned in the description
        3. Are engaging and professional
        4. Build upon each other naturally
        5. Appeal to the target audience
        
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
            
            Book Context: {project.get('enhanced_description', project['topic'])}
            Language: {project['language']} 

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

@app.route('/api/projects')
def api_projects():
    """Get all projects for the homepage"""
    try:
        projects = []
        if os.path.exists(PROJECTS_FOLDER):
            for filename in os.listdir(PROJECTS_FOLDER):
                if filename.endswith('.json'):
                    project_file = os.path.join(PROJECTS_FOLDER, filename)
                    try:
                        with open(project_file, 'r') as f:
                            project = json.load(f)
                        
                        # Add project ID from filename
                        project['id'] = filename[:-5]  # Remove .json extension
                        
                        # Add created_at if not present
                        if 'created_at' not in project:
                            # Use file modification time as fallback
                            project['created_at'] = datetime.fromtimestamp(os.path.getmtime(project_file)).isoformat()
                        
                        projects.append(project)
                    except Exception as e:
                        logging.warning(f"Error reading project file {filename}: {e}")
                        continue
        
        # Sort by creation date (newest first)
        projects.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return jsonify(projects)
    except Exception as e:
        logging.error(f"Error fetching projects: {e}")
        return jsonify({'error': str(e)}), 500

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

def clean_chapter_content(content):
    """Clean and format chapter content for export"""
    if not content:
        return []
    
    lines = content.split('\n')
    cleaned_lines = []
    
    for line in lines:
        line = line.strip()
        # Skip empty lines, markdown headers, and duplicate titles
        if (line and 
            not line.startswith('#') and 
            not line.startswith('Chapter') and 
            not line.startswith('CHAPTER') and 
            not line.startswith('hapitre') and
            not (len(line) > 10 and line.isupper())):  # Skip all-caps lines
            
            # Clean markdown formatting
            line = line.replace('**', '').replace('*', '').replace('_', '').replace('##', '').replace('###', '')
            line = line.strip()
            if line and len(line) > 10:  # Only keep substantial content
                cleaned_lines.append(line)
    
    # Join all text and create proper paragraphs
    full_text = ' '.join(cleaned_lines)
    
    # Split into sentences roughly
    sentences = []
    current_sentence = ""
    
    for char in full_text:
        current_sentence += char
        if char in '.!?' and len(current_sentence.strip()) > 15:
            sentences.append(current_sentence.strip())
            current_sentence = ""
    
    if current_sentence.strip():
        sentences.append(current_sentence.strip())
    
    # Group sentences into paragraphs (3-4 sentences per paragraph)
    paragraphs = []
    current_paragraph = []
    
    for sentence in sentences:
        if sentence and len(sentence) > 10:
            current_paragraph.append(sentence)
            if len(current_paragraph) >= 3:
                paragraphs.append(' '.join(current_paragraph))
                current_paragraph = []
    
    if current_paragraph:
        paragraphs.append(' '.join(current_paragraph))
    
    return paragraphs

@app.route('/export_pdf/<project_id>')
def export_pdf(project_id):
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        # Clean chapter content for better formatting
        if project.get('chapters'):
            for chapter in project['chapters']:
                chapter['cleaned_paragraphs'] = clean_chapter_content(chapter.get('content', ''))
        
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

@app.route('/api/enhance_author_bio', methods=['POST'])
def enhance_author_bio():
    """Enhance author bio using AI"""
    try:
        config = load_config()
        data = request.get_json()
        
        author_info = data.get('author_info', '').strip()
        bio_style = data.get('bio_style', 'professional')
        bio_length = data.get('bio_length', 'medium')
        
        if not author_info:
            return jsonify({'success': False, 'message': 'Author information is required'})
        
        # Check if AI provider is configured
        ai_provider = config.get('ai_provider', 'openrouter')
        
        if ai_provider == 'gemini':
            if not config.get('gemini_api_key'):
                return jsonify({'success': False, 'message': 'Gemini API key not configured. Please add it in settings.'})
            
            enhanced_bio = generate_author_bio_gemini(author_info, bio_style, bio_length, config)
        else:
            if not config.get('openrouter_api_key'):
                return jsonify({'success': False, 'message': 'OpenRouter API key not configured. Please add it in settings.'})
            
            enhanced_bio = generate_author_bio_openrouter(author_info, bio_style, bio_length, config)
        
        return jsonify({'success': True, 'enhanced_bio': enhanced_bio})
        
    except Exception as e:
        logging.error(f"Error enhancing author bio: {str(e)}")
        return jsonify({'success': False, 'message': f'Error generating bio: {str(e)}'})

def generate_author_bio_gemini(author_info, bio_style, bio_length, config):
    """Generate author bio using Gemini AI"""
    try:
        import os
        from google import genai
        
        # Set up Gemini client
        client = genai.Client(api_key=config['gemini_api_key'])
        
        # Create style-specific prompt
        style_prompts = {
            'professional': 'Write in a professional, formal tone suitable for academic or business contexts',
            'conversational': 'Write in a warm, engaging, conversational tone that connects with readers',
            'academic': 'Write in a scholarly, academic tone with emphasis on credentials and expertise',
            'creative': 'Write in an expressive, creative tone that showcases personality and uniqueness'
        }
        
        length_instructions = {
            'short': 'Keep it to 2-3 sentences maximum',
            'medium': 'Write 1 paragraph (4-6 sentences)',
            'long': 'Write 2-3 paragraphs with comprehensive details'
        }
        
        prompt = f"""You are a professional biography writer. Create a compelling author biography based on the following information.

AUTHOR INFORMATION:
{author_info}

STYLE REQUIREMENTS:
- {style_prompts.get(bio_style, style_prompts['professional'])}
- {length_instructions.get(bio_length, length_instructions['medium'])}
- Focus on credibility, expertise, and what makes this author qualified to write
- Include relevant achievements, background, and experience
- Make it engaging and professional
- Write in third person
- Do not include any markdown formatting or special characters

Create the author biography now:"""

        response = client.models.generate_content(
            model=config.get('gemini_model', 'gemini-1.5-flash'),
            contents=prompt
        )
        
        if response.text:
            return response.text.strip()
        else:
            raise Exception("No response from Gemini API")
            
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")

def generate_author_bio_openrouter(author_info, bio_style, bio_length, config):
    """Generate author bio using OpenRouter API"""
    try:
        # Create style-specific prompt
        style_prompts = {
            'professional': 'Write in a professional, formal tone suitable for academic or business contexts',
            'conversational': 'Write in a warm, engaging, conversational tone that connects with readers',
            'academic': 'Write in a scholarly, academic tone with emphasis on credentials and expertise',
            'creative': 'Write in an expressive, creative tone that showcases personality and uniqueness'
        }
        
        length_instructions = {
            'short': 'Keep it to 2-3 sentences maximum',
            'medium': 'Write 1 paragraph (4-6 sentences)',
            'long': 'Write 2-3 paragraphs with comprehensive details'
        }
        
        prompt = f"""You are a professional biography writer. Create a compelling author biography based on the following information.

AUTHOR INFORMATION:
{author_info}

STYLE REQUIREMENTS:
- {style_prompts.get(bio_style, style_prompts['professional'])}
- {length_instructions.get(bio_length, length_instructions['medium'])}
- Focus on credibility, expertise, and what makes this author qualified to write
- Include relevant achievements, background, and experience
- Make it engaging and professional
- Write in third person
- Do not include any markdown formatting or special characters

Create the author biography now:"""

        headers = {
            "Authorization": f"Bearer {config['openrouter_api_key']}",
            "Content-Type": "application/json",
        }
        
        data = {
            "model": config.get('selected_model', 'meta-llama/llama-3.2-3b-instruct:free'),
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('choices') and len(result['choices']) > 0:
                return result['choices'][0]['message']['content'].strip()
            else:
                raise Exception("No content generated")
        else:
            raise Exception(f"API error: {response.status_code} - {response.text}")
            
    except Exception as e:
        raise Exception(f"OpenRouter API error: {str(e)}")



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
