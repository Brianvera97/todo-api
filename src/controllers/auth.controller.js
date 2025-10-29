const authService = require('../services/auth.service');

const authController = {
    // POST /api/auth/register
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;

            const result = await authService.register({ name, email, password });
            console.log(result);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/auth/login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await authService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;