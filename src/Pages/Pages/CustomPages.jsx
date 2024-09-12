import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import Button from "../../Components/Button";
import api from "../../api/api";
import useModal from "../../store/useModal";

export default function CustomPages() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bannersData, setBannersData] = useState([]);
  const { setModalDetails, resetModalDetails } = useModal()

  const navItems = [
    { path: "/pages/custom", label: "Custom Pages" },
    { path: "/pages/blog", label: "Blog" },
  ];

  const fetchCustomPages = () => {
    let apiURL = "";
    if (location.pathname.includes("custom")) {
      apiURL = "api/admin/contents?type=page";
    } else {
      apiURL = "api/admin/contents?type=news";
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
    fetchCustomPages();
  }, [location.pathname]);

  const editPage = (item) => {
    navigate(`${item.id}/edit`);
  };

const 
deletePage = (item) => {
  setModalDetails({
    isVisible: true,
    image: "warning",
    button1Text: "Cancel",
    button2Text: "Delete",
    button1Color: "bg-gray-500",
    button2Color: "bg-red-500",
    button1OnClick: () => resetModalDetails(),
    button2OnClick: () => {
      api.delete(`api/admin/contents/${item.id}`)
        .then(() => fetchCustomPages())
        .catch((err) => console.log(err))
        .finally(() => resetModalDetails());
    },
    onClose: () => resetModalDetails(),
  });
};

  const handleCreateEditPage = () => {
    navigate("create");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Navigation navItems={navItems} />
        {bannersData.length < 5 && (
          <Button
            text={location.pathname.includes("custom") ? "Create Custom Page" : "Create Blog Page"}
            color="bg-amber-600"
            onClick={() => handleCreateEditPage()}
          />
        )}
      </div>
      <div className="w-full flex flex-col items-center justify-center bg-white p-2">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 font-bold text-left">Title</th>
              <th className="px-4 py-2 font-bold text-left">Image</th>
              <th className="px-4 py-2 font-bold text-left">Status</th>
              <th className="px-4 py-2 font-bold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bannersData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-gray-800">{item.title}</td>
                <td className="px-4 py-2">
                  <img
                    className="w-14 h-14 object-cover"
                    src={item.image}
                    alt={item.title}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className={`px-2 py-1 w-20 text-center rounded-3xl text-white ${item.status === 1 ? "bg-green-500" : "bg-red-500"}`}>
                  {item.status === 1 ? "Active" : "Inactive"}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2 text-blue-500">
                    <div
                      className="cursor-pointer"
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Edit"
                      onClick={() => editPage(item)}
                    >
                      <PencilIcon className="w-6 h-6" />
                    </div>
                    <div
                      className="cursor-pointer"
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Delete"
                      onClick={() => deletePage(item)}
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
