<?php
/**
 * Stripe Address & Tax ID Elements Demo - Backend
 * 
 * Creates a PaymentIntent and returns the client secret
 * for initializing Stripe Elements.
 */

require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;
use Stripe\Stripe;
use Stripe\PaymentIntent;

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
}

function getEnvVar(string $name, $default = ''): string {
    return $_ENV[$name] ?? $_SERVER[$name] ?? getenv($name) ?: $default;
}

$apiKey = getEnvVar('STRIPE_SECRET_KEY');
if (empty($apiKey)) {
    http_response_code(500);
    echo json_encode(['error' => 'Stripe API key not configured']);
    exit;
}

Stripe::setApiKey($apiKey);

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true) ?? [];

    $currency = $data['currency'] ?? getEnvVar('STRIPE_CURRENCY', 'usd');
    $amount = $data['amount'] ?? intval(getEnvVar('STRIPE_AMOUNT', '2000'));

    $paymentIntent = PaymentIntent::create([
        'amount' => $amount,
        'currency' => strtolower($currency),
        'automatic_payment_methods' => ['enabled' => true],
        'metadata' => ['demo' => 'address_tax_id_elements'],
    ]);

    echo json_encode([
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentId' => $paymentIntent->id,
        'amount' => $amount,
        'currency' => $currency,
    ]);

} catch (\Stripe\Exception\ApiErrorException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
