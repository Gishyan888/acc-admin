import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login/Login";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import ResetPassword from "./Pages/Login/ResetPassword";
import ProtectedMainLayout from "./Components/ProtectedMainLayout";
import useAuthStore from "./store/useAuthStore";
import Loading from "./Components/Loading";
import Dashboard from "./Pages/Dashboard/Dashboard";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Banners from "./Pages/Banners/Banners";
import CreateEditBanner from "./Pages/Banners/CreateEditBanner";
import Cms from "./Pages/CMS/Cms";
import Settings from "./Pages/Settings/Settings";
import Categories from "./Pages/Settings/components/categories/Categories ";
import Subcategories from "./Pages/Settings/components/subcategories/Subcategories ";
import Products from "./Pages/Settings/components/products/Products";
import Standards from "./Pages/Settings/components/standards/Standards";
import Region from "./Pages/Settings/components/region/Region";
import Companies from "./Pages/Companies/Companies";
import Company from "./Pages/Companies/Company";
function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Loading />
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedMainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/banners">
            <Route path="header-banners" element={<Banners />} />
            <Route
              path="header-banners/:id/edit"
              element={<CreateEditBanner />}
            />
            <Route
              path="header-banners/create"
              element={<CreateEditBanner />}
            />
            <Route path="company-banners" element={<Banners />} />
            <Route
              path="company-banners/:id/edit"
              element={<CreateEditBanner />}
            />
            <Route
              path="company-banners/create"
              element={<CreateEditBanner />}
            />
          </Route>
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:id" element={<Company />} />
          <Route path="/cms">
            <Route path="overview" element={<Cms />} />
            <Route path="product-in-action" element={<Cms />} />
          </Route>
          <Route path="/settings" element={<Settings />}>
            <Route path="categories" element={<Categories />}></Route>
            <Route path="subcategories" element={<Subcategories />}></Route>
            <Route path="products" element={<Products />}></Route>
            <Route path="standards" element={<Standards />}></Route>
            <Route path="region" element={<Region />}></Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
