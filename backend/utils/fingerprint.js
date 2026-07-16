const crypto = require('crypto');

// Generate browser fingerprint
const generateBrowserFingerprint = (userAgent, screenResolution, timezone) => {
    const data = `${userAgent}-${screenResolution}-${timezone}`;
    return crypto.createHash('sha256').update(data).digest('hex');
};

// Parse user agent to extract browser and OS info
const parseUserAgent = (userAgent) => {
    let browser = 'Unknown';
    let os = 'Unknown';
    let deviceType = 'Desktop';

    // Browser detection
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Chromium') === -1) {
        browser = 'Chrome';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        browser = 'Safari';
    } else if (userAgent.indexOf('Firefox') > -1) {
        browser = 'Firefox';
    } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg') > -1) {
        browser = 'Edge';
    }

    // OS detection
    if (userAgent.indexOf('Win') > -1) {
        os = 'Windows';
    } else if (userAgent.indexOf('Mac') > -1) {
        os = 'MacOS';
    } else if (userAgent.indexOf('Linux') > -1) {
        os = 'Linux';
    } else if (userAgent.indexOf('Android') > -1) {
        os = 'Android';
        deviceType = 'Mobile';
    } else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
        os = 'iOS';
        deviceType = userAgent.indexOf('iPad') > -1 ? 'Tablet' : 'Mobile';
    }

    return { browser, os, deviceType };
};

// Validate Turnstile token
const validateTurnstile = async (token) => {
    try {
        // Bypass only for missing or placeholder configuration
        const secret = process.env.TURNSTILE_SECRET_KEY;
        if (!secret || secret === 'your_turnstile_secret_key') {
            return true;
        }

        const response = await require('axios').post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                secret: secret,
                response: token
            }
        );

        return response.data.success;
    } catch (error) {
        console.error('Turnstile validation error:', error.message);
        return false;
    }
};

module.exports = {
    generateBrowserFingerprint,
    parseUserAgent,
    validateTurnstile
};
