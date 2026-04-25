import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { employeeAPI } from '../services/api';
import Loading from '../components/Loading';

const ViewEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [departments, setDepartments] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

    useEffect(() => {
        fetchEmployees();
    }, [currentPage, search, department, sortBy, sortOrder]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await employeeAPI.getAll({
                page: currentPage,
                limit: 10,
                search,
                department,
                sortBy,
                order: sortOrder
            });
            setEmployees(response.data.data.employees);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await employeeAPI.getDepartments();
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchEmployees();
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(column);
            setSortOrder('ASC');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        
        try {
            await employeeAPI.delete(deleteModal.id);
            setDeleteModal({ show: false, id: null, name: '' });
            fetchEmployees();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting employee');
        }
    };

    const confirmDelete = (id, name) => {
        setDeleteModal({ show: true, id, name });
    };

    const SortIcon = ({ column }) => {
        if (sortBy !== column) return <i className="fas fa-sort ms-1 text-muted"></i>;
        return <i className={`fas fa-sort-${sortOrder === 'ASC' ? 'up' : 'down'} ms-1`}></i>;
    };

    return (
        <Layout>
            <div className="fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">View Employees</h2>
                    <Link to="/add-employee" className="btn btn-primary">
                        <i className="fas fa-plus me-2"></i>Add Employee
                    </Link>
                </div>

                <div className="card shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                        <form onSubmit={handleSearch} className="row g-3">
                            <div className="col-md-4">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="fas fa-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name or phone..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={department}
                                    onChange={(e) => {
                                        setDepartment(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="name">Name</option>
                                    <option value="salary">Salary</option>
                                    <option value="department">Department</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <button type="submit" className="btn btn-primary me-2">
                                    <i className="fas fa-filter me-1"></i> Filter
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setSearch('');
                                        setDepartment('');
                                        setSortBy('id');
                                        setSortOrder('DESC');
                                        setCurrentPage(1);
                                    }}
                                >
                                    <i className="fas fa-redo"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="table-container">
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                                                Name <SortIcon column="name" />
                                            </th>
                                            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('department')}>
                                                Department <SortIcon column="department" />
                                            </th>
                                            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('salary')}>
                                                Salary <SortIcon column="salary" />
                                            </th>
                                            <th>Phone</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5">
                                                    <i className="fas fa-users fa-3x text-muted mb-3 d-block"></i>
                                                    <p className="text-muted mb-0">No employees found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            employees.map((emp) => (
                                                <tr key={emp.id}>
                                                    <td className="fw-semibold">{emp.name}</td>
                                                    <td>
                                                        <span className="badge bg-primary">{emp.department}</span>
                                                    </td>
                                                    <td className="fw-semibold text-success">
                                                        ${parseFloat(emp.salary).toLocaleString()}
                                                    </td>
                                                    <td>{emp.phone}</td>
                                                    <td className="text-center">
                                                        <Link
                                                            to={`/edit-employee/${emp.id}`}
                                                            className="btn btn-sm btn-warning btn-action"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm btn-danger btn-action"
                                                            onClick={() => confirmDelete(emp.id, emp.name)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                    <div className="text-muted">
                                        Showing {((pagination.currentPage - 1) * 10) + 1} to{' '}
                                        {Math.min(pagination.currentPage * 10, pagination.totalEmployees)} of{' '}
                                        {pagination.totalEmployees} entries
                                    </div>
                                    <nav>
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                >
                                                    <i className="fas fa-chevron-left"></i>
                                                </button>
                                            </li>
                                            {[...Array(pagination.totalPages)].map((_, i) => (
                                                <li
                                                    key={i}
                                                    className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                                >
                                                    <i className="fas fa-chevron-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {deleteModal.show && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                                        Confirm Delete
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setDeleteModal({ show: false, id: null, name: '' })}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete employee <strong>{deleteModal.name}</strong>?</p>
                                    <p className="text-muted mb-0">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                    >
                                        <i className="fas fa-trash me-1"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ViewEmployees;
