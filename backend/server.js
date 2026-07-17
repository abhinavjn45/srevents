require('dotenv').config();
// Enforce Indian Standard Time globally for the Node.js process
process.env.TZ = 'Asia/Kolkata';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// SECURITY FIX: Validate environment variables on startup
const validateEnvironment = () => {
    const required = ['JWT_SECRET', 'DB_NAME', 'DB_USER'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error(`ERROR: Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET.length < 32) {
        console.error('ERROR: JWT_SECRET must be at least 32 characters long');
        process.exit(1);
    }

    // Validate CORS_ORIGIN is set in production
    if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
        console.error('ERROR: CORS_ORIGIN must be set in production');
        process.exit(1);
    }

    console.log('[✓] Environment validation passed');
};

validateEnvironment();

// Routes
const authRoutes = require('./routes/authRoutes');
const voteRoutes = require('./routes/voteRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const auditRoutes = require('./routes/auditRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const { publicLimiter, adminLimiter, exportLimiter } = require('./middleware/rateLimiter');

// Controllers (for public routes)
const categoryController = require('./controllers/categoryController');
const creatorController = require('./controllers/creatorController');
const dashboardController = require('./controllers/dashboardController');

const app = express();

// Trust proxy to get real IP behind Nginx/Cloudflare/Load balancers
app.set('trust proxy', true);

// SECURITY FIX: Enhanced CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim());

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
};

// Security & Logging
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:']
        }
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use(cors(corsOptions));
app.use(morgan('combined'));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Public API endpoints (no authentication required)
app.use('/api/admin', publicLimiter, authRoutes);
app.use('/api', voteRoutes);
app.use('/api', settingsRoutes);

// Public GET endpoints
app.get('/api/categories', publicLimiter, categoryController.getCategories);
app.get('/api/creators', publicLimiter, creatorController.getCreators);

// Protected API endpoints (admin only) - with rate limiting
app.use('/api/admin', authMiddleware, adminLimiter, dashboardRoutes);
app.use('/api/admin', authMiddleware, adminLimiter, categoryRoutes);
app.use('/api/admin', authMiddleware, adminLimiter, creatorRoutes);
app.use('/api/admin', authMiddleware, adminLimiter, auditRoutes);
app.use('/api/admin', authMiddleware, adminLimiter, uploadRoutes);

// Export endpoint - stricter rate limiting
app.get('/api/admin/votes/export', authMiddleware, exportLimiter, dashboardController.exportVotes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS Origin: ${allowedOrigins.join(', ')}`);
});
