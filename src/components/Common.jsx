import React, { useEffect, useState } from 'react';

export function LoadingSpinner({ size = 'default', text = '' }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`}></div>
            {text && <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>{text}</p>}
        </div>
    );
}

export function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <span className="material-icons-outlined" style={{ fontSize: '20px' }}>
                {type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'warning'}
            </span>
            {message}
        </div>
    );
}

export function ToastContainer({ toasts, removeToast }) {
    if (!toasts.length) return null;
    return (
        <div className="toast-container">
            {toasts.map(t => (
                <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
            ))}
        </div>
    );
}

export function useToast() {
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };
    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };
    return { toasts, addToast, removeToast };
}

export function EmptyState({ icon, title, description, action }) {
    return (
        <div className="empty-state">
            <span className="material-icons-outlined">{icon}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            {action && <div style={{ marginTop: '16px' }}>{action}</div>}
        </div>
    );
}

export function StatusBadge({ status }) {
    const cls = status === 'Normal' ? 'badge-success' : status === 'High' ? 'badge-danger' : 'badge-warning';
    return <span className={`badge ${cls}`}>{status}</span>;
}
