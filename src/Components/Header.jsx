import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPageName, setCurrentPageName] = useState("Hello 👋");

  const formatPageName = (name) => {
    let cleaned = name.replace(/[^a-zA-Z]+/g, " ").trim();

    let titleCased = cleaned
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setCurrentPageName(titleCased);
  };

  useEffect(() => {
    const pathname = location.pathname.split("/")[1];
    formatPageName(pathname);
    if (pathname === "") setCurrentPageName("Hello 👋");
  }, [location.pathname, currentPageName]);

  return (
    <div className="text-3xl font-bold w-full h-24 flex items-center justify-between p-4 border-b-2">
      <p>{currentPageName}</p>
      <div
        className="rounded-full h-10 w-10 bg-gray-700 cursor-pointer"
        data-tooltip-id="tooltip"
        data-tooltip-content="My Account"
        onClick={() => navigate("/my-account")}
      ></div>
    </div>
  );
}
