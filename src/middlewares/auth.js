const authService = require('../services/auth.service');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Extraer token del header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1]; // "Bearer TOKEN" → "TOKEN"

        // 2. Verificar token
        const decoded = authService.verifyToken(token);

        // 3. Buscar usuario
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // 4. Agregar usuario a req
        req.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        next(); // Continuar al siguiente middleware o controller
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;