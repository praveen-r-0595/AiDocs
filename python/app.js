// Debug Console Setup
class DebugConsole {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
        this.setupConsoleOverride();
    }
    
    setupConsoleOverride() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalDebug = console.debug;
        
        console.log = (...args) => {
            this.addLog('LOG', args.join(' '));
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            this.addLog('ERROR', args.join(' '));
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.addLog('WARN', args.join(' '));
            originalWarn.apply(console, args);
        };
        
        console.debug = (...args) => {
            this.addLog('DEBUG', args.join(' '));
            originalDebug.apply(console, args);
        };
        
        window.addEventListener('error', (event) => {
            this.addLog('ERROR', `${event.message} at ${event.filename}:${event.lineno}`);
        });
    }
    
    addLog(level, message) {
        const timestamp = new Date().toLocaleTimeString();
        const log = {
            timestamp,
            level,
            message
        };
        this.logs.push(log);
        
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        this.updateUI();
    }
    
    updateUI() {
        const debugConsole = document.getElementById('debugConsole');
        if (debugConsole) {
            debugConsole.innerHTML = this.logs
                .map(log => `<div class="log-entry log-${log.level.toLowerCase()}"><span class="time">${log.timestamp}</span> <span class="level">[${log.level}]</span> ${log.message}`)
                .join('');
            debugConsole.scrollTop = debugConsole.scrollHeight;
        }
    }
    
    clear() {
        this.logs = [];
        this.updateUI();
    }
    
    export() {
        return JSON.stringify(this.logs, null, 2);
    }
}

const debugConsole = new DebugConsole();

// Configure marked for better rendering
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
});

marked.use({
    renderer: {
        code(token) {
            const lang = token.lang || '';
            const code = token.text;
            try {
                const highlighted = lang 
                    ? hljs.highlight(code, { language: lang }).value 
                    : hljs.highlightAuto(code).value;
                return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
            } catch (e) {
                console.warn(`Syntax highlight failed for ${lang}: ${e.message}`);
                return `<pre><code>${code}</code></pre>`;
            }
        }
    }
});

let currentFile = null;
let isDarkMode = true;

const elements = {
    openBtn: document.getElementById('openBtn'),
    browseBtn: document.getElementById('browseBtn'),
    themeBtn: document.getElementById('themeBtn'),
    pathInput: document.getElementById('pathInput'),
    fileList: document.getElementById('fileList'),
    content: document.getElementById('content'),
    status: document.getElementById('status'),
    debugToggle: document.getElementById('debugToggle'),
    debugPanel: document.getElementById('debugPanel'),
    debugClear: document.getElementById('debugClear'),
    debugConsole: document.getElementById('debugConsole'),
};

// Event Listeners
elements.openBtn?.addEventListener('click', openFile);
elements.browseBtn?.addEventListener('click', browseFolder);
elements.themeBtn?.addEventListener('click', toggleTheme);
elements.debugToggle?.addEventListener('click', () => {
    elements.debugPanel?.classList.toggle('hidden');
    localStorage.setItem('debugVisible', elements.debugPanel?.classList.contains('hidden') ? 'false' : 'true');
});
elements.debugClear?.addEventListener('click', () => debugConsole.clear());

// Prevent duplicate clicks on buttons
let isLoading = false;

function setLoading(loading) {
    isLoading = loading;
    if (elements.openBtn) elements.openBtn.disabled = loading;
    if (elements.browseBtn) elements.browseBtn.disabled = loading;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing app');
    
    // Check if pywebview is available
    if (!window.pywebview) {
        console.warn('Pywebview API not available yet, retrying...');
        setTimeout(() => init(), 1000);
    } else {
        init();
    }
});

function init() {
    console.log('Initializing Markdown Viewer');
    loadTheme();
    
    // Restore debug panel visibility
    const debugVisible = localStorage.getItem('debugVisible') !== 'false';
    if (!debugVisible && elements.debugPanel) {
        elements.debugPanel.classList.add('hidden');
    }
    
    setTimeout(() => {
        console.log('Loading files...');
        loadFiles();
    }, 500);
}

// Functions
async function openFile() {
    if (isLoading) return;
    
    try {
        console.log('openFile() called');
        updateStatus('Opening file...');
        setLoading(true);
        
        const result = await Promise.race([
            window.pywebview.api.open_file(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Operation timed out')), 30000)
            )
        ]);
        console.log('openFile() result:', result);
        
        if (result.success) {
            currentFile = result.filename;
            console.log(`File loaded: ${result.filename} (${result.size} bytes)`);
            displayContent(result.content);
            updateStatus(`Loaded: ${result.filename}`);
            loadFiles();
        } else {
            console.error(`Failed to open file: ${result.error}`);
            updateStatus(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Exception in openFile():', error);
        updateStatus(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

async function browseFolder() {
    if (isLoading) return;
    
    try {
        console.log('browseFolder() called');
        updateStatus('Browsing folders...');
        setLoading(true);
        
        const result = await Promise.race([
            window.pywebview.api.browse_folder(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Operation timed out')), 30000)
            )
        ]);
        console.log('browseFolder() result:', result);
        
        if (result.success) {
            console.log(`Directory changed to: ${result.directory}`);
            displayFiles(result.files);
            document.getElementById('pathInput').value = result.directory;
            updateStatus(`Ready (${result.count} files)`);
        } else {
            console.error(`Failed to browse: ${result.error}`);
            updateStatus(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Exception in browseFolder():', error);
        updateStatus(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

async function loadFiles() {
    try {
        console.log('loadFiles() called');
        
        const result = await Promise.race([
            window.pywebview.api.get_files(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Operation timed out')), 10000)
            )
        ]);
        console.log('loadFiles() result:', result);
        
        if (result.success) {
            displayFiles(result.files);
            elements.pathInput.value = result.directory;
            updateStatus(`Ready (${result.count} files)`);
        } else {
            console.error(`Failed to load files: ${result.error}`);
            updateStatus(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Exception in loadFiles():', error);
        updateStatus(`Error: ${error.message}`);
    }
}

function displayFiles(files) {
    console.debug(`Displaying ${files.length} files`);
    elements.fileList.innerHTML = '';
    
    if (files.length === 0) {
        elements.fileList.innerHTML = '<div class="empty-state">No markdown files found</div>';
        return;
    }
    
    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.textContent = file;
        fileItem.addEventListener('click', () => selectFile(file));
        elements.fileList.appendChild(fileItem);
    });
}

async function selectFile(filename) {
    try {
        console.log(`selectFile() called for: ${filename}`);
        updateStatus(`Loading ${filename}...`);
        
        const result = await Promise.race([
            window.pywebview.api.read_file(filename),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Operation timed out')), 10000)
            )
        ]);
        console.log(`selectFile() result for ${filename}:`, result);
        
        if (result.success) {
            currentFile = filename;
            console.log(`File loaded successfully: ${filename}`);
            displayContent(result.content);
            updateStatus(`Loaded: ${filename}`);
            
            document.querySelectorAll('.file-item').forEach(item => {
                item.classList.toggle('active', item.textContent === filename);
            });
        } else {
            console.error(`Failed to select file: ${result.error}`);
            updateStatus(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Exception in selectFile():', error);
        updateStatus(`Error: ${error.message}`);
    }
}

function displayContent(markdown) {
    try {
        console.debug('displayContent() called');
        
        // Use requestAnimationFrame to prevent blocking UI
        requestAnimationFrame(() => {
            try {
                const html = marked.parse(markdown);
                elements.content.innerHTML = html;
                elements.content.classList.remove('empty-state');
                console.debug('Content displayed successfully');
            } catch (error) {
                console.error('Error rendering markdown:', error);
                elements.content.innerHTML = `<div style="color: red; padding: 20px;">Error rendering markdown: ${error.message}</div>`;
            }
        });
    } catch (error) {
        console.error('Error in displayContent:', error);
        elements.content.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-mode', !isDarkMode);
    elements.themeBtn.textContent = isDarkMode ? '🌙' : '☀️';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    console.log(`Theme changed to: ${isDarkMode ? 'dark' : 'light'}`);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    isDarkMode = savedTheme === 'dark';
    if (!isDarkMode) {
        document.body.classList.add('light-mode');
        elements.themeBtn.textContent = '☀️';
    }
    console.log(`Theme loaded: ${isDarkMode ? 'dark' : 'light'}`);
}

function updateStatus(message) {
    // Add spinner if loading
    const spinner = isLoading ? ' ⟳' : '';
    elements.status.textContent = message + spinner;
    console.debug(`Status: ${message}`);
}
