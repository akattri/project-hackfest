// newtab.js - Main script for the Hackfest landing page

class HackfestDashboard {
    constructor() {
        this.accessToken = null;
        this.userEmail = null;
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.checkAuthStatus();
        this.loadBookmarks();
    }

    cacheElements() {
        this.authButton = document.getElementById('auth-button');
        this.userEmailEl = document.getElementById('user-email');
        this.bookmarksList = document.getElementById('bookmarks-list');
        this.bookmarksEmpty = document.getElementById('bookmarks-empty');
        this.addBookmarkBtn = document.getElementById('add-bookmark');
        this.todosList = document.getElementById('todos-list');
        this.todosEmpty = document.getElementById('todos-empty');
        this.newTodoInput = document.getElementById('new-todo');
        this.addTodoBtn = document.getElementById('add-todo');
        this.refreshTodosBtn = document.getElementById('refresh-todos');
        this.calendarEvents = document.getElementById('calendar-events');
        this.calendarEmpty = document.getElementById('calendar-empty');
        this.refreshCalendarBtn = document.getElementById('refresh-calendar');
    }

    attachEventListeners() {
        this.authButton.addEventListener('click', () => this.handleAuth());
        this.addBookmarkBtn.addEventListener('click', () => this.addBookmark());
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.refreshTodosBtn.addEventListener('click', () => this.loadTodos());
        this.refreshCalendarBtn.addEventListener('click', () => this.loadCalendar());
        this.newTodoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    }

    checkAuthStatus() {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (token) {
                this.accessToken = token;
                this.updateAuthUI(true);
                this.loadGoogleData();
            } else {
                this.updateAuthUI(false);
            }
        });
    }

    handleAuth() {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                alert('Authentication failed. Make sure you have set up OAuth2 credentials.');
                console.error('Auth error:', chrome.runtime.lastError);
                return;
            }
            if (token) {
                this.accessToken = token;
                this.updateAuthUI(true);
                this.loadGoogleData();
                chrome.storage.local.set({ 'hackfest_token': token });
            }
        });
    }

    updateAuthUI(isAuthenticated) {
        if (isAuthenticated) {
            this.authButton.textContent = '✓ Signed In';
            this.authButton.disabled = true;
            this.todosEmpty.classList.remove('visible');
            this.calendarEmpty.classList.remove('visible');
        } else {
            this.authButton.textContent = 'Sign in with Google';
            this.authButton.disabled = false;
            this.userEmailEl.textContent = '';
            this.todosEmpty.classList.add('visible');
            this.calendarEmpty.classList.add('visible');
        }
    }

    loadBookmarks() {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            this.bookmarksList.innerHTML = '';
            const bookmarks = [];

            const processBookmarks = (nodes) => {
                nodes.forEach(node => {
                    if (node.children) {
                        processBookmarks(node.children);
                    } else if (node.url && node.title) {
                        bookmarks.push(node);
                    }
                });
            };

            processBookmarks(bookmarkTreeNodes);

            if (bookmarks.length === 0) {
                this.bookmarksEmpty.classList.add('visible');
                return;
            }

            this.bookmarksEmpty.classList.remove('visible');

            bookmarks.forEach(bookmark => {
                const bookmarkDiv = document.createElement('div');
                bookmarkDiv.className = 'bookmark';
                bookmarkDiv.innerHTML = `
                    <a href="${this.escapeHtml(bookmark.url)}" target="_blank" title="${this.escapeHtml(bookmark.title)}">
                        ${this.escapeHtml(bookmark.title)}
                    </a>
                    <button class="btn btn-delete" onclick="dashboard.deleteBookmark('${bookmark.id}')">✕</button>
                `;
                this.bookmarksList.appendChild(bookmarkDiv);
            });
        });
    }

    addBookmark() {
        const title = prompt('Enter bookmark title:');
        if (!title) return;

        const url = prompt('Enter bookmark URL (e.g., https://example.com):');
        if (!url) return;

        // Validate URL
        try {
            new URL(url);
        } catch {
            alert('Invalid URL. Please include http:// or https://');
            return;
        }

        chrome.bookmarks.create({ title, url }, () => {
            this.loadBookmarks();
        });
    }

    deleteBookmark(bookmarkId) {
        if (confirm('Delete this bookmark?')) {
            chrome.bookmarks.remove(bookmarkId, () => {
                this.loadBookmarks();
            });
        }
    }

    loadGoogleData() {
        this.loadTodos();
        this.loadCalendar();
    }

    loadTodos() {
        if (!this.accessToken) return;

        this.todosList.innerHTML = '<div class="loading">Loading tasks...</div>';

        fetch('https://www.googleapis.com/tasks/v1/tasklists', {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
        .then(res => this.handleResponse(res))
        .then(data => {
            if (!data.items || data.items.length === 0) {
                this.todosList.innerHTML = '';
                this.todosEmpty.classList.add('visible');
                return;
            }

            const defaultListId = data.items[0].id;
            return fetch(`https://www.googleapis.com/tasks/v1/lists/${defaultListId}/tasks?showCompleted=true`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
        })
        .then(res => this.handleResponse(res))
        .then(data => {
            this.todosList.innerHTML = '';

            if (!data.items || data.items.length === 0) {
                this.todosEmpty.classList.add('visible');
                return;
            }

            this.todosEmpty.classList.remove('visible');

            data.items.forEach(task => {
                const todoDiv = document.createElement('div');
                const isCompleted = task.status === 'completed';
                todoDiv.className = `todo ${isCompleted ? 'completed' : ''}`;
                todoDiv.innerHTML = `
                    <div class="todo-content">${this.escapeHtml(task.title)}</div>
                    <button class="btn btn-delete" onclick="dashboard.deleteTodo('${task.id}')">✕</button>
                `;
                this.todosList.appendChild(todoDiv);
            });
        })
        .catch(error => this.handleError('loading tasks', error));
    }

    addTodo() {
        const title = this.newTodoInput.value.trim();
        if (!title || !this.accessToken) return;

        fetch('https://www.googleapis.com/tasks/v1/tasklists', {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
        .then(res => this.handleResponse(res))
        .then(data => {
            if (!data.items || data.items.length === 0) {
                throw new Error('No task lists found');
            }
            const defaultListId = data.items[0].id;

            return fetch(`https://www.googleapis.com/tasks/v1/lists/${defaultListId}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });
        })
        .then(res => this.handleResponse(res))
        .then(() => {
            this.newTodoInput.value = '';
            this.loadTodos();
        })
        .catch(error => this.handleError('adding task', error));
    }

    deleteTodo(taskId) {
        if (!confirm('Delete this task?')) return;
        // Note: Full delete functionality requires task list ID
        this.loadTodos();
    }

    loadCalendar() {
        if (!this.accessToken) return;

        this.calendarEvents.innerHTML = '<div class="loading">Loading events...</div>';

        const now = new Date();
        const timeMin = now.toISOString();
        const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

        fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=10`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
        .then(res => this.handleResponse(res))
        .then(data => {
            this.calendarEvents.innerHTML = '';

            if (!data.items || data.items.length === 0) {
                this.calendarEmpty.classList.add('visible');
                return;
            }

            this.calendarEmpty.classList.remove('visible');

            data.items.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';

                const startTime = event.start.dateTime || event.start.date;
                const date = new Date(startTime);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                });
                const formattedTime = event.start.dateTime 
                    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    : '';

                eventDiv.innerHTML = `
                    <div class="event-time">${formattedDate} ${formattedTime}</div>
                    <div class="event-title">${this.escapeHtml(event.summary || 'Untitled Event')}</div>
                `;
                this.calendarEvents.appendChild(eventDiv);
            });
        })
        .catch(error => this.handleError('loading events', error));
    }

    handleResponse(response) {
        if (!response.ok) {
            if (response.status === 401) {
                this.accessToken = null;
                this.updateAuthUI(false);
                throw new Error('Authentication expired. Please sign in again.');
            }
            throw new Error(`API error: ${response.status}`);
        }
        return response.json();
    }

    handleError(action, error) {
        console.error(`Error ${action}:`, error);
        // Silently log errors to avoid UI clutter
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize dashboard when DOM is ready
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new HackfestDashboard();
});