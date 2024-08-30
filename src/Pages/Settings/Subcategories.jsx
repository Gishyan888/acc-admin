import Modal from "../../Components/Modal";
import Button from "../../Components/Button";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import Input from "../../Components/Input";
import { useEffect, useState } from "react";
import useModal from "../../store/useModal";
import useSettings from "../../store/useSettings";
import api from "../../api/api";
import { Tooltip } from "react-tooltip";

export default function Subcategories() {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [subcategories, setSubcategories] = useState([]);

  const { activeSettings, setActiveSettings } = useSettings()
  const { modalDetails, setModalDetails, resetModalDetails } = useModal()

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const firstCategoryId = categories[0].id;
      handleSubcategories(firstCategoryId);
      setSelectedCategory(firstCategoryId);
    }
  }, [categories]);

  const getCategories = () => {
    api.get("api/site/categories")
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => console.log(err));
  };



  const handleSubcategories = (item) => {
    setSelectedCategory(item)
    api.get(`api/admin/categories/${item}`)
      .then((res) => {
        setSubcategories(res.data.data.subcategories);
      })
      .catch((err) => console.log(err));
  }

  const editCategory = (item) => {
    setActiveSettings.item({ id: item.id, name: item.name })
    setActiveSettings.isCRUD(true)
  }

  const deleteCategory = (item) => {
    setModalDetails({
      isVisible: true,
      image: "warning",
      button1Text: "Cancel",
      button2Text: "Delete",
      button1Color: "bg-gray-500",
      button2Color: "bg-red-500",
      button1OnClick: () => resetModalDetails(),
      button2OnClick: () => {
        api.delete(`api/admin/categories/${item.id}`)
          .then(() => handleSubcategories(selectedCategory))
          .catch((err) => console.log(err))
          .finally(() => resetModalDetails());
      },
      onClose: () => resetModalDetails(),
    });
  }

  const crudSubcategory = () => {

    const apiCall = activeSettings.item.id
      ? api.put(`api/admin/categories/${activeSettings.item.id}`, { name: activeSettings.item.name })
      : api.post("api/admin/categories", { name: activeSettings.item.name, parent_id: selectedCategory });
    apiCall
      .then((res) => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
          },
        })
        setActiveSettings.item({ name: "", icon: null });
        setActiveSettings.isCRUD(false);
        handleSubcategories(selectedCategory)
      })
      .catch((err) => console.log(err));
  };


  return (
    <div>
      <div className="w-full flex gap-5 items-start justify-between">
        <div className="w-1/2 rounded-lg shadow flex flex-col items-start gap-5 justify-center bg-white p-2">
          <div className="w-full max-w-80 flex items-start justify-start">
            <select
              name="category"
              onChange={(e) => handleSubcategories(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedCategory || ""}
            >
              <option disabled>Select Category</option>
              {categories?.map((item, index) => (
                <option value={item.id} key={index}>{item.name}</option>
              ))}
            </select>
          </div>
          {subcategories && subcategories.length > 0 && (

            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((item, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => editCategory(item)} className="font-medium text-blue-600 hover:underline" data-tooltip-id="tooltip" data-tooltip-content="Edit">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteCategory(item)} className="font-medium text-red-600 hover:underline" data-tooltip-id="tooltip" data-tooltip-content="Delete">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {activeSettings.isCRUD && (
          <div className="w-1/2 rounded-lg shadow flex flex-col items-center justify-center bg-white p-2">

            <form
              onSubmit={(e) => {
                e.preventDefault();
                crudSubcategory();
              }}
              className="mt-2 w-full"
            >
              <p className="text-xl font-bold">{activeSettings.item.id ? "Edit" : "Add"} {activeSettings.name}</p>

              <div className="border-b-gray-300 border-b py-2">
                <div className="flex items-center rounded gap-3">
                  <Input
                    type="text"
                    onChange={(e) => setActiveSettings.item({ ...activeSettings.item, name: e.target.value })}
                    className="ps-9 w-full"
                    required={true}
                    value={activeSettings.item.name}
                    placeholder={`Enter ${activeSettings.name} name`}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end w-1/2 gap-3">
                <Button
                  text="Cancel"
                  color="bg-gray-500"
                  onClick={() => {
                    setActiveSettings.isCRUD(false);
                  }}
                  className="mr-2"
                />
                <Button
                  text={activeSettings.item.id ? "Update" : "Create"}
                  color="bg-amber-600"
                  type="submit"
                  onClick={() => { }}
                />
              </div>
            </form>
          </div>
        )}
      </div>
      <Modal
        value={modalDetails.value}
        isVisible={modalDetails.isVisible}
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
    </div>
  )
}
