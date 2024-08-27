import React, { useEffect, useState, useRef } from "react";
import Input from "../../../../Components/Input";
import api from "../../../../api/api";
import Pagination from "../../../../Components/Pagination";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import useModal from "../../../../store/useModal";
import AddOrEdirCategory from "./AddOrEdirCategory";
import useCategory from "../../../../store/useCategory";
import useLoading from "../../../../store/useLoading";
export default function Categories() {
  const [categoriesOnPage, setCategoriesOnPage] = useState([]);
  const isLoading = useLoading((state) => state.isLoading);

  const handleEdit = (category) => {
    useCategory.getState().setActiveCategory(category);
    useModal.getState().setModalState(true);
  };
  const handleDelete = () => {};
  const handleCreate = () => {
    useModal.getState().setModalState(true);
  };

  const getCategories = async () => {
    useLoading.getState().setIsLoading(true);
    await api

      .get("api/admin/categories")
      .then((res) => {
        setCategoriesOnPage(res?.data?.data);
        useLoading.getState().setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        useLoading.getState().setIsLoading(false);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="flex w-full items-center px-4">
      <div className="w-1/3">
        {/* <Spinner isSpinning={loading} /> */}
        <div
          className={`mt-2 bg-white p-4 ${
            categoriesOnPage?.length ? "overflow-y-auto" : ""
          }`}
        >
          <div className="flex border-b border-b-gray-300 py-2  cursor-pointer">
            <p className="text-xl font-bold mr-2">Add Category</p>
            <button onClick={() => handleCreate()}>
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          <div>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="">
                  <th className="px-4 py-2 font-bold text-left"></th>
                  <th className="px-4 py-2 font-bold text-left"></th>
                  <th className="px-4 py-2 font-bold text-left"></th>
                </tr>
              </thead>
              <tbody>
                {categoriesOnPage?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <img
                        src={item.icon}
                        className="h-[50px] w-[50px] object-cover"
                      />
                    </td>
                    <td>
                      <div className="flex pl-2">
                        <button
                          title="Խմբագրել կատեգորիան"
                          onClick={() => {
                            handleEdit(item);
                          }}
                        >
                          <PencilIcon className="mx-1 h-[20px] w-[20px] cursor-pointer" />
                        </button>

                        <button
                          title="Ջնջել կատեգորիան"
                          onClick={() => handleDelete(item.id)}
                        >
                          <TrashIcon className="h-[20px] w-[20px] cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddOrEdirCategory />
    </div>
  );
}
