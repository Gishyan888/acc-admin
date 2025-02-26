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

export default function Standard() {
  const [standards, setStandards] = useState([]);
  const [errors, setErrors] = useState({});
  const { activeSettings, setActiveSettings } = useSettings();
  const { setModalDetails, resetModalDetails } = useModal();
  useEffect(() => {
    getStandards();
  }, []);

  const getStandards = () => {
    api
      .get("api/site/standards")
      .then((res) => {
        setStandards(res.data.data);
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

  const editStandard = (item) => {
    setActiveSettings.item({ id: item.id, name: item.name, icon: item.icon });
    setActiveSettings.isCRUD(true);
  };

  const deleteStandard = (item) => {
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
          .delete(`api/admin/standards/${item.id}`)
          .then(() => {
            setModalDetails({
              isVisible: false,
              image: "success",
              onClose: () => {
                resetModalDetails();
              },
            });
            getStandards();
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
    const apiCall = activeSettings.item.id
      ? api.put(`api/admin/standards/${activeSettings.item.id}`, {
          name: activeSettings.item.name,
          id: activeSettings.item.id,
        })
      : api.post("api/admin/standards", { name: activeSettings.item.name });
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
        getStandards();
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

  const handleCancel = () => {
    setActiveSettings.isCRUD(false);
    setActiveSettings.item({ name: "", icon: null });
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
              {standards.map((item, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editStandard(item)}
                        className="font-medium text-blue-600 hover:underline"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteStandard(item)}
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
                crudCategory();
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
                  onClick={handleCancel}
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
