import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect } from "react";
import useSeo from "../../store/useSeo";

export default function SEO() {
  const location = useLocation();
  const { activeSeo, setActiveSeo, resetActiveSeo } = useSeo();
  useEffect(() => {
    resetActiveSeo();

    if (location.pathname.includes("/seo/homepage")) {
      setActiveSeo.name("Homepage");
    } else if (location.pathname.includes("/seo/categories")) {
      setActiveSeo.name("Categories/Subcategories");
    } else if (location.pathname.includes("/seo/products")) {
      setActiveSeo.name("Products");
    }else if(location.pathname.includes("/seo/custom-page")){
      setActiveSeo.name("Custom Page");
    } else {
      setActiveSeo.name("Blog");
    }
  }, [location.pathname]);

  console.log("🚀 ~ SEO ~ activeSeo:", activeSeo);

  const navItems = [
    { path: "/seo/homepage", label: "Homepage" },
    { path: "/seo/categories", label: "Categories/Subcategories" },
    { path: "/seo/products", label: "Products" },
    { path: "/seo/blog", label: "Blog" },
    // { path: "/seo/custom-page", label: "Custom Page" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Navigation navItems={navItems} />
      </div>
      <div className="w-full bg-white p-2 mt-2">
        <div className="p-2">
        <Outlet />
        </div>
      </div>
    </div>
  );
}
