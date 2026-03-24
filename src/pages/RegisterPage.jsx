import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import ApiService from '../api';

function RegisterPage({ onNavigate }) {
    const { login } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !password || !phone) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await ApiService.register({
                full_name: fullName,
                email,
                password,
                phone,
                date_of_birth: '', // Default values for now
                gender: ''
            });
            const data = res.data;
            if (data.status === 'success') {
                login({
                    userId: data.user_id,
                    fullName,
                    email,
                    phone
                });
                onNavigate('dashboard');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="auth-split">
            <div className="auth-split-left">
                <div className="auth-split-card">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Join DrugsSearch for your health tracking</p>
                    </div>
                    <form className="auth-body" onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" type="text" placeholder="Enter your name" value={fullName} onChange={e => setFullName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input className="form-input" type="tel" placeholder="Enter your phone" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-input" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="auth-footer">
                        <span>Already have an account? </span>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Sign In</a>
                    </div>
                </div>
            </div>
            <div className="auth-split-right">
                {/* Simplified brand panel for registry */}
                <h2>Welcome to a Healthier You</h2>
            </div>
        </div>
    );
}

export default RegisterPage;
