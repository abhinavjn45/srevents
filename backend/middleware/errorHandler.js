const errorHandler = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV === 'development';
    
    // Log error with details (server-side only)
    console.error('[ERROR]', {
        timestamp: new Date().toISOString(),
        message: err.message,
        code: err.code,
        status: err.status,
        stack: isDev ? err.stack : undefined,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(422).json({
            success: false,
            message: 'File size too large (max 5MB)'
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            message: 'Unexpected file in request'
        });
    }

    // Custom validation errors - safe to expose validation details
    if (err.isValidation) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors
        });
    }

    // SQL/Database errors - NEVER expose in production
    if (err.sqlMessage || err.sql) {
        if (isDev) {
            return res.status(500).json({
                success: false,
                message: 'Database error',
                error: err.sqlMessage
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }

    // Default error - never expose stack traces to client
    const statusCode = err.status || 500;
    const response = {
        success: false,
        message: isDev ? err.message : 'An error occurred'
    };

    // Only include stack in development
    if (isDev) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
