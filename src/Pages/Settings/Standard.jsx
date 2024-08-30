import { PencilIcon, TrashIcon, ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useEffect, useState } from "react";
import api from "../../api/api";
import useSettings from "../../store/useSettings";
import Modal from "../../Components/Modal";
import useModal from "../../store/useModal";
import { Tooltip } from "react-tooltip";

export default function Standard() {

  const [standards, setStandards] = useState([])

  useEffect(() => {
    getStandards()
  }, []);

  const getStandards = () => {
    api.get("api/site/standards")
      .then((res) => {
        setStandards(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  const { activeSettings, setActiveSettings } = useSettings()
  const { modalDetails, setModalDetails, resetModalDetails } = useModal()


  const editStandard = (item) => {
    setActiveSettings.item({ id: item.id, name: item.name, icon: item.icon })
    setActiveSettings.isCRUD(true)
  }

  const deleteStandard = (item) => {
    setModalDetails({
      isVisible: true,
      value: "Are you sure you want to delete this standard?",
      button1Text: "Cancel",
      button2Text: "Delete",
      button1Color: "bg-gray-500",
      button2Color: "bg-red-500",
      button1OnClick: () => resetModalDetails(),
      button2OnClick: () => {
        api.delete(`api/admin/standards/${item.id}`)
          .then(() => getStandards())
          .catch((err) => console.log(err))
          .finally(() => resetModalDetails());
      },
      onClose: () => resetModalDetails(),
    });
  };



  const crudCategory = () => {

    const apiCall = activeSettings.item.id
    ? api.put(`api/admin/standards/${activeSettings.item.id}`, { name: activeSettings.item.name, id: activeSettings.item.id })
    : api.post("api/admin/standards", {name: activeSettings.item.name});
    apiCall
      .then((res) => {
        setActiveSettings.item({ name: "", icon: null });
        setActiveSettings.isCRUD(false);
        getStandards()
      })
      .catch((err) => console.log(err));
  };


  return (
    <div>
      <div className="w-full flex gap-5 items-start justify-between">
        <div className="w-1/2 rounded-lg shadow flex flex-col items-center justify-center bg-white p-2">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {standards.map((item, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => editStandard(item)} className="font-medium text-blue-600 hover:underline" data-tooltip-id="tooltip" data-tooltip-content="Edit">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteStandard(item)} className="font-medium text-red-600 hover:underline" data-tooltip-id="tooltip" data-tooltip-content="Delete">
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
