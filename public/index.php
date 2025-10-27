<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new FilesystemLoader(__DIR__ . '/../templates');
$twig = new Environment($loader);

echo $twig->render('base.twig', ['name' => 'TicketTwig User']);

// Start session
session_start();

$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Serve static files (CSS, JS, images) directly
if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/', $path)) {
    $filePath = __DIR__ . '/../public' . $path;
    
    if (file_exists($filePath)) {
        $mimeTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon',
            'svg' => 'image/svg+xml'
        ];
        
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimeType = $mimeTypes[$extension] ?? 'text/plain';
        
        header('Content-Type: ' . $mimeType);
        readfile($filePath);
        exit;
    } else {
        http_response_code(404);
        exit('File not found');
    }
}

// Initialize Twig
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false,
    'debug' => true,
    'auto_reload' => true
]);

// Add custom functions to Twig
$twig->addFunction(new \Twig\TwigFunction('asset', function ($path) {
    return '/TicketTwig-version/public/' . ltrim($path, '/');
}));

// Simple routing
$page = $_GET['page'] ?? 'landing';
$method = $_SERVER['REQUEST_METHOD'];

// Check authentication
$isAuthenticated = isset($_SESSION['ticketapp_session']);

// Protected pages
$protectedPages = ['dashboard', 'tickets'];
if (in_array($page, $protectedPages) && !$isAuthenticated) {
    $page = 'login';
}

// Handle POST requests
if ($method === 'POST') {
    // Handle login
    if ($page === 'login' && isset($_POST['email'], $_POST['password'])) {
        $email = trim($_POST['email']);
        $password = trim($_POST['password']);
        
        // Demo credentials validation
        if ($email === 'demo@test.com' && $password === 'password123') {
            $_SESSION['ticketapp_session'] = [
                'user' => 'demo',
                'timestamp' => time()
            ];
            header('Location: ?page=dashboard');
            exit;
        } else {
            $_SESSION['login_error'] = 'Invalid credentials. Try demo@test.com / password123';
            header('Location: ?page=login');
            exit;
        }
    }
    
    // Handle signup
    if ($page === 'signup' && isset($_POST['name'], $_POST['email'], $_POST['password'])) {
        // In a real app, you'd save to database
        $_SESSION['ticketapp_session'] = [
            'user' => trim($_POST['email']),
            'timestamp' => time()
        ];
        $_SESSION['success_message'] = 'Account created successfully!';
        header('Location: ?page=dashboard');
        exit;
    }
}

// Handle logout
if ($page === 'logout') {
    session_destroy();
    header('Location: ?page=landing');
    exit;
}

// Load tickets from session (simulating localStorage)
$tickets = $_SESSION['tickets'] ?? [];

// Calculate stats for dashboard
$stats = [
    'total' => count($tickets),
    'open' => count(array_filter($tickets, fn($t) => $t['status'] === 'open')),
    'inProgress' => count(array_filter($tickets, fn($t) => $t['status'] === 'in_progress')),
    'closed' => count(array_filter($tickets, fn($t) => $t['status'] === 'closed'))
];

// Get messages from session
$loginError = $_SESSION['login_error'] ?? null;
$successMessage = $_SESSION['success_message'] ?? null;
unset($_SESSION['login_error'], $_SESSION['success_message']);

// Prepare template data
$data = [
    'isAuthenticated' => $isAuthenticated,
    'currentPage' => $page,
    'tickets' => $tickets,
    'stats' => $stats,
    'loginError' => $loginError,
    'successMessage' => $successMessage
];

// Render template
try {
    echo $twig->render($page . '.twig', $data);
} catch (\Twig\Error\LoaderError $e) {
    // Page not found, redirect to landing
    header('Location: ?page=landing');
    exit;

}

