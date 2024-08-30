import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect, useState } from "react";
import Button from "../../Components/Button";
import useSettings from "../../store/useSettings";

export default function Settings() {
  const location = useLocation();
  const { activeSettings, setActiveSettings, resetActiveSettings } = useSettings();
  // console.log("🚀 ~ Settings ~ activeSettings:", activeSettings)

  useEffect(() => {
    resetActiveSettings();

    if (location.pathname.includes("subcategories")) {
      setActiveSettings.name("Subcategory");
    } else if (location.pathname.includes("categories")) {
      setActiveSettings.name("Category");
    } else if (location.pathname.includes("standards")) {
      setActiveSettings.name("Standard");
    } else{
      setActiveSettings.name("Product Type");
    }
  }, [location.pathname]);


  const navItems = [
    { path: "/settings/categories", label: "Categories" },
    { path: "/settings/subcategories", label: "Subcategories" },
    { path: "/settings/standards", label: "Standards" },
    { path: "/settings/product-types", label: "Product Types" },
  ];



  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Navigation navItems={navItems} />
        {!activeSettings.isCRUD && (
          <Button
            text={`Add New ${activeSettings.name}`}
            color="bg-amber-600"
            onClick={() => setActiveSettings.isCRUD(true)}
          />
        )}
      </div>
      <div className="w-full bg-white p-2 mt-2">
        <Outlet />
      </div>
    </div>
  );
}
