import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { employeeAPI } from '../services/api';
import Loading from '../components/Loading';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        salary: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await employeeAPI.getDepartments();
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        if (!formData.salary) {
            newErrors.salary = 'Salary is required';
        } else if (parseFloat(formData.salary) <= 0) {
            newErrors.salary = 'Salary must be a positive number';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^[0-9+\-\s()]{10,20}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await employeeAPI.create(formData);
            navigate('/employees');
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="fade-in">
                <nav aria-label="breadcrumb mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                        <li className="breadcrumb-item active">Add Employee</li>
                    </ol>
                </nav>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-4">
                                <h3 className="fw-bold mb-4">
                                    <i className="fas fa-user-plus me-2 text-primary"></i>
                                    Add New Employee
                                </h3>

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">
                                                Full Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                            {errors.name && (
                                                <div className="invalid-feedback">{errors.name}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">
                                                Department <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="department"
                                                className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                                                value={formData.department}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Department</option>
                                                <option value="HR">HR</option>
                                                <option value="IT">IT</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Sales">Sales</option>
                                                <option value="Operations">Operations</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Design">Design</option>
                                            </select>
                                            {errors.department && (
                                                <div className="invalid-feedback">{errors.department}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">
                                                Salary ($) <span className="text-danger">*</span>
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input
                                                    type="number"
                                                    name="salary"
                                                    className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                                                    placeholder="50000"
                                                    value={formData.salary}
                                                    onChange={handleChange}
                                                    min="0"
                                                    step="0.01"
                                                />
                                                {errors.salary && (
                                                    <div className="invalid-feedback">{errors.salary}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">
                                                Phone <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                placeholder="+1 (555) 123-4567"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                            {errors.phone && (
                                                <div className="invalid-feedback">{errors.phone}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-plus me-2"></i>
                                                    Add Employee
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary px-4"
                                            onClick={() => navigate('/employees')}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddEmployee;
