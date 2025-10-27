TicketFlow - Twig/PHP Version
A modern, responsive ticket management application built with Twig templating engine and PHP.
🚀 Features

✅ Responsive Navbar with mobile hamburger menu
✅ Landing Page with wavy hero section and decorative circles
✅ Authentication (Login/Signup) with PHP session management
✅ Dashboard with ticket statistics
✅ Full CRUD ticket management (using localStorage via JavaScript)
✅ Toast Notifications for user feedback
✅ Protected Routes with PHP session checks
✅ Fully Responsive design
✅ Accessible (ARIA labels, semantic HTML, keyboard navigation)

📦 Tech Stack

PHP 8.0+
Twig 3.0 (Templating Engine)
Vanilla JavaScript (Client-side interactivity)
CSS (External stylesheet)
Composer (Dependency management)

🔑 Demo Credentials
Email: demo@test.com
Password: password123
📥 Installation
Prerequisites

PHP 8.0 or higher
Composer
A local web server (built-in PHP server works fine)

Setup Steps

Clone the repository

bash: git clone TicketTwig-version
cd TicketTwig-version

Install dependencies

bashcomposer install

Start PHP development server

bash
php -S localhost:8000 -t public

Open browser

http://localhost:8000
🏗️ Project Structure
twig-version/
├── composer.json                # PHP dependencies
├── public/                      # Public web directory
│   ├── index.php                # Main entry point & router
│   ├── css/
│   │   └── styles.css           # Main stylesheet
│   └── js/
│       └── app.js               # Client-side JavaScript
├── templates/                   # Twig templates
│   ├── base.twig                # Base layout template
│   ├── landing.twig             # Landing page
│   ├── login.twig               # Login page
│   ├── signup.twig              # Signup page
│   ├── dashboard.twig           # Dashboard
│   ├── tickets.twig             # Tickets management
│   └── components/              # Reusable components
│       ├── navbar.twig          # Navigation bar
│       └── footer.twig          # Site footer
└── README.md
📋 How It Works
Server-Side (PHP/Twig)

Routing: Simple query parameter routing in index.php
Authentication: PHP sessions with $_SESSION['ticketapp_session']
Protected Routes: Server-side checks before rendering pages
Template Rendering: Twig renders HTML with data from PHP

Client-Side (JavaScript)

Ticket Management: JavaScript handles CRUD using localStorage
Form Validation: Real-time validation with JavaScript
Mobile Menu: Toggle functionality
Toast Notifications: Dynamic notifications
Modal: Create/Edit ticket modal

🔐 Authentication & Security
Session Management
php// Login
$_SESSION['ticketapp_session'] = [
    'user' => 'demo',
    'timestamp' => time()
];

// Check authentication
$isAuthenticated = isset($_SESSION['ticketapp_session']);

// Logout
session_destroy();
Protected Routes
php$protectedPages = ['dashboard', 'tickets'];
if (in_array($page, $protectedPages) && !$isAuthenticated) {
    $page = 'login';
}
Validation Rules

Email: Must be valid format (name@example.com)
Password: Minimum 6 characters
Title: Required, minimum 3 characters
Status: Must be 'open', 'in_progress', or 'closed'
Description: Optional, maximum 500 characters

📱 Responsive Features
Navbar

Desktop: Horizontal navigation with all links visible
Mobile: Hamburger menu with vertical navigation

Layout

Mobile: Single column, stacked elements
Tablet: 2-column grid for stats and tickets
Desktop: Multi-column layout with optimal spacing

♿ Accessibility

✅ Semantic HTML5 elements
✅ ARIA labels and descriptions
✅ Keyboard navigation support
✅ Focus visible states
✅ Error messages tied to form inputs
✅ Color contrast meets WCAG AA

🎨 Template Structure
Base Template (base.twig)
twig<!DOCTYPE html>
<html>
<head>
    {% block head %}{% endblock %}
</head>
<body>
    {% block navbar %}{% endblock %}
    {% block content %}{% endblock %}
    {% block scripts %}{% endblock %}
</body>
</html>
Page Templates
All page templates extend base.twig:

landing.twig - Landing page with hero
login.twig - Login form
signup.twig - Signup form
dashboard.twig - Statistics dashboard
tickets.twig - Ticket management

Components
Reusable components in templates/components/:

navbar.twig - Navigation bar
footer.twig - Site footer

🔄 Routing
Simple query parameter routing:
?page=landing    → Landing page
?page=login      → Login page
?page=signup     → Signup page
?page=dashboard  → Dashboard (protected)
?page=tickets    → Tickets (protected)
?page=logout     → Logout action
🎯 Key Features Implementation
1. Server-Side Routing
php$page = $_GET['page'] ?? 'landing';

// Render template
echo $twig->render($page . '.twig', $data);
2. Form Handling
phpif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle form submission
    if ($page === 'login') {
        // Validate and authenticate
    }
}
3. Ticket Management (Client-Side)
javascript// Create ticket
const newTicket = {
    id: Date.now(),
    title: formData.title,
    status: formData.status,
    // ...
};
localStorage.setItem('tickets', JSON.stringify(tickets));
🚀 Deployment
Local Development
bashphp -S localhost:8000 -t public
Production Deployment

Upload files to server
Set document root to /public
Run composer install

bashcomposer install --no-dev --optimize-autoloader

Configure web server

Apache (.htaccess)
apacheRewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L,QSA]
Nginx
nginxlocation / {
    try_files $uri $uri/ /index.php?$query_string;
}
🐛 Troubleshooting
Issue: Composer not found
Solution: Install Composer from https://getcomposer.org
Issue: PHP version too old
Solution: Upgrade to PHP 8.0+
bashphp --version
Issue: Templates not found
Solution: Check that templates are in templates/ directory relative to public/
Issue: Sessions not working
Solution:

Check PHP session configuration
Ensure session_start() is called
Check write permissions on session directory

Issue: CSS/JS not loading
Solution: Check that paths in templates use the asset() function
📝 Data Storage
Server-Side (PHP Session)
php$_SESSION['ticketapp_session'] = [...];
$_SESSION['tickets'] = [...];
Client-Side (localStorage)
javascriptlocalStorage.setItem('tickets', JSON.stringify(tickets));
🔧 Configuration
Twig Environment
php$twig = new \Twig\Environment($loader, [
    'cache' => false,       // Set to path for production
    'debug' => true,        // Set to false for production
    'auto_reload' => true
]);
Custom Twig Functions
php$twig->addFunction(new \Twig\TwigFunction('asset', function ($path) {
    return '/' . ltrim($path, '/');
}));
🎨 Customization
Change Primary Color
In public/css/styles.css:
css.btn-primary { background: #667eea; } /* Your color */
Modify Max Width
css.container { max-width: 1440px; } /* Your width */
Add New Page

Create template in templates/yourpage.twig
Add route handling in public/index.php
Access via ?page=yourpage

📞 Support
For issues or questions: yungemmy892@gmail.com

Check this README
Review PHP error logs
Ensure all dependencies are installed
Verify file permissions

🤝 Contributing
This is a learning project for HNG Stage 2.
📄 License
MIT License - Educational purposes

Built using Twig/PHP for HNG Stage 2