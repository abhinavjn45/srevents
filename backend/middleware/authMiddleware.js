const jwt = require('jwt-simple');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.authToken;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        req.adminId = decoded.adminId;
        req.email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
};

module.exports = authMiddleware;
