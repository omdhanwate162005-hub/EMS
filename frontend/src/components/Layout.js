import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="layout">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
