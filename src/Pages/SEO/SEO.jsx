import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect } from "react";
import Button from "../../Components/Button";
import useSettings from "../../store/useSettings";

export default function SEO() {
  const location = useLocation();
  const { activeSettings, setActiveSettings, resetActiveSettings } = useSettings();

  useEffect(() => {
    resetActiveSettings();

    if (location.pathname.includes("/seo/homepage")) {
      setActiveSettings.name("Homepage");
    } else if (location.pathname.includes("/seo/categories")) {
      setActiveSettings.name("Categories/Subcategories");
    } else if (location.pathname.includes("/seo/products")) {
      setActiveSettings.name("Products");
    } else{
      setActiveSettings.name("Blog");
    }
  }, [location.pathname]);


  const navItems = [
    { path: "/seo/homepage", label: "Homepage" },
    { path: "/seo/categories", label: "Categories/Subcategories" },
    { path: "/seo/products", label: "Products" },
    { path: "/seo/blog", label: "Blog" },
  ];



  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Navigation navItems={navItems} />
      </div>
      <div className="w-full bg-white p-2 mt-2">
        <Outlet />
      </div>
    </div>
  );
}
