const rateLimit = require('express-rate-limit');

const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false
});

// Device-level rate limit (strict: 15 per minute)
const voteLimiterDevice = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15,
    keyGenerator: (req) => {
        // Combine stable browser tokens and fingerprint with IP.
        // Even if they clear cookies (Incognito), the deterministic fingerprint will catch them.
        const cookieToken = req.body.cookieToken || 'no-cookie';
        const localToken = req.body.localStorageToken || 'no-local';
        const fingerprint = req.body.browserFingerprint || 'no-fp';
        return `${req.ip}-${cookieToken}-${localToken}-${fingerprint}`;
    },
    message: 'Too many vote attempts from this device',
    standardHeaders: true,
    legacyHeaders: false
});

// IP-level rate limit (generous for CGNAT: 150 per minute)
const voteLimiterIP = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 150,
    keyGenerator: (req) => req.ip,
    message: 'Too many vote attempts from this network',
    standardHeaders: true,
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method !== 'POST'
});

// Admin operations rate limiter - per admin ID
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per admin per 15 minutes
    keyGenerator: (req) => {
        // Rate limit per admin ID, fall back to IP if not authenticated
        return req.adminId ? `admin_${req.adminId}` : req.ip;
    },
    message: 'Too many admin requests',
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter limiter for export operations
const exportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 exports per admin per hour
    keyGenerator: (req) => `export_${req.adminId}`,
    message: 'Too many export requests. Maximum 10 per hour',
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    publicLimiter,
    voteLimiterDevice,
    voteLimiterIP,
    loginLimiter,
    adminLimiter,
    exportLimiter
};
