// newtab.js - Main script for the Hackfest landing page

class HackfestDashboard {
    constructor() {
        this.accessToken = null;
        this.userEmail = null;
        this.isLocalAuth = false;
        this.bookmarkViewMode = 'flat';
        this.init();
    }

    init() {
        this.cacheElements();
        this.initClock();
        this.attachEventListeners();
        this.initSearchSuggestions();
        this.checkAuthStatus();
        this.loadLayoutPreference(() => {
            this.loadBookmarks();
        });
    }

    // --- HIG TOAST SYSTEM ---
    showToast(message, type = 'info') {
        const container = document.getElementById('hig-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `hig-toast ${type}`;
        
        let icon = 'info';
        if (type === 'success') icon = 'check_circle';
        if (type === 'error') icon = 'error';

        toast.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 20px;">${icon}</span>
            <span>${this.escapeHtml(message)}</span>
        `;
        
        container.appendChild(toast);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }

    confirmAction(targetElement, message, onConfirm) {
        // If there's already a confirmation here, ignore
        if (targetElement.querySelector('.inline-confirm')) return;

        // Hide the original button/content
        const originalDisplay = targetElement.style.display;
        targetElement.style.display = 'none';

        // Create the inline confirmation element
        const confirmContainer = document.createElement('div');
        confirmContainer.className = 'inline-confirm';
        confirmContainer.innerHTML = `
            <span class="inline-confirm-text">${this.escapeHtml(message)}</span>
            <button class="btn btn-small btn-primary confirm-yes">Yes</button>
            <button class="btn btn-small confirm-no">No</button>
        `;

        // Insert right after the hidden element
        targetElement.parentNode.insertBefore(confirmContainer, targetElement.nextSibling);

        const cleanup = () => {
            confirmContainer.remove();
            targetElement.style.display = originalDisplay;
        };

        confirmContainer.querySelector('.confirm-no').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            cleanup();
        });

        confirmContainer.querySelector('.confirm-yes').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            cleanup();
            onConfirm();
        });
    }
    // ------------------------

    loadLayoutPreference(callback) {
        chrome.storage.local.get(['hackfest_layout', 'bookmark_view_mode'], (result) => {
            if (result.hackfest_layout === '3-col') {
                this.dashboardEl.classList.add('layout-3-col');
            }
            if (result.bookmark_view_mode) {
                this.bookmarkViewMode = result.bookmark_view_mode;
            }
            if (callback) callback();
        });
    }

    toggleLayout() {
        this.dashboardEl.classList.toggle('layout-3-col');
        const is3Col = this.dashboardEl.classList.contains('layout-3-col');
        chrome.storage.local.set({ 'hackfest_layout': is3Col ? '3-col' : 'default' });
    }

    toggleBookmarkView() {
        this.bookmarkViewMode = this.bookmarkViewMode === 'flat' ? 'folder' : 'flat';
        chrome.storage.local.set({ 'bookmark_view_mode': this.bookmarkViewMode });
        this.loadBookmarks();
    }

    cacheElements() {
        this.dashboardEl = document.querySelector('.dashboard');
        this.layoutToggleBtn = document.getElementById('layout-toggle');
        this.authButton = document.getElementById('auth-button');
        this.userEmailEl = document.getElementById('user-email');
        this.searchForm = document.getElementById('search-form');
        this.searchInput = document.getElementById('global-search');
        this.searchSuggestions = document.getElementById('search-suggestions');
        this.clockEl = document.getElementById('clock');
        this.bookmarksList = document.getElementById('bookmarks-list');
        this.bookmarksEmpty = document.getElementById('bookmarks-empty');
        this.addBookmarkBtn = document.getElementById('add-bookmark');
        this.toggleBookmarkViewBtn = document.getElementById('toggle-bookmark-view');
        this.todosList = document.getElementById('todos-list');
        this.todosEmpty = document.getElementById('todos-empty');
        this.newTodoInput = document.getElementById('new-todo');
        this.addTodoBtn = document.getElementById('add-todo');
        this.refreshTodosBtn = document.getElementById('refresh-todos');
        this.taskListSelect = document.getElementById('task-list-select');
        this.taskListWrapper = document.getElementById('task-list-wrapper');
        this.calendarEvents = document.getElementById('calendar-events');
        this.calendarEmpty = document.getElementById('calendar-empty');
        this.refreshCalendarBtn = document.getElementById('refresh-calendar');
        this.signOutButton = document.getElementById('sign-out-button');
    }

    attachEventListeners() {
        this.layoutToggleBtn.addEventListener('click', () => this.toggleLayout());
        this.authButton.addEventListener('click', () => this.handleAuth());
        this.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        this.addBookmarkBtn.addEventListener('click', () => this.addBookmark());
        if (this.toggleBookmarkViewBtn) {
            this.toggleBookmarkViewBtn.addEventListener('click', () => this.toggleBookmarkView());
        }
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.refreshTodosBtn.addEventListener('click', () => { this.currentTaskListId = null; this.loadTodos(); });
        this.taskListSelect.addEventListener('change', (e) => {
            this.currentTaskListId = e.target.value;
            this.loadTasksForCurrentList();
        });
        this.refreshCalendarBtn.addEventListener('click', () => this.loadCalendar());
        this.signOutButton.addEventListener('click', () => this.handleSignOut());
        this.newTodoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        document.querySelectorAll('.trigger-auth').forEach(btn => {
            btn.addEventListener('click', () => this.handleAuth());
        });
    }

    handleSearch(event) {
        event.preventDefault();
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.searchSuggestions.classList.remove('visible');

        if (this.selectedSuggestionIndex >= 0 && this.currentSuggestions && this.currentSuggestions[this.selectedSuggestionIndex]) {
            const suggestion = this.currentSuggestions[this.selectedSuggestionIndex];
            if (suggestion.url) {
                if (chrome?.tabs?.create) {
                    chrome.tabs.create({ url: suggestion.url });
                } else {
                    window.location.href = suggestion.url;
                }
                return;
            }
        }
        
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        if (chrome?.tabs?.create) {
            chrome.tabs.create({ url: searchUrl });
        } else {
            window.location.href = searchUrl;
        }
    }

    initClock() {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            this.clockEl.innerHTML = `<div class="clock-date">${dateStr}</div><div class="clock-time">${timeStr}</div>`;
        };

        const startClock = () => {
            stopClock();
            updateClock();
            const now = new Date();
            const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
            
            this.clockTimeout = setTimeout(() => {
                updateClock();
                this.clockInterval = setInterval(updateClock, 60000);
            }, msUntilNextMinute);
        };

        const stopClock = () => {
            if (this.clockTimeout) clearTimeout(this.clockTimeout);
            if (this.clockInterval) clearInterval(this.clockInterval);
        };

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopClock();
            } else {
                startClock();
            }
        });

        startClock();
    }

    initSearchSuggestions() {
        let debounceTimeout;
        this.selectedSuggestionIndex = -1;
        this.originalSearchQuery = '';
        
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            const query = e.target.value;
            this.originalSearchQuery = query;
            
            if (!query.trim()) {
                this.searchSuggestions.classList.remove('visible');
                return;
            }

            debounceTimeout = setTimeout(() => {
                this.fetchSearchSuggestions(query.trim());
            }, 300);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            const items = this.searchSuggestions.querySelectorAll('.search-suggestion-item');
            if (!this.searchSuggestions.classList.contains('visible') || items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedSuggestionIndex = Math.min(this.selectedSuggestionIndex + 1, items.length - 1);
                this.updateSuggestionSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
                this.updateSuggestionSelection(items);
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.searchForm.contains(e.target)) {
                this.searchSuggestions.classList.remove('visible');
            }
        });
        
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim() && this.searchSuggestions.innerHTML !== '') {
                this.searchSuggestions.classList.add('visible');
            }
        });
    }

    updateSuggestionSelection(items) {
        items.forEach((item, i) => {
            if (i === this.selectedSuggestionIndex) {
                item.classList.add('active');
                const suggestion = this.currentSuggestions[i];
                this.searchInput.value = suggestion.title;
            } else {
                item.classList.remove('active');
            }
        });
        
        if (this.selectedSuggestionIndex === -1) {
            this.searchInput.value = this.originalSearchQuery;
        }
    }

    fetchSearchSuggestions(query) {
        const bookmarkPromise = new Promise((resolve) => {
            chrome.bookmarks.search(query, resolve);
        });

        const searchPromise = fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => data[1] || [])
            .catch(() => []);

        Promise.all([bookmarkPromise, searchPromise])
            .then(([bookmarks, searchSuggestions]) => {
                const combined = [];
                const seenUrls = new Set();

                bookmarks.slice(0, 5).forEach(b => {
                    if (b.url && !seenUrls.has(b.url)) {
                        combined.push({ type: 'bookmark', title: b.title || b.url, url: b.url });
                        seenUrls.add(b.url);
                    }
                });

                searchSuggestions.forEach(s => {
                    combined.push({ type: 'search', title: s });
                });

                this.currentSuggestions = combined;
                this.renderSearchSuggestions(combined);
            });
    }

    renderSearchSuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.searchSuggestions.classList.remove('visible');
            return;
        }

        this.selectedSuggestionIndex = -1;
        this.searchSuggestions.innerHTML = '';
        
        suggestions.forEach((suggestion, index) => {
            const div = document.createElement('div');
            div.className = 'search-suggestion-item';
            
            let icon = 'search';
            if (suggestion.type === 'history') icon = 'history';
            if (suggestion.type === 'bookmark') icon = 'star';

            div.innerHTML = `
                <div class="suggestion-icon">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${this.escapeHtml(suggestion.title)}</div>
                    ${suggestion.url ? `<div class="suggestion-url">${this.escapeHtml(suggestion.url)}</div>` : ''}
                </div>
            `;
            
            div.addEventListener('click', () => {
                this.handleSuggestionAction(suggestion);
            });
            this.searchSuggestions.appendChild(div);
        });
        
        this.searchSuggestions.classList.add('visible');
    }

    handleSuggestionAction(suggestion) {
        this.searchSuggestions.classList.remove('visible');
        if (suggestion.url) {
            if (chrome?.tabs?.create) {
                chrome.tabs.create({ url: suggestion.url });
            } else {
                window.location.href = suggestion.url;
            }
        } else {
            this.searchInput.value = suggestion.title;
            this.searchForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    }

    checkAuthStatus() {
        if (!this.hasConfiguredGoogleClientId()) {
            this.updateAuthUI(false);
            return;
        }

        chrome.storage.local.get(['hackfest_token'], (result) => {
            if (result.hackfest_token) {
                fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + result.hackfest_token)
                .then(res => {
                    if (res.ok) {
                        this.accessToken = result.hackfest_token;
                        this.updateAuthUI(true);
                        this.loadGoogleData();
                    } else {
                        chrome.storage.local.remove('hackfest_token');
                        this.updateAuthUI(false);
                    }
                })
                .catch(() => this.updateAuthUI(false));
            } else {
                this.updateAuthUI(false);
            }
        });
    }

    handleAuth() {
        console.log('Starting authentication...');
        if (!this.hasConfiguredGoogleClientId()) {
            console.log('Using local sign-in fallback (no Google client ID configured).');
            this.isLocalAuth = true;
            this.accessToken = null;
            this.updateAuthUI(true);
            return;
        }

        this.isLocalAuth = false;

        const manifest = chrome.runtime.getManifest();
        const clientId = manifest.oauth2.client_id;
        const scopes = manifest.oauth2.scopes.join(' ');
        const redirectUrl = chrome.identity.getRedirectURL();

        const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth' +
            '?client_id=' + encodeURIComponent(clientId) +
            '&response_type=token' +
            '&redirect_uri=' + encodeURIComponent(redirectUrl) +
            '&scope=' + encodeURIComponent(scopes);

        chrome.identity.launchWebAuthFlow({
            url: authUrl,
            interactive: true
        }, (responseUrl) => {
            if (chrome.runtime.lastError) {
                console.error('Auth error:', chrome.runtime.lastError);
                this.showToast('Authentication failed: ' + chrome.runtime.lastError.message, 'error');
                return;
            }

            if (responseUrl) {
                const url = new URL(responseUrl);
                const params = new URLSearchParams(url.hash.substring(1));
                const token = params.get('access_token');

                if (token) {
                    console.log('✓ Authentication successful');
                    this.accessToken = token;
                    chrome.storage.local.set({ 'hackfest_token': token });
                    this.updateAuthUI(true);
                    this.loadGoogleData();
                    this.showToast('Signed in successfully', 'success');
                } else {
                    console.error('No access token in response');
                    this.showToast('Authentication failed: No token received', 'error');
                }
            }
        });
    }

    handleSignOut() {
        if (this.isLocalAuth) {
            this.isLocalAuth = false;
            this.updateAuthUI(false);
            return;
        }

        if (this.accessToken) {
            fetch('https://accounts.google.com/o/oauth2/revoke?token=' + this.accessToken).catch(() => {});
        }
        this.accessToken = null;
        chrome.storage.local.remove('hackfest_token');
        this.updateAuthUI(false);
        console.log('User signed out.');
        this.showToast('Signed out', 'info');
    }

    updateAuthUI(isAuthenticated) {
        if (isAuthenticated) {
            this.authButton.style.display = 'none';
            this.signOutButton.style.display = 'block';
            
            if (this.isLocalAuth) {
                this.userEmailEl.textContent = 'Local User';
                this.todosEmpty.classList.remove('visible');
                this.calendarEmpty.classList.remove('visible');
                this.loadGoogleData();
            } else {
                this.todosEmpty.classList.remove('visible');
                this.calendarEmpty.classList.remove('visible');
            }
        } else {
            this.authButton.style.display = 'block';
            this.authButton.disabled = false;
            this.signOutButton.style.display = 'none';
            this.userEmailEl.textContent = '';
            this.todosEmpty.classList.add('visible');
            this.calendarEmpty.classList.add('visible');
            this.todosList.innerHTML = '';
            this.calendarEvents.innerHTML = '';
        }
    }

    hasConfiguredGoogleClientId() {
        const clientId = chrome.runtime.getManifest()?.oauth2?.client_id;
        return !!clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID';
    }

    loadBookmarks() {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            if (chrome.runtime.lastError) {
                this.bookmarksList.innerHTML = '';
                this.bookmarksEmpty.innerHTML = `<div class="empty-state visible">Error loading bookmarks: ${chrome.runtime.lastError.message}</div>`;
                return;
            }

            this.bookmarksList.innerHTML = '';
            
            const createBookmarkDiv = (bookmark) => {
                const bookmarkDiv = document.createElement('div');
                bookmarkDiv.className = 'bookmark';
                bookmarkDiv.draggable = true;
                bookmarkDiv.dataset.id = bookmark.id;
                
                bookmarkDiv.addEventListener('dragstart', (e) => this.handleDragStart(e, bookmarkDiv));
                bookmarkDiv.addEventListener('dragover', (e) => this.handleDragOver(e));
                bookmarkDiv.addEventListener('drop', (e) => this.handleDrop(e, bookmarkDiv));
                bookmarkDiv.addEventListener('dragend', (e) => this.handleDragEnd(e));

                const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(bookmark.url)}`;
                bookmarkDiv.innerHTML = `
                    <a href="${this.escapeHtml(bookmark.url)}" class="bookmark-link" target="_blank" title="${this.escapeHtml(bookmark.title)}">
                        <img class="bookmark-icon" src="${faviconUrl}" alt="" loading="lazy" />
                        <span class="bookmark-title">${this.escapeHtml(bookmark.title)}</span>
                    </a>
                    <button class="btn btn-delete" title="Delete bookmark"><span class="material-symbols-outlined" style="font-size: 14px;">close</span></button>
                `;
                
                bookmarkDiv.querySelector('.btn-delete').addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.confirmAction(e.currentTarget, 'Delete bookmark?', () => {
                        this.deleteBookmark(bookmark.id);
                    });
                });
                return bookmarkDiv;
            };

            let hasItems = false;

            if (this.bookmarkViewMode === 'folder') {
                const renderNodes = (nodes, container, isRoot = false) => {
                    let itemsAdded = false;
                    nodes.forEach(node => {
                        if (node.children) {
                            const folderDiv = document.createElement('div');
                            folderDiv.className = `bookmark-folder ${isRoot ? '' : 'collapsed'}`;
                            
                            const header = document.createElement('div');
                            header.className = 'bookmark-folder-header';
                            const iconText = isRoot ? 'expand_less' : 'chevron_left'; 
                            header.innerHTML = `
                                <span class="material-symbols-outlined folder-icon">folder</span>
                                <span class="folder-title">${this.escapeHtml(node.title || 'Bookmarks')}</span>
                                <span class="material-symbols-outlined toggle-icon">${iconText}</span>
                            `;
                            
                            const content = document.createElement('div');
                            content.className = 'bookmark-folder-content';
                            
                            const hasChildren = renderNodes(node.children, content, false);
                            
                            if (hasChildren) {
                                header.addEventListener('click', () => {
                                    const isCollapsed = folderDiv.classList.contains('collapsed');
                                    if (isCollapsed) {
                                        folderDiv.classList.remove('collapsed');
                                        header.querySelector('.toggle-icon').textContent = 'expand_less';
                                    } else {
                                        folderDiv.classList.add('collapsed');
                                        header.querySelector('.toggle-icon').textContent = 'chevron_left';
                                    }
                                });
                                folderDiv.appendChild(header);
                                folderDiv.appendChild(content);
                                container.appendChild(folderDiv);
                                itemsAdded = true;
                            }
                        } else if (node.url && node.title) {
                            container.appendChild(createBookmarkDiv(node));
                            itemsAdded = true;
                        }
                    });
                    return itemsAdded;
                };

                const rootNodes = bookmarkTreeNodes[0].children || [];
                hasItems = renderNodes(rootNodes, this.bookmarksList, true);
            } else {
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

                if (bookmarks.length > 0) {
                    hasItems = true;
                    bookmarks.forEach(bookmark => {
                        this.bookmarksList.appendChild(createBookmarkDiv(bookmark));
                    });
                }
            }

            if (!hasItems) {
                this.bookmarksEmpty.classList.add('visible');
            } else {
                this.bookmarksEmpty.classList.remove('visible');
            }
        });
    }

    handleDragStart(e, el) {
        e.dataTransfer.setData('text/plain', el.dataset.id);
        el.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e, targetEl) {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (!draggedId) return;
        
        const draggedEl = document.querySelector(`.bookmark[data-id="${draggedId}"]`);
        
        if (draggedEl && draggedEl !== targetEl) {
            const allBookmarks = [...this.bookmarksList.querySelectorAll('.bookmark')];
            const draggedIndex = allBookmarks.indexOf(draggedEl);
            const targetIndex = allBookmarks.indexOf(targetEl);
            
            if (draggedIndex < targetIndex) {
                targetEl.parentNode.insertBefore(draggedEl, targetEl.nextSibling);
            } else {
                targetEl.parentNode.insertBefore(draggedEl, targetEl);
            }

            chrome.bookmarks.get(targetEl.dataset.id, (targetNodes) => {
                if (targetNodes && targetNodes.length > 0) {
                    const targetNode = targetNodes[0];
                    chrome.bookmarks.move(draggedId, {
                        parentId: targetNode.parentId,
                        index: targetNode.index
                    });
                }
            });
        }
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    addBookmark() {
        const title = prompt('Enter bookmark title:');
        if (!title) return;

        const url = prompt('Enter bookmark URL (e.g., https://example.com):');
        if (!url) return;

        try {
            new URL(url);
        } catch {
            this.showToast('Invalid URL. Please include http:// or https://', 'error');
            return;
        }
        
        chrome.bookmarks.create({ title, url }, (newBookmark) => {
            if (chrome.runtime.lastError) {
                this.showToast(`Failed to add bookmark: ${chrome.runtime.lastError.message}`, 'error');
                return;
            }

            this.showToast(`Bookmark added: "${title}"`, 'success');
            this.loadBookmarks();
        });
    }

    deleteBookmark(bookmarkId) {
        chrome.bookmarks.remove(bookmarkId, () => {
            if (chrome.runtime.lastError) {
                this.showToast(`Failed to delete bookmark: ${chrome.runtime.lastError.message}`, 'error');
                return;
            }

            this.showToast('Bookmark deleted', 'success');
            this.loadBookmarks();
        });
    }

    loadGoogleData() {
        this.loadTodos();
        this.loadCalendar();
    }

    loadTodos() {
        if (!this.accessToken || this.isLocalAuth) return;

        this.todosList.innerHTML = '<div class="loading">Loading tasks...</div>';

        fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
        .then(res => this.handleResponse(res))
        .then(data => {
            if (!data.items || data.items.length === 0) {
                this.todosList.innerHTML = '';
                this.todosEmpty.classList.add('visible');
                if (this.taskListWrapper) this.taskListWrapper.style.display = 'none';
                return;
            }

            this.taskListSelect.innerHTML = '';
            data.items.forEach(list => {
                const option = document.createElement('option');
                option.value = list.id;
                option.textContent = list.title;
                this.taskListSelect.appendChild(option);
            });
            if (this.taskListWrapper) this.taskListWrapper.style.display = 'block';

            if (!this.currentTaskListId || !data.items.find(l => l.id === this.currentTaskListId)) {
                this.currentTaskListId = data.items[0].id;
            }
            this.taskListSelect.value = this.currentTaskListId;
            
            this.loadTasksForCurrentList();
        })
        .catch(error => {
            this.todosList.innerHTML = '';
            this.todosEmpty.innerHTML = `<div class="empty-state visible">Error loading tasks: ${error.message}</div>`;
        });
    }

    loadTasksForCurrentList() {
        if (!this.accessToken || !this.currentTaskListId) return;

        this.todosList.innerHTML = '<div class="loading">Loading tasks...</div>';

        fetch(`https://www.googleapis.com/tasks/v1/lists/${this.currentTaskListId}/tasks?showCompleted=true`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
        .then(res => this.handleResponse(res))
        .then(data => {
            this.todosList.innerHTML = '';

            if (!data.items || data.items.length === 0) {
                this.todosEmpty.classList.add('visible');
                return;
            }

            this.todosEmpty.classList.remove('visible');

            const sortedTasks = data.items.sort((a, b) => {
                if (a.status !== b.status) {
                    return a.status === 'completed' ? 1 : -1;
                }
                return (a.position || '') > (b.position || '') ? 1 : -1;
            });

            sortedTasks.forEach(task => {
                const todoDiv = document.createElement('div');
                const isCompleted = task.status === 'completed';
                todoDiv.className = `todo ${isCompleted ? 'completed' : ''}`;
                
                let detailsHtml = '';
                if (task.notes || task.due) {
                    detailsHtml = '<div class="todo-details" style="font-size: 0.8em; color: var(--text-secondary); margin-top: 4px;">';
                    if (task.due) {
                        const dueDate = new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        detailsHtml += `<span class="todo-due" style="margin-right: 8px;">📅 ${dueDate}</span>`;
                    }
                    if (task.notes) {
                        detailsHtml += `<span class="todo-notes">${this.escapeHtml(task.notes).substring(0, 50)}${task.notes.length > 50 ? '...' : ''}</span>`;
                    }
                    detailsHtml += '</div>';
                }

                todoDiv.innerHTML = `
                    <div class="todo-display" style="display: flex; align-items: flex-start; gap: 8px; flex: 1; width: 100%;">
                        <input type="checkbox" class="todo-checkbox" ${isCompleted ? 'checked' : ''} style="margin-top: 4px;">
                        <div style="flex: 1; min-width: 0;">
                            <div class="todo-content" style="word-break: break-word;">${this.escapeHtml(task.title)}</div>
                            ${detailsHtml}
                        </div>
                        <div style="display: flex; gap: 4px; margin-top: 2px;">
                            <button class="btn btn-edit" title="Edit task"><span class="material-symbols-outlined" style="font-size: 14px;">edit</span></button>
                            <button class="btn btn-delete" title="Delete task"><span class="material-symbols-outlined" style="font-size: 14px;">close</span></button>
                        </div>
                    </div>
                `;
                
                todoDiv.querySelector('.todo-checkbox').addEventListener('change', (e) => {
                    this.toggleTodo(task, e.target.checked);
                });

                todoDiv.querySelector('.btn-edit').addEventListener('click', () => {
                    this.renderEditForm(task, todoDiv);
                });

                todoDiv.querySelector('.btn-delete').addEventListener('click', (e) => {
                    this.confirmAction(e.currentTarget, 'Delete task?', () => {
                        this.deleteTodo(task.id);
                    });
                });
                this.todosList.appendChild(todoDiv);
            });
        })
        .catch(error => {
            this.todosList.innerHTML = '';
            this.todosEmpty.innerHTML = `<div class="empty-state visible">Error loading tasks: ${error.message}</div>`;
        });
    }

    toggleTodo(task, isCompleted) {
        if (!this.accessToken || !this.currentTaskListId) return;

        const newStatus = isCompleted ? 'completed' : 'needsAction';
        const taskElement = [...this.todosList.children].find(el => {
             const contentEl = el.querySelector('.todo-content');
             return contentEl && contentEl.textContent === task.title;
        });
        
        if (taskElement) {
             if (isCompleted) taskElement.classList.add('completed');
             else taskElement.classList.remove('completed');
        }

        fetch(`https://www.googleapis.com/tasks/v1/lists/${this.currentTaskListId}/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: task.id,
                title: task.title,
                status: newStatus
            })
        })
        .then(res => this.handleResponse(res))
        .then(() => {
            this.loadTasksForCurrentList();
        })
        .catch(error => {
            this.showToast(`Failed to update task: ${error.message}`, 'error');
            this.loadTasksForCurrentList();
        });
    }

    renderEditForm(task, todoDiv) {
        const displayHtml = todoDiv.innerHTML;
        
        let datetimeValue = '';
        if (task.due) {
            const dateObj = new Date(task.due);
            const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
            datetimeValue = localDate.toISOString().slice(0, 16);
        }

        todoDiv.innerHTML = `
            <div class="todo-edit-form">
                <input type="text" class="todo-edit-input edit-title" value="${this.escapeHtml(task.title)}" placeholder="Task title">
                <input type="text" class="todo-edit-input edit-notes" value="${this.escapeHtml(task.notes || '')}" placeholder="Notes (optional)">
                <input type="datetime-local" class="todo-edit-input edit-due" value="${datetimeValue}" title="Due Date & Time">
                <div class="todo-edit-actions">
                    <button class="btn btn-small btn-cancel-edit">Cancel</button>
                    <button class="btn btn-primary btn-small btn-save-edit">Save</button>
                </div>
            </div>
        `;

        const titleInput = todoDiv.querySelector('.edit-title');
        titleInput.focus();

        todoDiv.querySelector('.btn-cancel-edit').addEventListener('click', () => {
            todoDiv.innerHTML = displayHtml;
            todoDiv.querySelector('.todo-checkbox').addEventListener('change', (e) => {
                this.toggleTodo(task, e.target.checked);
            });
            todoDiv.querySelector('.btn-edit').addEventListener('click', () => {
                this.renderEditForm(task, todoDiv);
            });
            todoDiv.querySelector('.btn-delete').addEventListener('click', (e) => {
                this.confirmAction(e.currentTarget, 'Delete task?', () => {
                    this.deleteTodo(task.id);
                });
            });
        });

        todoDiv.querySelector('.btn-save-edit').addEventListener('click', () => {
            const newTitle = titleInput.value.trim();
            if (!newTitle) {
                this.showToast('Title cannot be empty', 'error');
                return;
            }
            const newNotes = todoDiv.querySelector('.edit-notes').value.trim();
            const newDue = todoDiv.querySelector('.edit-due').value;

            this.saveTask(task, newTitle, newNotes, newDue, todoDiv, displayHtml);
        });
    }

    saveTask(task, newTitle, newNotes, newDue, todoDiv, displayHtml) {
        if (!this.accessToken || !this.currentTaskListId) return;

        const saveBtn = todoDiv.querySelector('.btn-save-edit');
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        let dueTimestamp = null;
        if (newDue) {
            dueTimestamp = new Date(newDue).toISOString();
        }

        const updatedTask = {
            id: task.id,
            title: newTitle,
            notes: newNotes,
            status: task.status
        };

        if (dueTimestamp) {
            updatedTask.due = dueTimestamp;
        } else {
            updatedTask.due = null;
        }

        fetch(`https://www.googleapis.com/tasks/v1/lists/${this.currentTaskListId}/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        })
        .then(res => this.handleResponse(res))
        .then(() => {
            this.loadTasksForCurrentList();
        })
        .catch(error => {
            this.showToast(`Failed to save task: ${error.message}`, 'error');
            saveBtn.textContent = 'Save';
            saveBtn.disabled = false;
        });
    }

    addTodo() {
        const title = this.newTodoInput.value.trim();
        
        if (!title) {
            this.showToast('Please enter a task title', 'error');
            return;
        }
        
        if (!this.accessToken) {
            this.showToast('Please sign in with Google first', 'error');
            return;
        }

        this.addTodoBtn.textContent = 'Adding...';
        this.addTodoBtn.disabled = true;

        if (!this.currentTaskListId) {
             this.showToast('No task list selected', 'error');
             this.addTodoBtn.textContent = 'Add';
             this.addTodoBtn.disabled = false;
             return;
        }

        fetch(`https://www.googleapis.com/tasks/v1/lists/${this.currentTaskListId}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        })
        .then(res => this.handleResponse(res))
        .then((data) => {
            this.newTodoInput.value = '';
            this.addTodoBtn.textContent = 'Add';
            this.addTodoBtn.disabled = false;
            this.loadTasksForCurrentList();
        })
        .catch(error => {
            this.addTodoBtn.textContent = 'Add';
            this.addTodoBtn.disabled = false;
            this.showToast(`Failed to add task: ${error.message}`, 'error');
        });
    }

    deleteTodo(taskId) {
        if (!this.accessToken || !this.currentTaskListId) return;

        fetch(`https://www.googleapis.com/tasks/v1/lists/${this.currentTaskListId}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${this.accessToken}` }
        })
        .then(res => {
            if (res.status === 204 || res.ok) {
                this.loadTodos();
                this.showToast('Task deleted', 'success');
            } else {
                return this.handleResponse(res);
            }
        })
        .catch(error => this.showToast(`Failed to delete task: ${error.message}`, 'error'));
    }

    loadCalendar() {
        if (!this.accessToken || this.isLocalAuth) return;

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
                
                const dateStr = date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                });
                const timeStr = event.start.dateTime 
                    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    : 'All Day';

                let eventDetails = '';
                if (event.hangoutLink) {
                    eventDetails += `<a href="${event.hangoutLink}" target="_blank" class="event-meet-link" style="font-size: 0.8em; color: var(--fill-primary); text-decoration: none; display: inline-block; margin-top: 4px;">🎥 Join Meet</a>`;
                }

                eventDiv.innerHTML = `
                    <div class="event-time">
                        <div class="event-month-day">${dateStr}</div>
                        <div class="event-weekday-time">${timeStr}</div>
                    </div>
                    <div class="event-title">
                        <a href="${event.htmlLink}" target="_blank" style="color: inherit; text-decoration: none;">${this.escapeHtml(event.summary || 'Untitled Event')}</a>
                    </div>
                    ${eventDetails}
                `;
                
                eventDiv.style.cursor = 'pointer';
                eventDiv.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'A') {
                        window.open(event.htmlLink, '_blank');
                    }
                });

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
                throw new Error('Access denied. Make sure APIs are enabled.');
            }
            if (response.status === 404) {
                throw new Error('API endpoint not found. Check configuration.');
            }
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return response.json().catch(err => {
            throw new Error('Invalid API response');
        });
    }

    handleError(action, error) {
        console.error(`Error ${action}:`, error);
        this.showToast(`Error: ${error.message}`, 'error');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new HackfestDashboard();
});
