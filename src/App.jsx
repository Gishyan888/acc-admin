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
import Companies from "./Pages/Companies/Companies";
import Company from "./Pages/Companies/Company";
import Categories from "./Pages/Settings/Categories";
import Subcategories from "./Pages/Settings/Subcategories";
import Standard from "./Pages/Settings/Standard";
import ProductType from "./Pages/Settings/ProductType";
import useModal from "./store/useModal";
import Modal from "./Components/Modal";
import { Tooltip } from "react-tooltip";
function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const { modalDetails } = useModal()

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <Router>
        <Loading />
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/recover-password" element={<ResetPassword />} />
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
              <Route path="categories" element={<Categories />} />
              <Route path="subcategories" element={<Subcategories />} />
              <Route path="standards" element={<Standard />} />
              <Route path="product-types" element={<ProductType />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Modal
        isVisible={modalDetails.isVisible}
        image={modalDetails.image}
        button1Text={modalDetails.button1Text}
        button2Text={modalDetails.button2Text}
        button1OnClick={modalDetails.button1OnClick}
        button2OnClick={modalDetails.button2OnClick}
        onClose={modalDetails.onClose}
        button1Color={modalDetails.button1Color}
        button2Color={modalDetails.button2Color}
      />
      <Tooltip
        id="tooltip"
        style={{
          backgroundColor: "#fff",
          color: "#222",
          boxShadow: "0 0 5px #ddd",
          fontSize: "1rem",
          fontWeight: "normal",
        }}
      />
    </>
  );
}

export default App;
