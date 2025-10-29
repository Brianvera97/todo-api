const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');
const authMiddleware = require('../middlewares/auth');
const {
    validateCreateTask,
    validateUpdateTask,
    validateTaskId
} = require('../middlewares/validator');

// Todas las rutas de tasks requieren autenticación
router.use(authMiddleware);

// POST /api/tasks
router.post('/', validateCreateTask, tasksController.create);

// GET /api/tasks
router.get('/', tasksController.getAll);

// GET /api/tasks/:id
router.get('/:id', validateTaskId, tasksController.getById);

// PUT /api/tasks/:id
router.put('/:id', validateTaskId, validateUpdateTask, tasksController.update);

// DELETE /api/tasks/:id
router.delete('/:id', validateTaskId, tasksController.delete);

// PATCH /api/tasks/:id/toggle
router.patch('/:id/toggle', validateTaskId, tasksController.toggleComplete);

module.exports = router;