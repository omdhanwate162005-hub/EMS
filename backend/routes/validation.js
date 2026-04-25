const { body } = require('express-validator');

const loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

const registerValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

const employeeValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('department')
        .trim()
        .notEmpty()
        .withMessage('Department is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Department must be between 2 and 50 characters'),
    body('salary')
        .notEmpty()
        .withMessage('Salary is required')
        .isFloat({ min: 0 })
        .withMessage('Salary must be a positive number'),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required')
        .matches(/^[0-9+\-\s()]{10,20}$/)
        .withMessage('Invalid phone number format')
];

module.exports = {
    loginValidation,
    registerValidation,
    employeeValidation
};
