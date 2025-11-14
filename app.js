// Prompt Library App
class PromptLibrary {
    constructor() {
        this.prompts = this.loadPrompts();
        this.currentPrompt = null;
        this.currentCategory = 'all';
        this.searchQuery = '';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderPrompts();
        this.loadInitialPrompts();
    }
    
    setupEventListeners() {
        // New prompt button
        document.getElementById('btnNewPrompt').addEventListener('click', () => {
            this.openModal();
        });
        
        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderPrompts();
        });
        
        // Category selection
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.renderPrompts();
            });
        });
        
        // Modal controls
        document.getElementById('btnCloseModal').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('btnCancel').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('promptForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePrompt();
        });
        
        // Content actions
        document.getElementById('btnEdit').addEventListener('click', () => {
            if (this.currentPrompt) {
                this.editPrompt(this.currentPrompt);
            }
        });
        
        document.getElementById('btnCopy').addEventListener('click', () => {
            if (this.currentPrompt) {
                this.copyPrompt();
            }
        });
        
        document.getElementById('btnDelete').addEventListener('click', () => {
            if (this.currentPrompt) {
                this.deletePrompt();
            }
        });
        
        // Close modal on outside click
        document.getElementById('promptModal').addEventListener('click', (e) => {
            if (e.target.id === 'promptModal') {
                this.closeModal();
            }
        });
    }
    
    loadInitialPrompts() {
        // Check if prompts exist, if not, add some example prompts
        if (this.prompts.length === 0) {
            this.addExamplePrompts();
        }
    }
    
    addExamplePrompts() {
        const examples = [
            {
                id: this.generateId(),
                title: 'Fiverr Gig Thumbnail - High Energy',
                category: 'fiverr',
                content: `Create a professional Fiverr gig thumbnail image for [YOUR SERVICE NAME] in the high-energy expression style.

**Image Specifications:**
- Dimensions: 1280x769 pixels
- Format: High-quality PNG
- Resolution: 300 DPI

**Visual Style:**
- Subject: Professional model with exaggerated expression
- Background: Dark monochromatic with glowing energy lines
- Typography: Bold white text with colored outline
- Composition: High-energy, attention-grabbing`,
                tags: ['fiverr', 'thumbnail', 'marketing'],
                date: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: 'Neo-Noir Red Neon Portrait',
                category: 'portraits',
                content: `Create a striking, digitally painted portrait with a cool, mysterious demeanor, set against a dark background illuminated by a vibrant red neon ring.

**Lighting:**
- Primary: Glowing red neon ring (#FF0000) behind head
- Secondary: Subtle front light for facial highlights
- Shadows: Deep, dramatic shadows

**Style:**
- Cinematic, neo-noir aesthetic
- Highly rendered, realistic digital painting
- Dark, mysterious mood`,
                tags: ['portrait', 'neo-noir', 'cinematic'],
                date: new Date().toISOString()
            }
        ];
        
        examples.forEach(prompt => {
            this.prompts.push(prompt);
        });
        
        this.savePrompts();
        this.renderPrompts();
    }
    
    loadPrompts() {
        const stored = localStorage.getItem('prompts');
        return stored ? JSON.parse(stored) : [];
    }
    
    savePrompts() {
        localStorage.setItem('prompts', JSON.stringify(this.prompts));
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getFilteredPrompts() {
        let filtered = this.prompts;
        
        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.currentCategory);
        }
        
        // Filter by search query
        if (this.searchQuery) {
            filtered = filtered.filter(p => {
                const searchable = `${p.title} ${p.content} ${p.tags?.join(' ') || ''}`.toLowerCase();
                return searchable.includes(this.searchQuery);
            });
        }
        
        // Sort by date (newest first)
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    renderPrompts() {
        const promptsList = document.getElementById('promptsList');
        const filtered = this.getFilteredPrompts();
        
        if (filtered.length === 0) {
            promptsList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <p>No prompts found. Create a new one to get started!</p>
                </div>
            `;
            return;
        }
        
        promptsList.innerHTML = filtered.map(prompt => `
            <div class="prompt-item ${this.currentPrompt?.id === prompt.id ? 'active' : ''}" 
                 data-id="${prompt.id}">
                <div class="prompt-item-title">${this.escapeHtml(prompt.title)}</div>
                <div class="prompt-item-meta">
                    <span>${prompt.category}</span>
                    <span>•</span>
                    <span>${this.formatDate(prompt.date)}</span>
                </div>
                <div class="prompt-item-preview">${this.escapeHtml(prompt.content.substring(0, 100))}...</div>
            </div>
        `).join('');
        
        // Add click listeners
        promptsList.querySelectorAll('.prompt-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const prompt = this.prompts.find(p => p.id === id);
                if (prompt) {
                    this.viewPrompt(prompt);
                }
            });
        });
    }
    
    viewPrompt(prompt) {
        this.currentPrompt = prompt;
        
        // Update UI
        document.getElementById('promptTitle').textContent = prompt.title;
        document.getElementById('promptCategory').textContent = prompt.category;
        document.getElementById('promptDate').textContent = this.formatDate(prompt.date);
        document.getElementById('contentBody').innerHTML = `
            <div class="prompt-content">${this.formatContent(prompt.content)}</div>
            ${prompt.tags && prompt.tags.length > 0 ? `
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${prompt.tags.map(tag => `
                        <span style="padding: 0.25rem 0.75rem; background: var(--bg-light); border-radius: 1rem; font-size: 0.75rem;">
                            #${tag}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        document.getElementById('contentHeader').style.display = 'flex';
        
        // Update active state
        document.querySelectorAll('.prompt-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id === prompt.id);
        });
        
        // Scroll to top
        document.querySelector('.main-content').scrollTop = 0;
    }
    
    formatContent(content) {
        // Simple markdown-like formatting
        return this.escapeHtml(content)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/\n/g, '<br>');
    }
    
    openModal(prompt = null) {
        const modal = document.getElementById('promptModal');
        const form = document.getElementById('promptForm');
        const title = document.getElementById('modalTitle');
        
        if (prompt) {
            title.textContent = 'Edit Prompt';
            document.getElementById('promptName').value = prompt.title;
            document.getElementById('promptCategorySelect').value = prompt.category;
            document.getElementById('promptContent').value = prompt.content;
            document.getElementById('promptTags').value = prompt.tags?.join(', ') || '';
            this.currentPrompt = prompt;
        } else {
            title.textContent = 'New Prompt';
            form.reset();
            this.currentPrompt = null;
        }
        
        modal.style.display = 'flex';
    }
    
    closeModal() {
        document.getElementById('promptModal').style.display = 'none';
        document.getElementById('promptForm').reset();
        this.currentPrompt = null;
    }
    
    savePrompt() {
        const title = document.getElementById('promptName').value;
        const category = document.getElementById('promptCategorySelect').value;
        const content = document.getElementById('promptContent').value;
        const tags = document.getElementById('promptTags').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        
        if (this.currentPrompt) {
            // Update existing
            const index = this.prompts.findIndex(p => p.id === this.currentPrompt.id);
            if (index !== -1) {
                this.prompts[index] = {
                    ...this.prompts[index],
                    title,
                    category,
                    content,
                    tags,
                    date: this.prompts[index].date // Keep original date
                };
            }
        } else {
            // Create new
            this.prompts.push({
                id: this.generateId(),
                title,
                category,
                content,
                tags,
                date: new Date().toISOString()
            });
        }
        
        this.savePrompts();
        this.renderPrompts();
        this.closeModal();
        
        // If we just created/edited the current prompt, refresh the view
        if (this.currentPrompt) {
            const updated = this.prompts.find(p => p.id === this.currentPrompt.id);
            if (updated) {
                this.viewPrompt(updated);
            }
        }
    }
    
    editPrompt(prompt) {
        this.openModal(prompt);
    }
    
    copyPrompt() {
        if (this.currentPrompt) {
            navigator.clipboard.writeText(this.currentPrompt.content).then(() => {
                // Show feedback
                const btn = document.getElementById('btnCopy');
                const original = btn.innerHTML;
                btn.innerHTML = '✓';
                btn.style.color = 'var(--success)';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.style.color = '';
                }, 2000);
            });
        }
    }
    
    deletePrompt() {
        if (this.currentPrompt && confirm('Are you sure you want to delete this prompt?')) {
            this.prompts = this.prompts.filter(p => p.id !== this.currentPrompt.id);
            this.savePrompts();
            this.renderPrompts();
            this.currentPrompt = null;
            
            // Clear content view
            document.getElementById('contentHeader').style.display = 'none';
            document.getElementById('contentBody').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>Welcome to Prompt Library</h3>
                    <p>Select a prompt from the sidebar or create a new one to get started.</p>
                </div>
            `;
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        
        return date.toLocaleDateString();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PromptLibrary();
});

