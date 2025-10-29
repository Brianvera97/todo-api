const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authService = {
    // Registrar usuario
    async register(userData) {
        const { name, email, password } = userData;

        // Verificar si el email ya existe
        if (await User.exists({ email })) {
            throw new Error('Email already exists');
        }

        // Crear usuario (el hook pre('save') hasheará el password)
        const user = await User.create({ name, email, password });

        // Generar token
        const token = authService.generateToken(user._id);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        };
    },

    // Login
    async login(email, password) {
        // Buscar usuario (incluir password)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Comparar passwords
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generar token
        const token = authService.generateToken(user._id);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        };
    },

    // Generar JWT
    generateToken(userId) {
        return jwt.sign(
            { id: userId },                           // Payload (datos del token)
            process.env.JWT_SECRET,                   // Secret key
            { expiresIn: process.env.JWT_EXPIRES_IN } // Expiración
        );
    },

    // Verificar JWT
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
};

module.exports = authService;