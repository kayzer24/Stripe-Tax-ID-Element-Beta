const stripe = Stripe('pk_test_51PmuMLDIxDXNXcZDUJ4z0ojvkwW3E7nAHYC8snMcDpAAGtY8vzAYSnsNojpjSoJMRVvJ7jdMl8bjPchTUgttt3KZ005MrKZCf5', {
    betas: ['elements_tax_id_1']
});

let elements, addressElement, taxIdElement;
let currentCountry = null;
let clientSecret = null;
let paymentIntentId = null;

const STORAGE_KEY = 'stripe_payment_intent';

const appearance = {
    theme: 'stripe',
    variables: {
        colorPrimary: '#667eea',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
    },
    rules: {
        '.Input': { border: '1px solid #e0e0e0', boxShadow: 'none' },
        '.Input:focus': { border: '1px solid #667eea', boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)' },
        '.Label': { fontWeight: '600', fontSize: '14px', marginBottom: '8px' }
    }
};

const taxIdSection = document.getElementById('tax-id-section');

const taxIdCountries = [
    'AW', 'BB', 'BS', 'CA', 'CR', 'MX',
    'CL', 'EC', 'PE', 'SR', 'UY',
    'AL', 'AM', 'AT', 'AZ', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ',
    'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GE', 'GR', 'HR', 'HU',
    'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MD', 'ME', 'MK', 'MT',
    'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'UA',
    'AE', 'BD', 'BH', 'IN', 'KG', 'KH', 'KR', 'KZ', 'LA', 'NP', 'OM',
    'PH', 'SA', 'SG', 'TH', 'TJ', 'TR', 'TW', 'UZ',
    'AU', 'NZ',
    'AO', 'BF', 'BJ', 'CD', 'CM', 'CV', 'EG', 'ET', 'GN', 'KE', 'MA',
    'MR', 'NG', 'SN', 'TZ', 'UG', 'ZA', 'ZM', 'ZW'
];

const taxIdTypeNames = {
    'AW': 'TIN', 'BB': 'TIN', 'BS': 'TIN', 'CA': 'BN/GST', 'CR': 'TIN', 'MX': 'RFC',
    'CL': 'TIN', 'EC': 'RUC', 'PE': 'RUC', 'SR': 'FIN', 'UY': 'RUC',
    'AL': 'TIN', 'AM': 'TIN', 'AT': 'VAT', 'AZ': 'TIN', 'BA': 'TIN', 'BE': 'VAT',
    'BG': 'VAT', 'BY': 'TIN', 'CH': 'VAT', 'CY': 'VAT', 'CZ': 'VAT', 'DE': 'VAT',
    'DK': 'VAT', 'EE': 'VAT', 'ES': 'CIF/NIF', 'FI': 'VAT', 'FR': 'VAT', 'GB': 'VAT',
    'GE': 'VAT', 'GR': 'VAT', 'HR': 'VAT', 'HU': 'TIN', 'IE': 'VAT', 'IS': 'VAT',
    'IT': 'VAT', 'LI': 'VAT', 'LT': 'VAT', 'LU': 'VAT', 'LV': 'VAT', 'MD': 'VAT',
    'ME': 'PIB', 'MK': 'VAT', 'MT': 'VAT', 'NL': 'VAT', 'NO': 'VAT', 'PL': 'NIP',
    'PT': 'VAT', 'RO': 'VAT', 'RS': 'PIB', 'RU': 'INN', 'SE': 'VAT', 'SI': 'VAT',
    'SK': 'VAT', 'UA': 'VAT',
    'AE': 'TRN', 'BD': 'BIN', 'BH': 'VAT', 'IN': 'GST', 'KG': 'TIN', 'KH': 'TIN',
    'KR': 'BRN', 'KZ': 'BIN', 'LA': 'TIN', 'NP': 'PAN', 'OM': 'VAT', 'PH': 'TIN',
    'SA': 'VAT', 'SG': 'GST', 'TH': 'VAT', 'TJ': 'TIN', 'TR': 'TIN', 'TW': 'VAT',
    'UZ': 'TIN',
    'AU': 'ABN', 'NZ': 'GST',
    'AO': 'TIN', 'BF': 'IFU', 'BJ': 'IFU', 'CD': 'NIF', 'CM': 'NIU', 'CV': 'NIF',
    'EG': 'TIN', 'ET': 'TIN', 'GN': 'NIF', 'KE': 'PIN', 'MA': 'VAT', 'MR': 'NIF',
    'NG': 'TIN', 'SN': 'NINEA', 'TZ': 'VAT', 'UG': 'TIN', 'ZA': 'VAT', 'ZM': 'TIN',
    'ZW': 'TIN'
};

async function initialize() {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        
        if (stored) {
            const parsed = JSON.parse(stored);
            clientSecret = parsed.clientSecret;
            paymentIntentId = parsed.paymentIntentId;
        }

        if (!clientSecret) {
            const response = await fetch('create-payment-intent.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            clientSecret = data.clientSecret;
            paymentIntentId = data.paymentIntentId;
            
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                clientSecret: clientSecret,
                paymentIntentId: paymentIntentId
            }));
        }

        createElements();

        console.log('Stripe Elements initialized');
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize: ' + error.message);
    }
}

function createElements(country = null) {
    elements = stripe.elements({ clientSecret: clientSecret, appearance });

    addressElement = elements.create('address', {
        mode: 'billing',
        autocomplete: { mode: 'automatic' },
        //fields: { phone: 'always' },
        //validation: { phone: { required: 'always' } },
        defaultValues: country ? { address: { country: country } } : {}
    });
    addressElement.mount('#address-element');
    addressElement.on('change', handleAddressChange);

    const isSupported = country ? taxIdCountries.includes(country) : false;
    
    if (isSupported) {
        taxIdSection.style.display = 'block';
        const typeBadge = document.getElementById('tax-id-type-badge');
        typeBadge.textContent = taxIdTypeNames[country] || 'Tax ID';

        taxIdElement = elements.create('taxId', {
            defaultValues: { country: country },
            visibility: 'auto'
        });
        taxIdElement.mount('#tax-id-element');
        taxIdElement.on('change', handleTaxIdChange);
        updateStatus('taxId', false, null);
    } else {
        taxIdSection.style.display = 'none';
        const typeBadge = document.getElementById('tax-id-type-badge');
        typeBadge.textContent = 'Auto-Display';
        updateStatus('taxId', true, null);
    }
}

let isRecreating = false;

function handleAddressChange(event) {
    updateStatus('address', event.complete, event.value);

    if (isRecreating) return;

    if (event.value?.address?.country) {
        const country = event.value.address.country;
        
        if (currentCountry !== country) {
            currentCountry = country;
            
            const isSupported = taxIdCountries.includes(country);
            
            if (isSupported) {
                isRecreating = true;
                addressElement.unmount();
                createElements(country);
                isRecreating = false;
            }
            
            updateTaxIdVisibility(country);
        }
    }
}

function handleTaxIdChange(event) {
    const isVisible = taxIdSection.style.display !== 'none';
    
    if (isVisible) {
        updateStatus('taxId', event.complete, event.value);
    }
}

function updateTaxIdVisibility(country) {
    const isSupported = taxIdCountries.includes(country);
    const typeBadge = document.getElementById('tax-id-type-badge');
    const typeName = taxIdTypeNames[country] || 'Tax ID';

    if (!isSupported) {
        taxIdSection.style.display = 'none';
        typeBadge.textContent = 'N/A';
        updateStatus('taxId', true, null);
    }
}

function updateStatus(type, complete, value) {
    const badge = document.querySelector(`[data-status="${type}"]`);
    if (badge) {
        badge.textContent = complete ? 'Complete' : 'Incomplete';
        badge.className = complete ? 'status-badge complete' : 'status-badge incomplete';
    }
    console.log(`${type} update:`, { complete, value });
}

document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    submitBtn.disabled = true;
    loading.classList.add('show');
    resultDiv.classList.remove('show');
    hideError();

    try {
        const addressValue = await addressElement.getValue();

        if (!addressValue.complete) {
            throw new Error('Please complete the shipping address');
        }

        const resultData = {
            address: addressValue.value,
            timestamp: new Date().toISOString()
        };

        if (taxIdSection.style.display !== 'none' && taxIdElement) {
            const taxIdValue = await taxIdElement.getValue();
            resultData.taxId = taxIdValue.value;
        }

        displayResult(resultData);
        
        sessionStorage.removeItem(STORAGE_KEY);
        clientSecret = null;
        paymentIntentId = null;
    } catch (error) {
        showError(error.message);
    } finally {
        submitBtn.disabled = false;
        loading.classList.remove('show');
    }
});

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    const resultData = document.getElementById('result-data');
    resultData.textContent = JSON.stringify(data, null, 2);
    resultDiv.classList.add('show');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

function hideError() {
    document.getElementById('error-message').classList.remove('show');
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initialize)
    : initialize();
