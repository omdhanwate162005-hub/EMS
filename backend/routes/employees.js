const express = require('express');
const router = express.Router();
const { 
    getEmployees, 
    getEmployeeById, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee,
    getDashboardStats,
    getDepartments
} = require('../controllers/employeeController');
const { employeeValidation } = require('./validation');
const { validate } = require('../middleware/validation');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminOnly, getDashboardStats);
router.get('/departments', authMiddleware, adminOnly, getDepartments);
router.get('/', authMiddleware, adminOnly, getEmployees);
router.get('/:id', authMiddleware, adminOnly, getEmployeeById);
router.post('/', authMiddleware, adminOnly, employeeValidation, validate, createEmployee);
router.put('/:id', authMiddleware, adminOnly, employeeValidation, validate, updateEmployee);
router.delete('/:id', authMiddleware, adminOnly, deleteEmployee);

module.exports = router;
