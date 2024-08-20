import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/Login/ForgotPassword';
import ResetPassword from './Pages/Login/ResetPassword';
import ProtectedMainLayout from './Components/ProtectedMainLayout';
import useAuthStore from './store/useAuthStore';
import Loading from './Components/Loading';
import Dashboard from './Pages/Dashboard/Dashboard';
import MyAccount from './Pages/MyAccount/MyAccount';
import AccountDetails from './Pages/MyAccount/AccountDetails';
import UpdatePassword from './Pages/MyAccount/UpdatePassword';
import Banners from './Pages/Banners/Banners';
import HeaderBanners from './Pages/Banners/HeaderBanners';
import CompanyBanners from './Pages/Banners/CompanyBanners';

function App() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  // console.log("🚀 ~ App ~ isLoggedIn:", isLoggedIn)
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Loading />
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedMainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-account" element={<MyAccount />} >
            <Route path="account-details" element={<AccountDetails />} />
            <Route path="update-password" element={<UpdatePassword />} />
          </Route>
          <Route path="/banners" element={<Banners />} >
            <Route path="header-banners" element={<HeaderBanners />} />
            <Route path="company-banners" element={<CompanyBanners />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;