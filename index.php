<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stripe Address & Tax ID Elements Demo</title>
    <script src="https://js.stripe.com/v3/"></script>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 40px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h2 {
            font-size: 18px;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .element-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            background: #fafafa;
            min-height: 60px;
        }

        .info-box {
            background: #f0f7ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        .info-box h3 {
            font-size: 14px;
            color: #667eea;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .info-box p {
            font-size: 13px;
            color: #555;
            line-height: 1.6;
        }

        .submit-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .result {
            margin-top: 20px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            display: none;
        }

        .result.show {
            display: block;
        }

        .result h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .result pre {
            background: #2d2d2d;
            color: #f8f8f8;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 12px;
            line-height: 1.5;
        }

        .error {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 10px;
            display: none;
        }

        .error.show {
            display: block;
        }

        .loading {
            text-align: center;
            padding: 20px;
            color: #667eea;
            display: none;
        }

        .loading.show {
            display: block;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: #667eea;
            color: white;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            margin-left: 10px;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            margin-left: auto;
        }

        .status-badge.incomplete {
            background: #ffeeba;
            color: #856404;
        }

        .status-badge.complete {
            background: #d4edda;
            color: #155724;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Stripe Elements Demo</h1>
            <p>Address Element + Tax ID Element Integration</p>
        </div>

        <div class="content">
            <div class="info-box">
                <h3>How It Works</h3>
                <p>
                    The Address Element collects the customer's address information. 
                    Based on the selected country, the Tax ID Element automatically shows/hides 
                    and adapts to collect the appropriate tax ID format for that region. 
                    This demo uses Stripe's test mode.
                </p>
            </div>

            <form id="payment-form">
                <div class="section">
                    <div class="section-header">
                        <h2>📍 Shipping Address <span class="badge">Required</span></h2>
                        <span class="status-badge incomplete" data-status="address">Incomplete</span>
                    </div>
                    <div id="address-element" class="element-container">
                        <!-- Address Element will be mounted here -->
                    </div>
                </div>

                <div class="section" id="tax-id-section" style="display: none;">
                    <div class="section-header">
                        <h2>🏢 Business Tax ID <span class="badge" id="tax-id-type-badge">Auto-Display</span></h2>
                        <span class="status-badge incomplete" data-status="taxId">Incomplete</span>
                    </div>
                    <div class="info-box" style="margin-bottom: 15px;">
                        <p style="margin: 0;">
                            The Tax ID field will automatically appear when you select a country 
                            that requires tax ID collection (e.g., US, UK, EU countries, etc.). 
                            Try changing the country in the address above!
                        </p>
                    </div>
                    <div id="tax-id-element" class="element-container">
                        <!-- Tax ID Element will be mounted here -->
                    </div>
                </div>

                <button type="submit" class="submit-btn" id="submit-btn">
                    Submit Form
                </button>

                <div class="error" id="error-message"></div>
                <div class="loading" id="loading">
                    <p>Processing...</p>
                </div>
            </form>

            <div class="result" id="result">
                <h3>✅ Collected Data</h3>
                <pre id="result-data"></pre>
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
