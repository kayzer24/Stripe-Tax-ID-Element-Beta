# Stripe Address & Tax ID Elements Demo

A demonstration application showcasing the integration of Stripe's Address Element and Tax ID Element with automatic tax calculation support.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 7.4+ |
| Package Manager | Composer |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Payments | Stripe.js v3 |
| SDK | stripe/stripe-php v13.0 |

### Dependencies

- **[stripe/stripe-php](https://github.com/stripe/stripe-php)** - Official Stripe PHP SDK
- **[vlucas/phpdotenv](https://github.com/vlucas/phpdotenv)** - Environment variable management

## Installation

### Prerequisites

- PHP 7.4 or higher
- Composer
- A Stripe account (test mode keys)

### Steps

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure environment variables**
   
   Edit the `.env` file with your Stripe API keys:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```
   
   > Get your keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

## Running the Project

### Option 1: PHP Built-in Server (Recommended for development)

```bash
composer serve
```

Then open: [http://localhost:8000](http://localhost:8000)

### Option 2: WAMP/XAMPP/MAMP

1. Point your web server document root to the project directory
2. Start the server
3. Access via your configured localhost URL (e.g., `http://localhost/stripe-tax-id-element`)

## Features

### Address Element
- Shipping address collection mode
- Autocomplete with Google Places integration
- Phone number field with validation
- Real-time completion status

### Tax ID Element
- Automatic visibility based on customer country
- Country-specific tax ID format detection
- Supports 60+ countries and regions:
  - **North America**: AW, BB, BS, CA, CR, MX
  - **South America**: CL, EC, PE, SR, UY
  - **Europe**: AL, AM, AT, AZ, BA, BE, BG, BY, CH, CY, CZ, DE, DK, EE, ES, FI, FR, GB, GE, GR, HR, HU, IE, IS, IT, LI, LT, LU, LV, MD, ME, MK, MT, NL, NO, PL, PT, RO, RS, RU, SE, SI, SK, UA
  - **Asia**: AE, BD, BH, IN, KG, KH, KR, KZ, LA, NP, OM, PH, SA, SG, TH, TJ, TR, TW, UZ
  - **Oceania**: AU, NZ
  - **Africa**: AO, BF, BJ, CD, CM, CV, EG, ET, GN, KE, MA, MR, NG, SN, TZ, UG, ZA, ZM, ZW

### Status Badges
- Real-time completion status for Address and Tax ID fields
- Visual feedback (green = complete, yellow = incomplete)

### Session Management
- PaymentIntent caching via sessionStorage
- Reuses existing PaymentIntent on page refresh

## File Structure

```
├── index.php                      # Main demo page
├── app.js                         # Frontend JavaScript
├── create-payment-intent.php      # Backend API endpoint
├── composer.json                  # PHP dependencies
├── .env                          # Environment variables (create from .env.example)
└── vendor/                       # Composer dependencies
```

## API Endpoints

### POST `/create-payment-intent.php`

Creates a new PaymentIntent with automatic payment methods enabled.

**Request:**
```json
{
  "amount": 2000,
  "currency": "usd"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

## Testing

Use Stripe's [test cards](https://stripe.com/docs/testing) to test the integration:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined card |

### Test Tax IDs

Use any alphanumeric string in the correct format for the selected country:
- **Germany (EU VAT)**: DE123456789
- **UK (VAT)**: GB123456789
- **Australia (ABN)**: 12345678912
- **Singapore (GST)**: M12345678X

## Documentation

- [Stripe Address Element](https://stripe.com/docs/elements/address-element)
- [Stripe Tax ID Element](https://stripe.com/docs/elements/tax-id-element)
- [Stripe Tax Documentation](https://stripe.com/docs/payments/advanced/tax)

## License

MIT License
