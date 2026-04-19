// newtab.js - Main script for the landing page

document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('auth-button');
    const bookmarksList = document.getElementById('bookmarks-list');
    const addBookmarkBtn = document.getElementById('add-bookmark');
    const todosList = document.getElementById('todos-list');
    const newTodoInput = document.getElementById('new-todo');
    const addTodoBtn = document.getElementById('add-todo');
    const calendarEvents = document.getElementById('calendar-events');

    let accessToken = null;

    // Check if already authenticated
    chrome.identity.getAuthToken({ interactive: false }, function(token) {
        if (token) {
            accessToken = token;
            authButton.textContent = 'Signed In';
            authButton.disabled = true;
            loadData();
        } else {
            authButton.textContent = 'Sign in with Google';
        }
    });

    authButton.addEventListener('click', function() {
        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            if (token) {
                accessToken = token;
                authButton.textContent = 'Signed In';
                authButton.disabled = true;
                loadData();
            }
        });
    });

    // Load bookmarks
    function loadBookmarks() {
        chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
            bookmarksList.innerHTML = '';
            function processBookmarks(nodes) {
                nodes.forEach(node => {
                    if (node.children) {
                        processBookmarks(node.children);
                    } else if (node.url) {
                        const bookmarkDiv = document.createElement('div');
                        bookmarkDiv.className = 'bookmark';
                        bookmarkDiv.innerHTML = `<a href="${node.url}" target="_blank">${node.title}</a>`;
                        bookmarksList.appendChild(bookmarkDiv);
                    }
                });
            }
            processBookmarks(bookmarkTreeNodes);
        });
    }

    // Load Google Tasks
    function loadTodos() {
        if (!accessToken) return;
        fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            todosList.innerHTML = '';
            data.items.forEach(task => {
                const todoDiv = document.createElement('div');
                todoDiv.className = 'todo';
                todoDiv.textContent = task.title;
                todosList.appendChild(todoDiv);
            });
        })
        .catch(error => console.error('Error loading todos:', error));
    }

    // Load Google Calendar events
    function loadCalendar() {
        if (!accessToken) return;
        const now = new Date();
        const timeMin = now.toISOString();
        const timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Next 7 days

        fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            calendarEvents.innerHTML = '';
            data.items.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                const start = new Date(event.start.dateTime || event.start.date);
                eventDiv.textContent = `${start.toLocaleDateString()} - ${event.summary}`;
                calendarEvents.appendChild(eventDiv);
            });
        })
        .catch(error => console.error('Error loading calendar:', error));
    }

    // Add bookmark
    addBookmarkBtn.addEventListener('click', function() {
        const title = prompt('Enter bookmark title:');
        const url = prompt('Enter bookmark URL:');
        if (title && url) {
            chrome.bookmarks.create({ title, url });
            loadBookmarks();
        }
    });

    // Add todo
    addTodoBtn.addEventListener('click', function() {
        const title = newTodoInput.value.trim();
        if (title && accessToken) {
            fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            })
            .then(() => {
                newTodoInput.value = '';
                loadTodos();
            })
            .catch(error => console.error('Error adding todo:', error));
        }
    });

    function loadData() {
        loadBookmarks();
        loadTodos();
        loadCalendar();
    }

    // Initial load
    loadBookmarks();
});