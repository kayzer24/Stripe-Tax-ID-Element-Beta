<?php
/**
 * Stripe Address & Tax ID Elements Demo - Backend (Composer Version)
 * 
 * This version uses the official Stripe PHP SDK via Composer
 * Run: composer require stripe/stripe-php
 */

require_once 'vendor/autoload.php'; // Composer autoloader

// Set content type to JSON
header('Content-Type: application/json');

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Load environment variables (optional - requires vlucas/phpdotenv)
// If you have a .env file, uncomment:
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
// $dotenv->load();

// IMPORTANT: Replace with your actual Stripe secret key
// Or use environment variable: $_ENV['STRIPE_SECRET_KEY']
define('STRIPE_SECRET_KEY', 'sk_test_YOUR_SECRET_KEY_HERE');

try {
    // Set Stripe API key
    \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

    // Read the request body
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Create a PaymentIntent with automatic payment methods
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => 2000, // Amount in cents ($20.00)
        'currency' => 'eur',
        'automatic_payment_methods' => [
            'enabled' => true,
        ],
        'metadata' => [
            'demo' => 'address_tax_id_elements',
            'integration' => 'composer_sdk',
        ],
        // Optional: You can add shipping and billing details here
        // 'shipping' => [
        //     'name' => 'Customer Name',
        //     'address' => [
        //         'line1' => '123 Main St',
        //         'city' => 'San Francisco',
        //         'state' => 'CA',
        //         'postal_code' => '94111',
        //         'country' => 'US',
        //     ],
        // ],
    ]);

    // Return the client secret and payment intent ID
    echo json_encode([
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentId' => $paymentIntent->id,
        'status' => $paymentIntent->status,
    ]);

} catch (\Stripe\Exception\ApiErrorException $e) {
    // Stripe API error
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'type' => 'stripe_error',
    ]);
} catch (Exception $e) {
    // General error
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'type' => 'general_error',
    ]);
}
?>
