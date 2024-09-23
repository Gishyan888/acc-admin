import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import useSettings from "../../store/useSettings";
import useModal from "../../store/useModal";
import FileUpload from "../../Components/FileUpload";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const { activeSettings, setActiveSettings } = useSettings();
  const { setModalDetails, resetModalDetails } = useModal();
  const formRef = useRef(null);

  useEffect(() => {
    getCategories();
  }, []);

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

  const editCategory = (item) => {
    setActiveSettings.item({ id: item.id, name: item.name, icon: item.icon });
    setActiveSettings.isCRUD(true);
  };

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
        api
          .delete(`api/admin/categories/${item.id}`)
          .then(() => {
            setModalDetails({
              isVisible: false,
              image: "success",
              onClose: () => {
                resetModalDetails();
              },
            });
            getCategories();
            resetModalDetails();
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
      },
      onClose: () => resetModalDetails(),
    });
  };

  const crudCategory = () => {
    const formData = new FormData();
    formData.append("name", activeSettings.item.name);
    if (activeSettings.item.icon instanceof File) {
      formData.append("icon", activeSettings.item.icon);
    }
    if (activeSettings.item.id) {
      formData.append("_method", "PUT");
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const apiCall = activeSettings.item.id
      ? api.post(
          `api/admin/categories/${activeSettings.item.id}`,
          formData,
          config
        )
      : api.post("api/admin/categories", formData, config);
    apiCall
      .then((res) => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
          },
        });
        setActiveSettings.item({ name: "", icon: null });
        setActiveSettings.isCRUD(false);
        getCategories();
        setErrors({});
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
        setErrors(err.response.data.errors);
      });
  };

  return (
    <div>
      <div className="w-full flex gap-5 items-start justify-between">
        <div className="w-1/2 rounded-lg shadow flex flex-col items-center justify-center bg-white p-2">
          <table className="w-full text-sm text-left text-gray-500">
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
              {categories.map((item, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editCategory(item)}
                        className="font-medium text-blue-600 hover:underline"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteCategory(item)}
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
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                crudCategory();
              }}
              className="mt-2 w-full"
            >
              <p className="text-xl font-bold">
                {activeSettings.item.id ? "Edit" : "Add"} {activeSettings.name}
              </p>

              <div className="border-b-gray-300 border-b py-2">
                <div className="flex items-start rounded gap-3">
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
