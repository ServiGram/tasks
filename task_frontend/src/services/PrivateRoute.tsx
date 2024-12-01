import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface PrivateRouteProps {
    isAuthenticated: boolean;
    redirectPath?: string;
}

const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000); // Coloca el tiempo actual en segundos
        return decoded.exp ? decoded.exp > currentTime : false;
    } catch (error) {
        return false;
    }
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, redirectPath = '/' }) => {
    const token = localStorage.getItem('token');
    const isValid = isTokenValid(token);

    if (!isAuthenticated || !isValid) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;

