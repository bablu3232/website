import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Sidebar, TopBar } from './components/Navbar';
import { ToastContainer, useToast } from './components/Common';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UploadReportPage from './pages/UploadReportPage';
import ReviewValuesPage from './pages/ReviewValuesPage';
import ReportAnalysisPage from './pages/ReportAnalysisPage';
import ReportHistoryPage from './pages/ReportHistoryPage';
import ReportDetailPage from './pages/ReportDetailPage';
import ManualEntryPage from './pages/ManualEntryPage';
import DrugSearchPage from './pages/DrugSearchPage';
import DrugDetailPage from './pages/DrugDetailPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AboutPage from './pages/AboutPage';

function App() {
    const { isLoggedIn, isAdmin, logout, user } = useAuth();
    const [page, setPage] = useState('landing');
    const [pageData, setPageData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toasts, addToast, removeToast } = useToast();

    const isPoppingState = useRef(false);

    const navigate = (pageName, data = null) => {
        setPage(pageName);
        setPageData(data);
        window.scrollTo(0, 0);
        setSidebarOpen(false);

        if (!isPoppingState.current) {
            window.history.pushState({ page: pageName, data: data }, '', '');
        }
    };

    useEffect(() => {
        window.history.replaceState({ page: 'landing', data: null }, '', '');
    }, []);

    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state && event.state.page) {
                isPoppingState.current = true;
                setPage(event.state.page);
                setPageData(event.state.data || null);
                window.scrollTo(0, 0);
                setSidebarOpen(false);
                isPoppingState.current = false;
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('login');
        addToast('Logged out successfully', 'success');
    };

    const protectedPages = ['dashboard', 'upload', 'review-values', 'report-analysis', 'history', 'report-detail', 'manual-entry', 'drug-search', 'drug-detail', 'profile', 'change-password', 'about'];

    useEffect(() => {
        if (!isLoggedIn && protectedPages.includes(page)) {
            navigate('landing');
        }
        if (isLoggedIn && !isAdmin && (page === 'login' || page === 'register')) {
            navigate('dashboard');
        }
        if (isLoggedIn && isAdmin && (page === 'login' || page === 'register' || page === 'admin-login')) {
            navigate('admin-dashboard');
        }
    }, [isLoggedIn, page, isAdmin]);

    const pageTitle = {
        'dashboard': 'Dashboard', 'upload': 'Upload Report', 'review-values': 'Review Values',
        'report-analysis': 'Analysis', 'history': 'Report History', 'report-detail': 'Report Detail',
        'manual-entry': 'Manual Entry', 'drug-search': 'Drug Search', 'drug-detail': 'Drug Detail',
        'profile': 'Profile', 'change-password': 'Change Password', 'about': 'About',
        'admin-dashboard': 'Admin Dashboard',
    };

    const authPages = ['login', 'register', 'forgot-password', 'admin-login'];
    const isAuthPage = authPages.includes(page);
    const isAdminDashboard = page === 'admin-dashboard';
    const isLandingPage = page === 'landing';

    if (isLandingPage) {
        return (
            <>
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <LandingPage onNavigate={navigate} />
            </>
        );
    }

    if (isAuthPage) {
        return (
            <>
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                {page === 'login' && <LoginPage onNavigate={navigate} />}
                {page === 'register' && <RegisterPage onNavigate={navigate} />}
                {page === 'forgot-password' && <ForgotPasswordPage onNavigate={navigate} />}
                {page === 'admin-login' && <AdminLoginPage onNavigate={navigate} />}
            </>
        );
    }

    if (isAdminDashboard) {
        return (
            <>
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <AdminDashboardPage onNavigate={navigate} />
            </>
        );
    }

    // Main layout
    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="app-layout">
                <Sidebar
                    currentPage={page}
                    onNavigate={navigate}
                    onLogout={handleLogout}
                    sidebarOpen={sidebarOpen}
                    onCloseSidebar={() => setSidebarOpen(false)}
                />
                <div className="main-content">
                    <TopBar
                        title={pageTitle[page] || 'DrugSearch'}
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    />
                    {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
                    {page === 'upload' && <UploadReportPage onNavigate={navigate} />}
                    {page === 'review-values' && <ReviewValuesPage onNavigate={navigate} data={pageData} />}
                    {page === 'report-analysis' && <ReportAnalysisPage onNavigate={navigate} data={pageData} />}
                    {page === 'history' && <ReportHistoryPage onNavigate={navigate} />}
                    {page === 'report-detail' && <ReportDetailPage onNavigate={navigate} data={pageData} />}
                    {page === 'manual-entry' && <ManualEntryPage onNavigate={navigate} />}
                    {page === 'drug-search' && <DrugSearchPage onNavigate={navigate} />}
                    {page === 'drug-detail' && <DrugDetailPage onNavigate={navigate} data={pageData} />}
                    {page === 'profile' && <ProfilePage onNavigate={navigate} />}
                    {page === 'change-password' && <ChangePasswordPage onNavigate={navigate} />}
                    {page === 'about' && <AboutPage onNavigate={navigate} />}
                </div>
            </div>
        </>
    );
}

export default App;
