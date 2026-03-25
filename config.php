<?php
/**
 * Stripe Address & Tax ID Elements Demo - Backend
 * 
 * Configuration endpoint - returns public keys to frontend
 */

require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

function getEnvVar(string $name, $default = ''): string {
    return $_ENV[$name] ?? $_SERVER[$name] ?? getenv($name) ?: $default;
}

echo json_encode([
    'publishableKey' => getEnvVar('STRIPE_PUBLISHABLE_KEY', ''),
    'currency' => getEnvVar('STRIPE_CURRENCY', 'usd'),
    'amount' => intval(getEnvVar('STRIPE_AMOUNT', '2000')),
]);
