<?php
$port = getenv('PORT') ?: '8000';
$host = '0.0.0.0';
$root = __DIR__ . '/public';

$command = sprintf(
    'php -S %s:%s -t %s',
    $host,
    $port,
    $root
);

echo "Starting PHP server on http://{$host}:{$port}\n";
passthru($command);
?>
