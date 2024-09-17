import {
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/16/solid";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useEffect, useState } from "react";
import api from "../../api/api";
import useSettings from "../../store/useSettings";
import useModal from "../../store/useModal";

export default function ProductType() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const { activeSettings, setActiveSettings } = useSettings();
  const { setModalDetails, resetModalDetails } = useModal();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory && !selectedSubcategory) {
      const firstCategoryId = categories[0].id;
      setSelectedCategory(firstCategoryId);
      getSubcategories(firstCategoryId);
    }
  }, [categories]);

  const getCategories = () => {
    api
      .get("api/site/categories")
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => {
        resetModalDetails();
        setModalDetails({
          isVisible: true,
          image: "fail",
          errorMessage: err.response?.data?.message || "An error occurred",
          onClose: () => {
            resetModalDetails();
          },
        });
      });
  };

  const getSubcategories = (selectedCategoryId) => {
    const selectedCategory = categories.find(
      (category) => category.id === parseInt(selectedCategoryId)
    );
    if (selectedCategory && selectedCategory.subcategories) {
      setSubcategories(selectedCategory.subcategories);
      if (selectedCategory.subcategories.length > 0) {
        setSelectedSubcategory(selectedCategory.subcategories[0].id);
      } else {
        setSelectedSubcategory(null);
      }
    } else {
      setSubcategories([]);
      setSelectedSubcategory(null);
    }
  };

  const getTypes = () => {
    if (!selectedCategory || !selectedSubcategory) {
      setProductTypes([]);
      return;
    }

    const category = categories.find(
      (cat) => cat.id == parseInt(selectedCategory)
    );
    if (!category) return;

    const subcategory = category.subcategories.find(
      (sub) => sub.id == parseInt(selectedSubcategory)
    );
    if (subcategory && subcategory.subcategories) {
      setProductTypes(subcategory.subcategories);
    } else {
      setProductTypes([]);
    }
  };

  useEffect(() => {
    getTypes();
  }, [selectedCategory, selectedSubcategory, categories]);

  const editProductType = (item) => {
    setActiveSettings.item({ id: item.id, name: item.name, icon: item.icon });
    setActiveSettings.isCRUD(true);
  };

  const deleteProductType = (item) => {
    setModalDetails({
      isVisible: true,
      image: "warning",
      button1Text: "Cancel",
      button2Text: "Delete",
      button1Color: "bg-gray-500",
      button2Color: "bg-red-500",
      button1OnClick: () => resetModalDetails(),
      button2OnClick: () => {
        api
          .delete(`api/admin/product-types/${item.id}`)
          .then(() => getCategories(), getTypes())
          .catch((err) => {
            resetModalDetails();
            setModalDetails({
              isVisible: true,
              image: "fail",
              errorMessage: err.response?.data?.message || "An error occurred",
              onClose: () => {
                resetModalDetails();
              },
            });
          });
      },
      onClose: () => resetModalDetails(),
    });
  };

  const crudProductType = async () => {
    try {
      const apiCall = activeSettings.item.id
        ? api.put(`api/admin/product-types/${activeSettings.item.id}`, {
            name: activeSettings.item.name,
            category_id: selectedSubcategory,
          })
        : api.post("api/admin/product-types", {
            name: activeSettings.item.name,
            category_id: selectedSubcategory,
          });

      await apiCall;
      setModalDetails({
        isVisible: true,
        image: "success",
        onClose: () => {
          resetModalDetails();
        },
      });
      setActiveSettings.item({ name: "", icon: null });
      setActiveSettings.isCRUD(false);

      await getCategories();

      getTypes();
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return (
    <div>
      <div className="w-full flex gap-5 items-start justify-between">
        <div className="w-1/2 rounded-lg shadow flex flex-col items-center justify-center bg-white p-2">
          <div className="w-full gap-5 flex items-start justify-start">
            <select
              name="category"
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                getSubcategories(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedCategory || ""}
            >
              <option disabled>Select Category</option>
              {categories?.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              name="subcategory"
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedSubcategory || ""}
            >
              <option disabled>Select Subcategory</option>
              {subcategories?.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <table className="w-full mt-4 text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {productTypes.map((item, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editProductType(item)}
                        className="font-medium text-blue-600 hover:underline"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteProductType(item)}
                        className="font-medium text-red-600 hover:underline"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {activeSettings.isCRUD && (
          <div className="w-1/2 rounded-lg shadow flex flex-col items-center justify-center bg-white p-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                crudProductType();
              }}
              className="mt-2 w-full"
            >
              <p className="text-xl font-bold">
                {activeSettings.item.id ? "Edit" : "Add"} {activeSettings.name}
              </p>

              <div className="border-b-gray-300 border-b py-2">
                <div className="flex items-center rounded gap-3">
                  <Input
                    type="text"
                    onChange={(e) =>
                      setActiveSettings.item({
                        ...activeSettings.item,
                        name: e.target.value,
                      })
                    }
                    className="ps-9 w-full"
                    required={true}
                    value={activeSettings.item.name}
                    placeholder={`Enter ${activeSettings.name} name`}
                    error={errors.name}
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
                  onClick={() => {}}
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
