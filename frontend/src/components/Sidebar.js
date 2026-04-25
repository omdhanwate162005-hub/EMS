import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
        { path: '/add-employee', icon: 'fa-user-plus', label: 'Add Employee' },
        { path: '/employees', icon: 'fa-users', label: 'View Employees' }
    ];

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <>
            <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>
            <button className="mobile-toggle" onClick={toggleSidebar}>
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <i className="fas fa-building"></i>
                        <span>EMS</span>
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => window.innerWidth <= 768 && toggleSidebar()}
                        >
                            <i className={`fas ${item.icon}`}></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px', opacity: 0.8 }}>
                        <i className="fas fa-user-circle me-2"></i>
                        {user?.username}
                    </div>
                    <button 
                        className="nav-item w-100 text-start"
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', borderLeft: '3px solid transparent' }}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
