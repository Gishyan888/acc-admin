import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect, useRef, useState } from "react";
import { PencilIcon, TrashIcon, ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import { Tooltip } from "react-tooltip";
import Button from "../../Components/Button";
import api from "../../api/api";
import Modal from "../../Components/Modal";
import Input from "../../Components/Input";

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState([]);
  const [settingsManage, setSettingsManage] = useState({
    name: null,
    apiURL: null
  });
  const [modalManage, setModalManage] = useState({
    isCRUD: false,
  });
  const [activeCategory, setActiveCategory] = useState({
    name: "",
    icon: null
  });

  const [categories, setCategories] = useState([]);
  const formRef = useRef(null);
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    if (location.pathname.includes("subcategories")) {
      api.get("api/admin/categories")
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setSettings([]);
      });
      setSettingsManage(prev => ({
        ...prev,
        apiURL: null,
        name: "Subcategory"
      }));

    } else if (location.pathname.includes("categories")) {
      setSettingsManage(prev => ({
        ...prev,
        apiURL: "api/admin/categories",
        name: "Category"
      }));
    } else if (location.pathname.includes("standards")) {
      setSettingsManage(prev => ({
        ...prev,
        apiURL: "api/admin/standards",
        name: "Standard"
      }));
    }
    setSettings([]);
    setModalManage({ isCRUD: false });
  }, [location.pathname]);
  console.log("🚀 ~ Settings ~ categories:", categories)

  const navItems = [
    { path: "/settings/categories", label: "Categories" },
    { path: "/settings/subcategories", label: "Subcategories" },
    { path: "/settings/standards", label: "Standards" }
  ];

  const getSettings = () => {
    api.get(settingsManage.apiURL)
      .then((res) => {
        setSettings(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setSettings([]);
      });
  };

  useEffect(() => {
    if (settingsManage.apiURL) {
      getSettings();
    }
  }, [settingsManage.apiURL]);

  const createUpdateSettings = () => {
    if (settingsManage.name === "Category") {
      const formData = new FormData();
    formData.append('name', activeCategory.name);
    if (activeCategory.icon) {
      if (activeCategory.icon instanceof File) {
        formData.append('icon', activeCategory.icon);
      } 
    } else {
      formData.append('icon', '');
    }
  
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    if (activeCategory.id) {
      formData.append('_method', 'PUT');
    }
  
    const apiCall = activeCategory.id 
      ? api.post(`${settingsManage.apiURL}/${activeCategory.id}`, formData, config)
      : api.post(settingsManage.apiURL, formData, config);
  
    apiCall
      .then(() => {
        getSettings();
        setModalManage({ isCRUD: false });
        setActiveCategory({ name: "", icon: null });
      })
      .catch((err) => {
        console.log(err);
      });
    }else if(settingsManage.name === "Subcategory") {
      console.log("🚀 ~ createUpdateSettings ~ activeCategory:", activeCategory)

      let data = {
        name: activeCategory.name,
        id: activeCategory
      }

      api.post ("api/admin/categories", activeCategory)
        .then(() => {
          getSettings();
          setModalManage({ isCRUD: false });
          setActiveCategory({ name: "", icon: null });
        })
        .catch((err) => {
          console.log(err);
        });
    } 
  };

  const editSettings = (item) => {
    setActiveCategory(item);
    setModalManage({ isCRUD: true });
  };

  const deleteSettingsModal = (item) => {
    if (confirm(`Are you sure you want to delete this ${settingsManage.name}?`)) {
      api.delete(`${settingsManage.apiURL}/${item.id}`)
        .then(() => getSettings())
        .catch((err) => console.log(err));
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setActiveCategory(prev => ({ ...prev, icon: file }));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Navigation navItems={navItems} />
        {!modalManage.isCRUD && (
          <Button
            text={`Add New ${settingsManage.name}`}
            color="bg-amber-600"
            onClick={() => setModalManage({ isCRUD: true })}
          />
        )}
      </div>
      <div className="w-full flex gap-5 items-start justify-between">
        <div className={`${settingsManage.name === "Category" ? "w-1/2" : "w-1/3"} rounded-lg shadow flex flex-col items-center justify-center bg-white p-2`}>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                {settingsManage.name === "Category" && <th scope="col" className="px-6 py-3">Icon</th>}
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings?.map((item, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                  {settingsManage.name === "Category" && <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <img className="w-20 h-20 rounded-full object-cover" src={item.icon} alt={item.name} />
                    </td>}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => editSettings(item)} className="font-medium text-blue-600 hover:underline" data-tooltip-id="tooltip" data-tooltip-content="Edit">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteSettingsModal(item)} className="font-medium text-red-600 hover:underline" data-tooltip-id="tooltip" data-tooltip-content="Delete">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modalManage.isCRUD && (
          <div className="w-1/2 rounded-lg shadow flex flex-col items-center justify-center bg-white p-2">
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                createUpdateSettings();
              }}
              className="mt-2 w-full"
            >
              <p className="text-xl font-bold">{activeCategory.id ? "Edit" : "Add"} {settingsManage.name}</p>

              <div className="border-b-gray-300 border-b py-2">
                <div className="flex items-center rounded gap-3">
                  {settingsManage.name === "Subcategory" && (
                    <div>
                      <select onChange={(e) => setActiveCategory(prev => ({ ...prev, id: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" >
                        <option>Select Category</option>
                        {categories?.map((item, index) => (
                          <option value={item.id} key={index}>{item.name}</option>  
                        ))}
                      </select>
                    </div>
                  )}
                  <Input
                    type="text"
                    onChange={(e) => setActiveCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="ps-9 w-full"
                    required={true}
                    value={activeCategory.name}
                    placeholder={`Enter ${settingsManage.name} name`}
                  />
                  {settingsManage.name === "Category" && (
                    <div>
                      {activeCategory.icon && (
                    <div className="relative w-20 h-20 mx-2">
                      <img
                        src={activeCategory.icon instanceof File ? URL.createObjectURL(activeCategory.icon) : activeCategory.icon}
                        className="w-full h-full rounded-full object-cover"
                        alt="Category icon"
                      />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
                        onClick={() => setActiveCategory(prev => ({ ...prev, icon: null }))}
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <button onClick={handleClick} type="button" className="mx-2">
                    <ArrowUpTrayIcon className="cursor-pointer w-[20px]" />
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      ref={hiddenFileInput}
                      style={{ display: "none" }}
                      accept="image/*"
                    />
                  </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end w-1/2 gap-3">
                <Button
                  text="Cancel"
                  color="bg-gray-500"
                  onClick={() => {
                    setModalManage({ isCRUD: false });
                    setActiveCategory({ name: "", icon: null });
                  }}
                  className="mr-2"
                />
                <Button
                  text={activeCategory.id ? "Update" : "Create"}
                  color="bg-amber-600"
                  type="submit"
                  onClick={() => { }}
                />
              </div>
            </form>
          </div>
        )}
      </div>
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
    </div>
  );
}