import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('ds_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [isAdmin, setIsAdmin] = useState(() => {
        return localStorage.getItem('ds_admin') === 'true';
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('ds_user', JSON.stringify(userData));
        localStorage.setItem('ds_admin', 'false');
        setIsAdmin(false);
    };

    const adminLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('ds_user', JSON.stringify(userData));
        localStorage.setItem('ds_admin', 'true');
        setIsAdmin(true);
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('ds_user');
        localStorage.removeItem('ds_admin');
    };

    const value = { user, isAdmin, login, adminLogin, logout, isLoggedIn: !!user };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
