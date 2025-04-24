import Layout from "./Layout.jsx";

import Home from "./Home";

import Watch from "./Watch";

import ManageBanners from "./ManageBanners";

import AdminLogin from "./AdminLogin";

import AdminDashboard from "./AdminDashboard";

import ManageCustomers from "./ManageCustomers";

import App from "./App";

import UserProfile from "./UserProfile";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Watch: Watch,
    
    ManageBanners: ManageBanners,
    
    AdminLogin: AdminLogin,
    
    AdminDashboard: AdminDashboard,
    
    ManageCustomers: ManageCustomers,
    
    App: App,
    
    UserProfile: UserProfile,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Watch" element={<Watch />} />
                
                <Route path="/ManageBanners" element={<ManageBanners />} />
                
                <Route path="/AdminLogin" element={<AdminLogin />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/ManageCustomers" element={<ManageCustomers />} />
                
                <Route path="/App" element={<App />} />
                
                <Route path="/UserProfile" element={<UserProfile />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}