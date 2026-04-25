const { pool } = require('../config/database');

const getEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', department = '', sortBy = 'id', order = 'DESC' } = req.query;
        
        const offset = (page - 1) * limit;
        const validSortColumns = ['id', 'name', 'department', 'salary', 'phone'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        let query = 'SELECT * FROM employees WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM employees WHERE 1=1';
        const params = [];
        const countParams = [];

        if (search) {
            query += ' AND (name LIKE ? OR phone LIKE ?)';
            countQuery += ' AND (name LIKE ? OR phone LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
            countParams.push(`%${search}%`, `%${search}%`);
        }

        if (department) {
            query += ' AND department = ?';
            countQuery += ' AND department = ?';
            params.push(department);
            countParams.push(department);
        }

        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;

        query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [employees] = await pool.query(query, params);

        res.json({
            success: true,
            data: {
                employees,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalEmployees: total,
                    hasMore: offset + employees.length < total
                }
            }
        });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees'
        });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [employees] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            data: employees[0]
        });
    } catch (error) {
        console.error('Get employee by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employee'
        });
    }
};

const createEmployee = async (req, res) => {
    try {
        const { name, department, salary, phone } = req.body;

        const [result] = await pool.query(
            'INSERT INTO employees (name, department, salary, phone) VALUES (?, ?, ?, ?)',
            [name, department, salary, phone]
        );

        const [newEmployee] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: newEmployee[0]
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating employee'
        });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, salary, phone } = req.body;

        const [existing] = await pool.query(
            'SELECT id FROM employees WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        await pool.query(
            'UPDATE employees SET name = ?, department = ?, salary = ?, phone = ? WHERE id = ?',
            [name, department, salary, phone, id]
        );

        const [updatedEmployee] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: updatedEmployee[0]
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating employee'
        });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.query(
            'SELECT id FROM employees WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        await pool.query('DELETE FROM employees WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting employee'
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM employees');
        const [avgSalaryResult] = await pool.query('SELECT AVG(salary) as avgSalary FROM employees');
        const [deptCountResult] = await pool.query('SELECT COUNT(DISTINCT department) as deptCount FROM employees');
        const [recentEmployees] = await pool.query('SELECT * FROM employees ORDER BY created_at DESC LIMIT 5');

        res.json({
            success: true,
            data: {
                totalEmployees: totalResult[0].total || 0,
                avgSalary: parseFloat(avgSalaryResult[0].avgSalary) || 0,
                departmentCount: deptCountResult[0].deptCount || 0,
                recentEmployees
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats'
        });
    }
};

const getDepartments = async (req, res) => {
    try {
        const [departments] = await pool.query(
            'SELECT DISTINCT department FROM employees ORDER BY department'
        );

        res.json({
            success: true,
            data: departments.map(d => d.department)
        });
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching departments'
        });
    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getDashboardStats,
    getDepartments
};
