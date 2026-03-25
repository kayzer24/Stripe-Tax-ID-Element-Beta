const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE', {
    betas: ['elements_tax_id_1']
});

let elements, addressElement, taxIdElement, paymentElement;
let currentCountry = null;
let clientSecret = null;
let paymentIntentId = null;
let currentAmount = 2000;
let currentCurrency = 'usd';

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

const taxIdTypes = {
    'AW': 'aw_tin', 'BB': 'bb_tin', 'BS': 'bs_tin', 'CA': 'ca_bn', 'CR': 'cr_tin', 'MX': 'mx_rfc',
    'CL': 'cl_tin', 'EC': 'ec_ruc', 'PE': 'pe_ruc', 'SR': 'sr_fin', 'UY': 'uy_ruc',
    'AL': 'al_tin', 'AM': 'am_tin', 'AT': 'eu_vat', 'AZ': 'az_tin', 'BA': 'ba_tin', 'BE': 'eu_vat',
    'BG': 'eu_vat', 'BY': 'by_tin', 'CH': 'ch_vat', 'CY': 'eu_vat', 'CZ': 'eu_vat', 'DE': 'eu_vat',
    'DK': 'eu_vat', 'EE': 'eu_vat', 'ES': 'es_cif', 'FI': 'eu_vat', 'FR': 'eu_vat', 'GB': 'gb_vat',
    'GE': 'ge_vat', 'GR': 'eu_vat', 'HR': 'eu_vat', 'HU': 'hu_tin', 'IE': 'eu_vat', 'IS': 'is_vat',
    'IT': 'eu_vat', 'LI': 'li_vat', 'LT': 'eu_vat', 'LU': 'eu_vat', 'LV': 'eu_vat', 'MD': 'md_vat',
    'ME': 'me_pib', 'MK': 'mk_vat', 'MT': 'eu_vat', 'NL': 'eu_vat', 'NO': 'no_vat', 'PL': 'pl_nip',
    'PT': 'eu_vat', 'RO': 'eu_vat', 'RS': 'rs_pib', 'RU': 'ru_inn', 'SE': 'eu_vat', 'SI': 'si_vat',
    'SK': 'eu_vat', 'UA': 'ua_vat',
    'AE': 'ae_trn', 'BD': 'bd_bin', 'BH': 'bh_vat', 'IN': 'in_gst', 'KG': 'kg_tin', 'KH': 'kh_tin',
    'KR': 'kr_brn', 'KZ': 'kz_bin', 'LA': 'la_tin', 'NP': 'np_pan', 'OM': 'om_vat', 'PH': 'ph_tin',
    'SA': 'sa_vat', 'SG': 'sg_gst', 'TH': 'th_vat', 'TJ': 'tj_tin', 'TR': 'tr_tin', 'TW': 'tw_vat',
    'UZ': 'uz_tin',
    'AU': 'au_abn', 'NZ': 'nz_gst',
    'AO': 'ao_tin', 'BF': 'bf_ifu', 'BJ': 'bj_ifu', 'CD': 'cd_nif', 'CM': 'cm_niu', 'CV': 'cv_nif',
    'EG': 'eg_tin', 'ET': 'et_tin', 'GN': 'gn_nif', 'KE': 'ke_pin', 'MA': 'ma_vat', 'MR': 'mr_nif',
    'NG': 'ng_tin', 'SN': 'sn_ninea', 'TZ': 'tz_vat', 'UG': 'ug_tin', 'ZA': 'za_vat', 'ZM': 'zm_tin',
    'ZW': 'zw_tin'
};

async function initialize() {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
        clientSecret = null;
        paymentIntentId = null;
        
        await createPaymentIntent();
        createElements();
    } catch (error) {
        showError('Failed to initialize: ' + error.message);
    }
}

function createElements(country = null) {
    elements = stripe.elements({ clientSecret: clientSecret, appearance });

    addressElement = elements.create('address', {
        mode: 'billing',
        autocomplete: { mode: 'automatic' },
        defaultValues: country ? { address: { country: country } } : {}
    });
    addressElement.mount('#address-element');
    addressElement.on('change', handleAddressChange);

    const isSupported = country ? taxIdCountries.includes(country) : false;
    
    if (isSupported) {
        taxIdSection.style.display = 'block';
        document.getElementById('tax-id-type-badge').textContent = taxIdTypeNames[country] || 'Tax ID';

        const typeCode = taxIdTypes[country];
        taxIdElement = elements.create('taxId', {
            supportedTypes: [{ type: typeCode, country: country }],
            defaultValues: { type: typeCode }
        });
        taxIdElement.mount('#tax-id-element');
        taxIdElement.on('change', handleTaxIdChange);
        updateStatus('taxId', false, null);
    } else {
        taxIdSection.style.display = 'none';
        document.getElementById('tax-id-type-badge').textContent = 'Auto-Display';
        updateStatus('taxId', true, null);
    }

    paymentElement = elements.create('payment', { layout: 'tabs' });
    paymentElement.mount('#payment-element');
    paymentElement.on('change', handlePaymentChange);
    updateStatus('payment', false, null);
}

let isRecreating = false;

async function handleAddressChange(event) {
    updateStatus('address', event.complete, event.value);

    if (isRecreating) return;

    if (event.value?.address?.country) {
        const country = event.value.address.country;
        
        if (currentCountry !== country) {
            currentCountry = country;
            
            if (!clientSecret) {
                await createPaymentIntent();
            }
            
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

async function createPaymentIntent() {
    const response = await fetch('create-payment-intent.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    clientSecret = data.clientSecret;
    paymentIntentId = data.paymentIntentId;
    currentAmount = data.amount ?? 2000;
    currentCurrency = (data.currency ?? 'usd').toUpperCase();
    
    updateOrderSummary();
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        clientSecret: clientSecret,
        paymentIntentId: paymentIntentId
    }));
}

function handleTaxIdChange(event) {
    if (taxIdSection.style.display !== 'none') {
        updateStatus('taxId', event.complete, event.value);
    }
}

function handlePaymentChange(event) {
    updateStatus('payment', event.complete, event.value);
}

function updateTaxIdVisibility(country) {
    const isSupported = taxIdCountries.includes(country);
    const typeBadge = document.getElementById('tax-id-type-badge');
    
    if (!isSupported) {
        taxIdSection.style.display = 'none';
        typeBadge.textContent = 'N/A';
        updateStatus('taxId', true, null);
    }
}

function updateStatus(type, complete) {
    const badge = document.querySelector(`[data-status="${type}"]`);
    if (badge) {
        badge.textContent = complete ? 'Complete' : 'Incomplete';
        badge.className = complete ? 'status-badge complete' : 'status-badge incomplete';
    }
}

function updateOrderSummary() {
    const formattedAmount = (currentAmount / 100).toFixed(2);
    document.getElementById('summary-amount').textContent = `$${formattedAmount}`;
    document.getElementById('summary-currency').textContent = currentCurrency;
}

function resetUI() {
    document.getElementById('success-overlay').classList.remove('show');
    document.getElementById('form-wrapper').classList.remove('form-disabled');
    document.getElementById('success-result').classList.remove('show');
    document.getElementById('success-result-data').textContent = '';
    document.getElementById('error-message').classList.remove('show');
    
    taxIdSection.style.display = 'none';
    document.getElementById('tax-id-type-badge').textContent = 'Auto-Display';
    
    updateStatus('address', false);
    updateStatus('taxId', false);
    updateStatus('payment', false);
}

function unmountElements() {
    if (addressElement) { addressElement.unmount(); addressElement = null; }
    if (taxIdElement) { taxIdElement.unmount(); taxIdElement = null; }
    if (paymentElement) { paymentElement.unmount(); paymentElement = null; }
    elements = null;
}

async function resetToNewPayment() {
    unmountElements();
    
    sessionStorage.removeItem(STORAGE_KEY);
    clientSecret = null;
    paymentIntentId = null;
    currentCountry = null;
    
    resetUI();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    await initialize();
}

document.getElementById('clear-btn').addEventListener('click', resetToNewPayment);
document.getElementById('new-payment-btn').addEventListener('click', resetToNewPayment);

document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    const loading = document.getElementById('loading');

    submitBtn.disabled = true;
    loading.classList.add('show');
    hideError();

    try {
        const addressValue = await addressElement.getValue();
        if (!addressValue.complete) {
            throw new Error('Please complete the address');
        }

        const { error: submitError } = await elements.submit();
        if (submitError) throw new Error(submitError.message);

        const resultData = {
            address: addressValue.value,
            timestamp: new Date().toISOString()
        };

        if (taxIdSection.style.display !== 'none' && taxIdElement) {
            const taxIdValue = await taxIdElement.getValue();
            resultData.taxId = taxIdValue.value;
        }

        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: 'if_required'
        });

        if (paymentError) throw new Error(paymentError.message);

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            resultData.payment = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            };
        }

        document.getElementById('success-result-data').textContent = JSON.stringify(resultData, null, 2);
        document.getElementById('form-wrapper').classList.add('form-disabled');
        document.getElementById('success-overlay').classList.add('show');
        
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
