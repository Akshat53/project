console.log('Dashboard JS loaded');

// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadEvents();
    loadRecentActivity();
});

// Function to switch tabs
function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load data for the selected tab
    switch(tabName) {
        case 'events':
            loadEvents();
            break;
        case 'registrations':
            loadRegistrations();
            break;
        case 'users':
            loadUsers();
            break;
        case 'feedbacks':
            loadFeedbacks();
            break;
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');

        const stats = await response.json();

        document.getElementById('totalEvents').textContent = stats.totalEvents || 0;
        document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
        document.getElementById('totalRegistrations').textContent = stats.totalRegistrations || 0;
        document.getElementById('totalFeedbacks').textContent = stats.totalFeedbacks || 0;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        document.getElementById('totalEvents').textContent = 'N/A';
        document.getElementById('totalUsers').textContent = 'N/A';
        document.getElementById('totalRegistrations').textContent = 'N/A';
        document.getElementById('totalFeedbacks').textContent = 'N/A';
    }
}

// Load all events
async function loadEvents() {
    const container = document.getElementById('eventsTableContainer');
    container.innerHTML = '<div class="loading">Loading events...</div>';

    try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');

        const events = await response.json();

        if (events.length === 0) {
            container.innerHTML = '<div class="no-data">No events found.</div>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Max Attendees</th>
                    </tr>
                </thead>
                <tbody>
        `;

        events.forEach(event => {
            tableHTML += `
                <tr>
                    <td>${event.id}</td>
                    <td><strong>${event.title}</strong></td>
                    <td><span class="badge badge-info">${event.category}</span></td>
                    <td>${formatDate(event.date)}</td>
                    <td>${formatTime(event.time)}</td>
                    <td>${event.location}</td>
                    <td>₹${event.price}</td>
                    <td>${event.maxAttendees}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error loading events:', error);
        container.innerHTML = '<div class="no-data">Error loading events. Please try again.</div>';
    }
}

// Load all registrations
async function loadRegistrations() {
    const container = document.getElementById('registrationsTableContainer');
    container.innerHTML = '<div class="loading">Loading registrations...</div>';

    try {
        const response = await fetch('/api/dashboard/all-registrations');
        if (!response.ok) throw new Error('Failed to fetch registrations');

        const registrations = await response.json();

        if (registrations.length === 0) {
            container.innerHTML = '<div class="no-data">No registrations found.</div>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Event</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        registrations.forEach(reg => {
            tableHTML += `
                <tr>
                    <td>${reg.id}</td>
                    <td><strong>${reg.eventTitle || 'N/A'}</strong></td>
                    <td>${reg.firstName} ${reg.lastName}</td>
                    <td>${reg.email}</td>
                    <td>${reg.phone || 'N/A'}</td>
                    <td>${formatDateTime(reg.registrationDate)}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error loading registrations:', error);
        container.innerHTML = '<div class="no-data">Error loading registrations. Please try again.</div>';
    }
}

// Load all users
async function loadUsers() {
    const container = document.getElementById('usersTableContainer');
    container.innerHTML = '<div class="loading">Loading users...</div>';

    try {
        const response = await fetch('/api/dashboard/users');
        if (!response.ok) throw new Error('Failed to fetch users');

        const users = await response.json();

        if (users.length === 0) {
            container.innerHTML = '<div class="no-data">No users found.</div>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Account Type</th>
                        <th>Event Type</th>
                        <th>Age</th>
                        <th>Joined Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        users.forEach(user => {
            tableHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td><strong>${user.firstName} ${user.lastName}</strong></td>
                    <td>${user.email}</td>
                    <td><span class="badge badge-info">${user.accountType || 'N/A'}</span></td>
                    <td>${user.eventType || 'N/A'}</td>
                    <td>${user.age || 'N/A'}</td>
                    <td>${formatDateTime(user.createdAt)}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error loading users:', error);
        container.innerHTML = '<div class="no-data">Error loading users. Please try again.</div>';
    }
}

// Load all feedbacks
async function loadFeedbacks() {
    const container = document.getElementById('feedbacksTableContainer');
    container.innerHTML = '<div class="loading">Loading feedbacks...</div>';

    try {
        const response = await fetch('/api/dashboard/feedbacks');
        if (!response.ok) throw new Error('Failed to fetch feedbacks');

        const feedbacks = await response.json();

        if (feedbacks.length === 0) {
            container.innerHTML = '<div class="no-data">No feedbacks found.</div>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rating</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        feedbacks.forEach(feedback => {
            const stars = '★'.repeat(feedback.rating || 0) + '☆'.repeat(5 - (feedback.rating || 0));
            tableHTML += `
                <tr>
                    <td>${feedback.id}</td>
                    <td>${feedback.name || 'Anonymous'}</td>
                    <td>${feedback.email || 'N/A'}</td>
                    <td><span style="color: #ffc107;">${stars}</span></td>
                    <td>${feedback.message || 'No message'}</td>
                    <td>${formatDateTime(feedback.createdAt)}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error loading feedbacks:', error);
        container.innerHTML = '<div class="no-data">Error loading feedbacks. Please try again.</div>';
    }
}

// Load recent activity
async function loadRecentActivity() {
    const container = document.getElementById('recentActivityContainer');
    container.innerHTML = '<div class="loading">Loading recent activity...</div>';

    try {
        const response = await fetch('/api/dashboard/recent-registrations');
        if (!response.ok) throw new Error('Failed to fetch recent activity');

        const registrations = await response.json();

        if (registrations.length === 0) {
            container.innerHTML = '<div class="no-data">No recent activity.</div>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Attendee</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        registrations.forEach(reg => {
            tableHTML += `
                <tr>
                    <td><strong>${reg.eventTitle || 'Event #' + reg.eventId}</strong></td>
                    <td>${reg.firstName} ${reg.lastName}</td>
                    <td>${reg.email}</td>
                    <td>${reg.phone || 'N/A'}</td>
                    <td>${formatDateTime(reg.registrationDate)}</td>
                    <td><span class="badge badge-success">Registered</span></td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error loading recent activity:', error);
        container.innerHTML = '<div class="no-data">Error loading recent activity. Please try again.</div>';
    }
}

// Refresh entire dashboard
function refreshDashboard() {
    loadDashboardStats();
    loadEvents();
    loadRecentActivity();

    // Reload active tab content
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const tabText = activeTab.textContent.trim().toLowerCase();
        if (tabText.includes('registrations')) {
            loadRegistrations();
        } else if (tabText.includes('users')) {
            loadUsers();
        } else if (tabText.includes('feedbacks')) {
            loadFeedbacks();
        }
    }
}

// Utility function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// Utility function to format time
function formatTime(timeString) {
    if (!timeString) return 'N/A';
    try {
        if (timeString.includes(':')) {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        return timeString;
    } catch (error) {
        return timeString;
    }
}

// Utility function to format datetime
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'N/A';
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        return dateTimeString;
    }
}
