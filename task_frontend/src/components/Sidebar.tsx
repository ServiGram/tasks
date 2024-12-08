import React, { useEffect } from 'react';
import { DoorClosedFill, ListTask, Person } from 'react-bootstrap-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import dataService from '../services/DataService';

interface SidebarProps {
    status: boolean;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    toggleStatus: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleMouseEnter, handleMouseLeave }) => {
    const navigate = useNavigate();

    const logOut = async () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dataService.fetchAndSetTasks(token);
        }
    }, []);

    return (
        <div className="container">
            <section id="sidebar">
                <a href="#" className="brand">
                    <span className="text">&nbsp; UOLA</span>
                </a>
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <ul className="side-menu top">
                        <NavLink
                            to="/dashboard/tasks"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            {({ isActive }) => (
                                <li className={isActive ? 'active' : ''}>
                                    <ListTask />
                                    <span className="text p-2">Tasks</span>
                                </li>
                            )}
                        </NavLink>
                        <NavLink
                            to="/dashboard/profile"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            {({ isActive }) => (
                                <li className={isActive ? 'active' : ''}>
                                    <Person className="icon-circle" />
                                    <span className="text p-2">Perfil</span>
                                </li>
                            )}
                        </NavLink>
                    </ul>
                    <ul className="side-menu">
                        <li>
                            <DoorClosedFill></DoorClosedFill>
                            <a onClick={logOut} className="logout m-2">
                                <span className="text">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default Sidebar;