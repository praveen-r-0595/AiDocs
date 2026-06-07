import webview
import os
import json
import logging
import threading
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

# Setup logging
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)

log_file = os.path.join(log_dir, f'debug_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log')

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class API:
    def __init__(self, window=None):
        self.current_dir = str(Path.home())
        self.window = window
        self.logs = []
        self.executor = ThreadPoolExecutor(max_workers=3)
        logger.info(f"API initialized. Home directory: {self.current_dir}")
        self.add_log('INFO', f"API initialized. Home directory: {self.current_dir}")
        
    def add_log(self, level, message):
        """Add message to logs (non-blocking)"""
        timestamp = datetime.now().isoformat()
        log_entry = {'timestamp': timestamp, 'level': level, 'message': message}
        self.logs.append(log_entry)
        
        # Keep only last 100 logs
        if len(self.logs) > 100:
            self.logs.pop(0)
        
        # Log in background to avoid blocking
        def log_message():
            try:
                logger.log(getattr(logging, level), message)
            except:
                pass
        
        threading.Thread(target=log_message, daemon=True).start()
        return log_entry
        
    def get_logs(self):
        """Return all logs"""
        return self.logs
    
    def clear_logs(self):
        """Clear logs"""
        self.logs = []
        self.add_log('INFO', "Logs cleared")
        return {'success': True}
        
    def get_files(self, directory=None):
        """Get list of markdown files in directory"""
        try:
            if directory:
                self.current_dir = directory
                self.add_log('INFO', f"Changed directory to: {directory}")
            
            self.add_log('DEBUG', f"Listing files in: {self.current_dir}")
            
            files = []
            for file in sorted(os.listdir(self.current_dir)):
                if file.endswith('.md'):
                    files.append(file)
            
            self.add_log('INFO', f"Found {len(files)} markdown files")
            logger.debug(f"Files: {files}")
            
            return {
                'success': True, 
                'files': files, 
                'directory': self.current_dir,
                'count': len(files)
            }
        except Exception as e:
            error_msg = f"Error listing files: {str(e)}"
            self.add_log('ERROR', error_msg)
            logger.exception("Exception in get_files:")
            return {'success': False, 'error': error_msg}
    
    def read_file(self, filename):
        """Read markdown file content"""
        try:
            self.add_log('DEBUG', f"Reading file: {filename}")
            
            filepath = os.path.join(self.current_dir, filename)
            
            if not os.path.exists(filepath):
                error_msg = f"File not found: {filepath}"
                self.add_log('ERROR', error_msg)
                return {'success': False, 'error': error_msg}
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            file_size = len(content)
            self.add_log('INFO', f"Loaded {filename} ({file_size} bytes)")
            logger.debug(f"File content length: {file_size}")
            
            return {
                'success': True, 
                'content': content, 
                'filename': filename,
                'size': file_size,
                'path': filepath
            }
        except Exception as e:
            error_msg = f"Error reading file {filename}: {str(e)}"
            self.add_log('ERROR', error_msg)
            logger.exception("Exception in read_file:")
            return {'success': False, 'error': error_msg}
    
    def browse_folder(self):
        """Browse for folder using file dialog (non-blocking)"""
        def _browse():
            try:
                self.add_log('DEBUG', "Opening folder browser dialog")
                
                if not self.window:
                    return {'success': False, 'error': 'Window not initialized'}
                
                folders = self.window.create_file_dialog(webview.FOLDER_DIALOG)
                
                if folders and len(folders) > 0:
                    folder = folders[0]
                    self.add_log('INFO', f"Folder selected: {folder}")
                    self.current_dir = folder
                    
                    # Get files in new directory
                    files = []
                    for file in sorted(os.listdir(self.current_dir)):
                        if file.endswith('.md'):
                            files.append(file)
                    
                    self.add_log('INFO', f"Found {len(files)} markdown files")
                    return {
                        'success': True,
                        'files': files,
                        'directory': self.current_dir,
                        'count': len(files)
                    }
                
                self.add_log('DEBUG', 'No folder selected')
                return {'success': False, 'error': 'No folder selected'}
                
            except Exception as e:
                error_msg = f"Error browsing folder: {str(e)}"
                self.add_log('ERROR', error_msg)
                logger.exception("Exception in browse_folder:")
                return {'success': False, 'error': error_msg}
        
        # Run in thread to prevent blocking
        return self.executor.submit(_browse).result(timeout=30)
    
    def open_file(self):
        """Open a single markdown file (non-blocking)"""
        def _open():
            try:
                self.add_log('DEBUG', "Opening file dialog")
                
                if not self.window:
                    return {'success': False, 'error': 'Window not initialized'}
                
                files = self.window.create_file_dialog(webview.OPEN_DIALOG, 
                                                       file_types=('Markdown Files (*.md)', 'All Files (*)'))
                
                if files and len(files) > 0:
                    filepath = files[0]
                    self.add_log('INFO', f"File selected: {filepath}")
                    
                    self.current_dir = os.path.dirname(filepath)
                    filename = os.path.basename(filepath)
                    
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        file_size = len(content)
                        self.add_log('INFO', f"Loaded {filename} ({file_size} bytes)")
                        
                        return {
                            'success': True,
                            'content': content,
                            'filename': filename,
                            'size': file_size,
                            'path': filepath
                        }
                    except Exception as e:
                        error_msg = f"Error reading file {filename}: {str(e)}"
                        self.add_log('ERROR', error_msg)
                        return {'success': False, 'error': error_msg}
                
                self.add_log('DEBUG', 'No file selected')
                return {'success': False, 'error': 'No file selected'}
                
            except Exception as e:
                error_msg = f"Error opening file: {str(e)}"
                self.add_log('ERROR', error_msg)
                logger.exception("Exception in open_file:")
                return {'success': False, 'error': error_msg}
        
        # Run in thread to prevent blocking
        return self.executor.submit(_open).result(timeout=30)

if __name__ == '__main__':
    try:
        logger.info("=" * 60)
        logger.info("Markdown Viewer Application Starting")
        logger.info("=" * 60)
        
        # Get the HTML file path
        html_path = os.path.join(os.path.dirname(__file__), 'index.html')
        logger.info(f"HTML path: {html_path}")
        
        if not os.path.exists(html_path):
            logger.error(f"HTML file not found: {html_path}")
            raise FileNotFoundError(f"index.html not found at {html_path}")
        
        api = API()
        logger.info("API instance created")
        
        window = webview.create_window(
            'Markdown Viewer',
            html_path,
            js_api=api,
            width=1400,
            height=900,
            background_color='#1e1e1e'
        )
        
        api.window = window
        logger.info("Window created successfully")
        
        webview.start()
        logger.info("Application ended")
        
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        logger.exception("Exception in main:")
        raise

