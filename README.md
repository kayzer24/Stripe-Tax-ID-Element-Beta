# Stripe Elements Demo

A complete demonstration of Stripe's Address Element, Tax ID Element, and Payment Element integration with real-time validation and automatic tax support.

**Live Demo:** https://stripe-tax-id-element-beta-staging.up.railway.app/

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 8.2+ |
| Package Manager | Composer |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Payments | Stripe.js v3 |
| SDK | stripe/stripe-php |

### Dependencies

- **[stripe/stripe-php](https://github.com/stripe/stripe-php)** - Official Stripe PHP SDK
- **[vlucas/phpdotenv](https://github.com/vlucas/phpdotenv)** - Environment variable management

## Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- A Stripe account (test mode keys)

### Steps

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure Stripe keys**
   
   Copy `.env.example` to `.env` and add your Stripe keys:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_CURRENCY=usd
   STRIPE_AMOUNT=2000
   ```
   
   > Get your keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

## Running the Project

### Option 1: PHP Built-in Server (Recommended)

```bash
composer serve
```

Then open: [http://localhost:8000](http://localhost:8000)

### Option 2: WAMP/XAMPP/MAMP

1. Point your web server document root to the project directory
2. Start the server
3. Access via your configured localhost URL

## Features

### Address Element
- Billing address collection mode
- Autocomplete with Google Places integration
- Real-time completion status badge

### Tax ID Element
- Automatic visibility based on customer country
- Country-specific tax ID format (only shows relevant type per country)
- Supports 60+ countries:
  - **North America**: AW, BB, BS, CA, CR, MX
  - **South America**: CL, EC, PE, SR, UY
  - **Europe**: AL, AM, AT, AZ, BA, BE, BG, BY, CH, CY, CZ, DE, DK, EE, ES, FI, FR, GB, GE, GR, HR, HU, IE, IS, IT, LI, LT, LU, LV, MD, ME, MK, MT, NL, NO, PL, PT, RO, RS, RU, SE, SI, SK, UA
  - **Asia**: AE, BD, BH, IN, KG, KH, KR, KZ, LA, NP, OM, PH, SA, SG, TH, TJ, TR, TW, UZ
  - **Oceania**: AU, NZ
  - **Africa**: AO, BF, BJ, CD, CM, CV, EG, ET, GN, KE, MA, MR, NG, SN, TZ, UG, ZA, ZM, ZW

### Payment Element
- Multiple payment methods (cards, SEPA, Klarna, etc.)
- Tabbed layout for easy selection
- Real-time completion status

### Order Summary
- Displays amount and currency
- Updates dynamically from backend

### Success Flow
- Form becomes disabled after successful payment
- Success overlay with transaction details
- "Make New Payment" button to restart

### Status Badges
- Real-time visual feedback (green = complete, yellow = incomplete)
- Shows status for: Address, Tax ID, Payment

## File Structure

```
├── index.php                      # Main demo page
├── app.js                        # Frontend JavaScript
├── config.php                    # Configuration endpoint
├── create-payment-intent.php    # Backend API endpoint
├── nginx.template.conf           # Railway Nginx configuration
├── composer.json                # PHP dependencies
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment template
└── vendor/                     # Composer dependencies
```

## Deployment

### Railway (Recommended)

1. **Create account** at [railway.app](https://railway.app)

2. **Connect GitHub repo** to Railway

3. **Add environment variables** in Railway dashboard:
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
   - `STRIPE_CURRENCY` - Currency (e.g., `usd`, `eur`)
   - `STRIPE_AMOUNT` - Amount in cents (e.g., `2000` for $20)

4. **Deploy** - Railway auto-detects PHP and deploys

5. **Generate Domain** - Go to Settings → Networking → Generate Service Domain

### Other PHP Hosting

- **Render.com** - Free PHP hosting
- **InfinityFree** - Free PHP hosting
- **Local development** - `composer serve`

## API Endpoints

### GET `/config.php`

Returns configuration for the frontend (publishable key, currency, amount).

**Response:**
```json
{
  "publishableKey": "pk_test_xxx",
  "currency": "eur",
  "amount": 2000
}
```

### POST `/create-payment-intent.php`

Creates a new PaymentIntent with automatic payment methods enabled.

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 2000,
  "currency": "usd"
}
```

## Testing

### Test Cards

Use Stripe's [test cards](https://stripe.com/docs/testing):

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined card |

### Test Tax IDs

Use any alphanumeric string in the correct format for the selected country:
- **Germany (EU VAT)**: `DE123456789`
- **UK (VAT)**: `GB123456789`
- **Australia (ABN)**: `12345678912`
- **Singapore (GST)**: `M12345678X`
- **France (EU VAT)**: `FR12345678901`

## Documentation

- [Stripe Address Element](https://stripe.com/docs/elements/address-element)
- [Stripe Tax ID Element](https://stripe.com/docs/elements/tax-id-element)
- [Stripe Payment Element](https://stripe.com/docs/payments/payment-element)
- [Stripe Tax Documentation](https://stripe.com/docs/payments/advanced/tax)

## License

MIT License
