import React from 'react';

const AppFooter = ({ onNavigate }) => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <img src="/src/assets/logo.png" alt="Logo" />
                    <span>DrugsSearch</span>
                </div>
                <div className="footer-links">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>Home</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>About</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>Dashboard</a>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; 2026 DrugsSearch. All rights reserved.
            </div>
        </footer>
    );
};

export default AppFooter;
