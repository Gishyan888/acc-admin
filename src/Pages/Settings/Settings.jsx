import { useNavigate, Outlet } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Categories from "./components/categories/Categories ";
import Subcategories from "./components/subcategories/Subcategories ";
import { useParams } from "react-router-dom";
import Standards from "./components/standards/Standards";
import Products from "./components/products/Products";
import Region from "./components/region/Region";

export default function Settings() {
  const navItems = [
    {
      path: "/settings/categories",
      label: "Categories",
    },
    {
      path: "/settings/subcategories",
      label: "Subcategories",
    },
    { path: "/settings/products", label: "Products" },
    {
      path: "/settings/standards",
      label: "Standards",
    },
    { path: "/settings/region", label: "Region" },
  ];
  const { tab } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    console.log({ tab });
    if (!tab) {
      navigate("categories");
    }
  }, []);

  return (
    <div className="w-full p-8">
      <div className="flex justify-between items-center">
        <Navigation navItems={navItems} />
      </div>
      <Outlet />
    </div>
  );
}
