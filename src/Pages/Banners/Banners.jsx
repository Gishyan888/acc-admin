import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import Button from "../../Components/Button";
import api from "../../api/api";
import useModal from "../../store/useModal";

export default function Banners() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bannersData, setBannersData] = useState([]);
  const { setModalDetails, resetModalDetails } = useModal()

  const navItems = [
    { path: "/banners/header-banners", label: "Header Banners" },
    { path: "/banners/company-banners", label: "Company Banners" },
  ];

  const fetchBanners = () => {
    let apiURL = "";
    if (location.pathname.includes("header-banners")) {
      apiURL = "api/site/banners/header ";
    } else {
      apiURL = "api/site/banners/companies";
    }
    api
      .get(apiURL)
      .then((res) => {
        setBannersData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchBanners();
  }, [location.pathname]);

  const editBanner = (item) => {
    navigate(`${item.id}/edit`);
  };

const deleteBanner = (item) => {
  setModalDetails({
    isVisible: true,
    image: "warning",
    button1Text: "Cancel",
    button2Text: "Delete",
    button1Color: "bg-gray-500",
    button2Color: "bg-red-500",
    button1OnClick: () => resetModalDetails(),
    button2OnClick: () => {
      api.delete(`api/admin/banners/${item.id}`)
        .then(() => fetchBanners())
        .catch((err) => console.log(err))
        .finally(() => resetModalDetails());
    },
    onClose: () => resetModalDetails(),
  });
};

  const handleCreateEditBanner = () => {
    navigate("create");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Navigation navItems={navItems} />
        {bannersData.length < 5 && (
          <Button
            text="Add New Banner"
            color="bg-amber-600"
            onClick={() => handleCreateEditBanner()}
          />
        )}
      </div>
      <div className="w-full flex flex-col items-center justify-center bg-white p-2">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 font-bold text-left">Title</th>
              {location.pathname.includes("company-banners") && (
                <th className="px-4 py-2 font-bold text-left">Text</th>
              )}
              <th className="px-4 py-2 font-bold text-left">Image</th>
              <th className="px-4 py-2 font-bold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bannersData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-gray-800">{item.title}</td>
                {location.pathname.includes("company-banners") && (
                  <td className="px-4 py-2 text-gray-800">{item.text}</td>
                )}
                <td className="px-4 py-2">
                  <img
                    className="w-14 h-14 object-cover"
                    src={item.image}
                    alt={item.title}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2 text-blue-500">
                    <div
                      className="cursor-pointer"
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Edit"
                      onClick={() => editBanner(item)}
                    >
                      <PencilIcon className="w-6 h-6" />
                    </div>
                    <div
                      className="cursor-pointer"
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Delete"
                      onClick={() => deleteBanner(item)}
                    >
                      <TrashIcon className="w-6 h-6" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
