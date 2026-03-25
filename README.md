# Stripe Elements Demo

A complete demonstration of Stripe's Address Element, Tax ID Element, and Payment Element integration with real-time validation and automatic tax support.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 7.4+ |
| Package Manager | Composer |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Payments | Stripe.js v3 |
| SDK | stripe/stripe-php |

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
   
   Copy `.env.example` to `.env` and add your Stripe API keys:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
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
├── app.js                         # Frontend JavaScript
├── create-payment-intent.php      # Backend API endpoint
├── composer.json                  # PHP dependencies
├── .env                          # Environment variables (not committed)
├── .env.example                  # Environment template
├── README.md                      # This file
└── vendor/                       # Composer dependencies
```

## GitHub Actions Deployment

### Setup

1. **Add GitHub Secrets** in your repository settings:

   Go to `Settings → Secrets and variables → Actions` and add:
   - `SSH_HOST` - Your server hostname or IP
   - `SSH_USERNAME` - SSH username
   - `SSH_PASSWORD` - SSH password
   - `SSH_PORT` - SSH port (default: 22)
   - `DEPLOY_PATH` - Path on server where to deploy

2. **Push to main branch** - Workflow triggers automatically

3. **Or trigger manually** - Go to Actions tab → Deploy → Run workflow

### Workflow Features

- PHP 8.2 setup
- Composer dependencies installation
- PHP syntax validation
- SSH deployment with git pull
- Concurrency control (cancels previous deploys)

### Hosting Requirements

- SSH access to your server
- Git installed on server
- Composer installed on server

## API Endpoints

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
