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
        console.log('Checking authentication status...');
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (chrome.runtime.lastError) {
                console.warn('Auth error on check:', chrome.runtime.lastError);
                this.updateAuthUI(false);
                return;
            }
            if (token) {
                console.log('✓ Token found:', token.substring(0, 20) + '...');
                this.accessToken = token;
                this.updateAuthUI(true);
                this.loadGoogleData();
            } else {
                console.log('No token found. User needs to sign in.');
                this.updateAuthUI(false);
            }
        });
    }

    handleAuth() {
        console.log('Starting authentication...');
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                console.error('Auth error:', chrome.runtime.lastError);
                alert(`Authentication failed: ${chrome.runtime.lastError.message}\n\nMake sure you have:\n1. Set Google Client ID in manifest.json\n2. Enabled Google Tasks API\n3. Enabled Google Calendar API`);
                return;
            }
            if (token) {
                console.log('✓ Authentication successful. Token:', token.substring(0, 20) + '...');
                this.accessToken = token;
                this.updateAuthUI(true);
                this.loadGoogleData();
                chrome.storage.local.set({ 'hackfest_token': token });
            } else {
                console.warn('No token returned from authentication');
                alert('Authentication failed: No token received');
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
        console.log('Loading bookmarks...');
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            if (chrome.runtime.lastError) {
                console.error('Bookmarks API error:', chrome.runtime.lastError);
                this.bookmarksList.innerHTML = '';
                this.bookmarksEmpty.innerHTML = `<div class="empty-state visible">Error loading bookmarks: ${chrome.runtime.lastError.message}</div>`;
                return;
            }

            console.log('Bookmark tree retrieved:', bookmarkTreeNodes.length, 'root nodes');
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
            console.log('Found', bookmarks.length, 'bookmarks');

            if (bookmarks.length === 0) {
                console.log('No bookmarks found');
                this.bookmarksEmpty.classList.add('visible');
                return;
            }

            this.bookmarksEmpty.classList.remove('visible');

            bookmarks.forEach(bookmark => {
                const bookmarkDiv = document.createElement('div');
                bookmarkDiv.className = 'bookmark';
                const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(bookmark.url)}`;
                bookmarkDiv.innerHTML = `
                    <a href="${this.escapeHtml(bookmark.url)}" class="bookmark-link" target="_blank" title="${this.escapeHtml(bookmark.title)}">
                        <img class="bookmark-icon" src="${faviconUrl}" alt="" loading="lazy" />
                        <span class="bookmark-title">${this.escapeHtml(bookmark.title)}</span>
                    </a>
                    <button class="btn btn-delete" onclick="dashboard.deleteBookmark('${bookmark.id}')">✕</button>
                `;
                this.bookmarksList.appendChild(bookmarkDiv);
            });
        });
    }

    addBookmark() {
        const title = prompt('Enter bookmark title:');
        if (!title) {
            console.log('Bookmark creation cancelled by user (no title)');
            return;
        }

        const url = prompt('Enter bookmark URL (e.g., https://example.com):');
        if (!url) {
            console.log('Bookmark creation cancelled by user (no URL)');
            return;
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            console.error('Invalid URL format:', url);
            alert('Invalid URL. Please include http:// or https://');
            return;
        }

        console.log('Creating bookmark:', { title, url });
        
        chrome.bookmarks.create({ title, url }, (newBookmark) => {
            if (chrome.runtime.lastError) {
                console.error('Failed to create bookmark:', chrome.runtime.lastError);
                alert(`Failed to add bookmark: ${chrome.runtime.lastError.message}`);
                return;
            }

            console.log('✓ Bookmark created successfully:', newBookmark);
            alert(`✓ Bookmark added: "${title}"`);
            this.loadBookmarks();
        });
    }

    deleteBookmark(bookmarkId) {
        console.log('Deleting bookmark:', bookmarkId);
        if (confirm('Delete this bookmark?')) {
            chrome.bookmarks.remove(bookmarkId, () => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to delete bookmark:', chrome.runtime.lastError);
                    alert(`Failed to delete bookmark: ${chrome.runtime.lastError.message}`);
                    return;
                }

                console.log('✓ Bookmark deleted successfully');
                this.loadBookmarks();
            });
        }
    }

    loadGoogleData() {
        this.loadTodos();
        this.loadCalendar();
    }

    loadTodos() {
        if (!this.accessToken) {
            console.warn('No access token available');
            return;
        }

        this.todosList.innerHTML = '<div class="loading">Loading tasks...</div>';

        fetch('https://www.googleapis.com/tasks/v1/tasklists', {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
        .then(res => {
            console.log('Tasklists response:', res.status);
            return this.handleResponse(res);
        })
        .then(data => {
            console.log('Tasklists data:', data);
            if (!data.items || data.items.length === 0) {
                console.warn('No task lists found');
                this.todosList.innerHTML = '';
                this.todosEmpty.classList.add('visible');
                return Promise.reject(new Error('No task lists'));
            }

            const defaultListId = data.items[0].id;
            console.log('Loading tasks from list:', defaultListId);
            
            return fetch(`https://www.googleapis.com/tasks/v1/lists/${defaultListId}/tasks?showCompleted=true`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
        })
        .then(res => {
            console.log('Tasks response:', res.status);
            return this.handleResponse(res);
        })
        .then(data => {
            console.log('Tasks data:', data);
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
        .catch(error => {
            console.error('Error loading tasks:', error);
            this.todosList.innerHTML = '';
            this.todosEmpty.innerHTML = `<div class="empty-state visible">Error loading tasks: ${error.message}</div>`;
        });
    }

    addTodo() {
        const title = this.newTodoInput.value.trim();
        
        if (!title) {
            alert('Please enter a task title');
            return;
        }
        
        if (!this.accessToken) {
            alert('Please sign in with Google first');
            return;
        }

        // Show loading state
        this.addTodoBtn.textContent = 'Adding...';
        this.addTodoBtn.disabled = true;

        fetch('https://www.googleapis.com/tasks/v1/tasklists', {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
        .then(res => {
            console.log('Task lists response:', res.status);
            return this.handleResponse(res);
        })
        .then(data => {
            console.log('Task lists data:', data);
            if (!data.items || data.items.length === 0) {
                throw new Error('No task lists found. Please create one in Google Tasks first.');
            }
            const defaultListId = data.items[0].id;
            console.log('Using task list:', defaultListId);

            return fetch(`https://www.googleapis.com/tasks/v1/lists/${defaultListId}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });
        })
        .then(res => {
            console.log('Add task response:', res.status);
            return this.handleResponse(res);
        })
        .then((data) => {
            console.log('Task added successfully:', data);
            this.newTodoInput.value = '';
            this.addTodoBtn.textContent = 'Add';
            this.addTodoBtn.disabled = false;
            this.loadTodos();
        })
        .catch(error => {
            console.error('Error adding task:', error);
            this.addTodoBtn.textContent = 'Add';
            this.addTodoBtn.disabled = false;
            alert(`Failed to add task: ${error.message}`);
        });
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
            if (response.status === 403) {
                throw new Error('Access denied. Make sure Google Tasks and Calendar APIs are enabled.');
            }
            if (response.status === 404) {
                throw new Error('API endpoint not found. Check API configuration.');
            }
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return response.json().catch(err => {
            console.error('Failed to parse JSON response:', err);
            throw new Error('Invalid API response');
        });
    }

    handleError(action, error) {
        console.error(`Error ${action}:`, error);
        console.error('Full error:', error.message);
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