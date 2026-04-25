import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { employeeAPI } from '../services/api';
import Loading from '../components/Loading';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        avgSalary: 0,
        departmentCount: 0,
        recentEmployees: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await employeeAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Layout><Loading /></Layout>;
    }

    return (
        <Layout>
            <div className="fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">Dashboard</h2>
                    <Link to="/add-employee" className="btn btn-primary">
                        <i className="fas fa-plus me-2"></i>Add Employee
                    </Link>
                </div>

                <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                        <div className="stat-card">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-primary bg-opacity-10 text-primary me-3">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div>
                                    <h3 className="mb-1 fw-bold">{stats.totalEmployees}</h3>
                                    <p className="text-muted mb-0">Total Employees</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="stat-card">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-success bg-opacity-10 text-success me-3">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div>
                                    <h3 className="mb-1 fw-bold">${stats.avgSalary.toFixed(2)}</h3>
                                    <p className="text-muted mb-0">Average Salary</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="stat-card">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-info bg-opacity-10 text-info me-3">
                                    <i className="fas fa-building"></i>
                                </div>
                                <div>
                                    <h3 className="mb-1 fw-bold">{stats.departmentCount}</h3>
                                    <p className="text-muted mb-0">Departments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-container fade-in">
                    <div className="p-4 border-bottom">
                        <h5 className="mb-0 fw-semibold">
                            <i className="fas fa-clock me-2 text-muted"></i>
                            Recent Employees
                        </h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Salary</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">
                                            No employees found. Add your first employee to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    stats.recentEmployees.map((emp) => (
                                        <tr key={emp.id}>
                                            <td className="fw-semibold">{emp.name}</td>
                                            <td>
                                                <span className="badge bg-primary">{emp.department}</span>
                                            </td>
                                            <td>${parseFloat(emp.salary).toFixed(2)}</td>
                                            <td>{emp.phone}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
