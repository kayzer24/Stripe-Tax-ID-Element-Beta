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

echo json_encode([
    'publishableKey' => $_ENV['STRIPE_PUBLISHABLE_KEY'] ?? '',
    'currency' => $_ENV['STRIPE_CURRENCY'] ?? 'usd',
    'amount' => intval($_ENV['STRIPE_AMOUNT'] ?? 2000),
]);
