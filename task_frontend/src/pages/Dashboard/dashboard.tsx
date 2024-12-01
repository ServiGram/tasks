import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './dashboard.css';
import { Outlet } from 'react-router-dom';
import Tasks from '../Tasks/tasks';

const Dashboard: React.FC = () => {
    const [status, setStatus] = useState<boolean>(true);
    const handleMouseEnter = () => setStatus(false);
    const handleMouseLeave = () => setStatus(true);
    const toggleStatus = () => setStatus(!status);

    return (
        <section className="content" id="content">
            <Sidebar
                status={status}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                toggleStatus={toggleStatus}
            />
            <main className="dashboard-content">
                <Outlet />
            </main>
        </section>
    );
};
export default Dashboard;