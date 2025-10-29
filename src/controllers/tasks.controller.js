const tasksService = require('../services/tasks.service');

const tasksController = {
    // POST /api/tasks
    async create(req, res, next) {
        try {
            const userId = req.user.id; // Viene del middleware de autenticación
            const taskData = req.body;

            const task = await tasksService.create(taskData, userId);

            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/tasks
    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const filters = req.query; // ?completed=true&priority=high

            const tasks = await tasksService.getAll(userId, filters);

            res.status(200).json({
                success: true,
                data: tasks
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/tasks/:id
    async getById(req, res, next) {
        try {
            const userId = req.user.id;
            const taskId = req.params.id;

            const task = await tasksService.getById(taskId, userId);

            res.status(200).json({
                success: true,
                data: task
            });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/tasks/:id
    async update(req, res, next) {
        try {
            const userId = req.user.id;
            const taskId = req.params.id;
            const updateData = req.body;

            const task = await tasksService.update(taskId, userId, updateData);

            res.status(200).json({
                success: true,
                message: 'Task updated successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/tasks/:id
    async delete(req, res, next) {
        try {
            const userId = req.user.id;
            const taskId = req.params.id;

            await tasksService.delete(taskId, userId);

            res.status(200).json({
                success: true,
                message: 'Task deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    // PATCH /api/tasks/:id/toggle
    async toggleComplete(req, res, next) {
        try {
            const userId = req.user.id;
            const taskId = req.params.id;

            const task = await tasksService.toggleComplete(taskId, userId);

            res.status(200).json({
                success: true,
                message: 'Task status updated',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = tasksController;