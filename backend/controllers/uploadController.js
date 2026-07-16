const upload = require('../config/multer');

// Upload image
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const url = `/uploads/${req.file.filename}`;

        res.status(201).json({
            success: true,
            data: { url }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadImage
};
