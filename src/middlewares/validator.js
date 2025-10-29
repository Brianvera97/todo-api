const Joi = require('joi');

// Middleware genérico para validar con Joi
const validate = (schema) => {
    return (req, res, next) => {
        // Determinar qué validar según el schema
        const dataToValidate = schema.body ? req.body :
            schema.params ? req.params :
                schema.query ? req.query : req.body;

        const schemaToUse = schema.body || schema.params || schema.query || schema;

        const { error, value } = schemaToUse.validate(dataToValidate, {
            abortEarly: false, // Muestra todos los errores, no solo el primero
            stripUnknown: true // Remueve campos no definidos en el schema
        });

        if (error) {
            const errors = error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Reemplazar req con los datos validados y sanitizados
        if (schema.body) req.body = value;
        if (schema.params) req.params = value;
        if (schema.query) req.query = value;

        next();
    };
};

// ==================== SCHEMAS PARA AUTH ====================

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Must be a valid email',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Must be a valid email',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
});

// ==================== SCHEMAS PARA TASKS ====================

const createTaskSchema = Joi.object({
    title: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'Title is required'
        }),

    description: Joi.string()
        .trim()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),

    priority: Joi.string()
        .valid('low', 'medium', 'high')
        .optional()
        .messages({
            'any.only': 'Priority must be low, medium or high'
        }),

    dueDate: Joi.date()
        .iso()
        .optional()
        .messages({
            'date.format': 'Due date must be a valid date'
        })
});

const updateTaskSchema = Joi.object({
    title: Joi.string()
        .trim()
        .max(100)
        .optional()
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.max': 'Title cannot exceed 100 characters'
        }),

    description: Joi.string()
        .trim()
        .max(500)
        .optional()
        .allow('') // Permite vacío para borrar la descripción
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),

    completed: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Completed must be true or false'
        }),

    priority: Joi.string()
        .valid('low', 'medium', 'high')
        .optional()
        .messages({
            'any.only': 'Priority must be low, medium or high'
        }),

    dueDate: Joi.date()
        .iso()
        .optional()
        .messages({
            'date.format': 'Due date must be a valid date'
        })
});

const taskIdSchema = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/) // Patrón de ObjectId de MongoDB
        .required()
        .messages({
            'string.pattern.base': 'Invalid task ID',
            'any.required': 'Task ID is required'
        })
});

// ==================== EXPORTS ====================

module.exports = {
    validateRegister: validate(registerSchema),
    validateLogin: validate(loginSchema),
    validateCreateTask: validate(createTaskSchema),
    validateUpdateTask: validate(updateTaskSchema),
    validateTaskId: validate({ params: taskIdSchema })
};