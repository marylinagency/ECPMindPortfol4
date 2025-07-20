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
    machine_info = f"{platform.node()}-{platform.system()}-{platform.processor()}"
    return hashlib.md5(machine_info.encode()).hexdigest()

def load_config():
    """Load configuration from config.json"""
    try:
        with open('config.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Create default config
        default_config = {
            "openrouter_api_key": "",
            "selected_model": "openai/gpt-3.5-turbo",
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
    """Generate content using OpenRouter API"""
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", 
                               json=data, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return True, result['choices'][0]['message']['content']
        else:
            return False, f"API Error: {response.status_code} - {response.text}"
    except Exception as e:
        return False, str(e)

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
    config['openrouter_api_key'] = request.form.get('api_key', '')
    config['selected_model'] = request.form.get('model', 'openai/gpt-3.5-turbo')
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
        if file and file.filename != '' and allowed_file(file.filename):
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

@app.route('/generate_chapters/<project_id>')
def generate_chapters(project_id):
    config = load_config()
    api_key = config.get('openrouter_api_key', '')
    model = config.get('selected_model', 'openai/gpt-3.5-turbo')
    
    if not api_key:
        flash('Please configure your OpenRouter API key in settings', 'error')
        return redirect(url_for('project_view', project_id=project_id))
    
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        with open(project_file, 'r') as f:
            project = json.load(f)
        
        # Start background generation
        thread = threading.Thread(target=generate_chapters_background, 
                                args=(project_id, project, api_key, model))
        thread.daemon = True
        thread.start()
        
        flash('Chapter generation started! Please wait...', 'info')
        return redirect(url_for('project_view', project_id=project_id))
        
    except Exception as e:
        flash(f'Error starting generation: {str(e)}', 'error')
        return redirect(url_for('project_view', project_id=project_id))

def generate_chapters_background(project_id, project, api_key, model):
    """Background task to generate chapters"""
    try:
        project_file = os.path.join(PROJECTS_FOLDER, f"{project_id}.json")
        
        # Update status
        project['generation_status'] = 'generating_titles'
        with open(project_file, 'w') as f:
            json.dump(project, f, indent=2)
        
        # Generate chapter titles
        titles_prompt = f"""Generate {project['num_chapters']} compelling chapter titles for a book about "{project['topic']}" in {project['language']}. 
        Return only the titles, one per line, numbered from 1 to {project['num_chapters']}."""
        
        success, titles_result = generate_with_openrouter(titles_prompt, api_key, model)
        
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
            
            content_prompt = f"""Write comprehensive content for Chapter {chapter['number']}: "{chapter['title']}" 
            for a book about "{project['topic']}" in {project['language']}. 
            The content should be detailed, engaging, and approximately 1000-1500 words. 
            Use proper formatting with paragraphs and sections where appropriate."""
            
            success, content_result = generate_with_openrouter(content_prompt, api_key, model)
            
            if success:
                chapter['content'] = content_result.strip()
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
        
        # Convert to PDF
        pdf_filename = f"{project['name']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = os.path.join(EXPORTS_FOLDER, pdf_filename)
        
        weasyprint.HTML(string=html_content).write_pdf(pdf_path)
        
        return send_file(pdf_path, as_attachment=True, download_name=pdf_filename)
        
    except Exception as e:
        flash(f'Error exporting PDF: {str(e)}', 'error')
        return redirect(url_for('project_view', project_id=project_id))

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
