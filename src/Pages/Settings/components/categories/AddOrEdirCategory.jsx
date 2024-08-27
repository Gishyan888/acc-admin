"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import useModal from "../../../../store/useModal";
import Input from "../../../../Components/Input";
import api from "../../../../api/api";
import { toast } from "react-toastify";
import useCategory from "../../../../store/useCategory";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import useLoading from "../../../../store/useLoading";
export default function AddOrEdirCategory() {
  const formRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const [activeCategory, setActiveCategory] = useState({});
  const isModalOpen = useModal((state) => state.isModalOpen);
  const categoryForEdit = useCategory((state) => state.activeCategory);

  const setModalState = (state) => {
    useModal.getState().setModalState(state);
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setActiveCategory({
          ...activeCategory,
          file: file,
          fileSrc: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleCategorySubmit = () => {
    if (activeCategory.id) {
      useLoading.getState().setIsLoading(true);

      const data = {
        name: activeCategory.name,
        icon: activeCategory.file,
      };

      api
        .put(`api/admin/categories/${activeCategory.id}`, data)
        .then((res) => {
          console.log(res);
          if (!res.statusText) {
            toast.success("Category created successfuly!");
            setActiveCategory(null);
            formRef.current.reset();
            setModalState(false);
            useLoading.getState().setIsLoading(false);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          useLoading.getState().setIsLoading(false);
        });
    } else {
      useLoading.getState().setIsLoading(true);

      const data = new FormData();
      console.log({ activeCategory }, "2222222222222222222");
      data.append("name", activeCategory.name);
      data.append("icon", activeCategory.file);
      api
        .post("api/admin/categories", data)
        .then((res) => {
          console.log(res);
          if (!res.statusText) {
            toast.success("Category created successfuly!");
            setActiveCategory(null);
            formRef.current.reset();
            setModalState(false);
            useLoading.getState().setIsLoading(false);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          useLoading.getState().setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (categoryForEdit.id) {
      setActiveCategory(categoryForEdit);
    }
  }, [categoryForEdit]);
  return (
    <div className="justify-center">
      <Modal
        show={isModalOpen}
        onClose={() => setModalState(false)}
        size={"md"}
      >
        <Modal.Header>
          {categoryForEdit?.id ? "Edit Category" : "Add Category"}
        </Modal.Header>
        <Modal.Body>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate(activeCategory);
            }}
            className="mt-2 w-1/2"
          >
            <div className="border-b-gray-300 border-b py-2">
              <div className={`flex items-center rounded`}>
                <Input
                  type="text"
                  onChange={(e) =>
                    setActiveCategory({
                      ...activeCategory,
                      name: e.target.value,
                    })
                  }
                  className="ps-9"
                  required={true}
                  value={activeCategory?.name ?? ""}
                />
                <img
                  src={activeCategory?.fileSrc ?? categoryForEdit?.icon}
                  className={`w-[50px] h-[50px] object-cover mx-2 ${
                    activeCategory?.fileSrc ?? categoryForEdit?.icon
                      ? ""
                      : "hidden"
                  }`}
                />
                <button onClick={handleClick} type="button" className="mx-2">
                  <ArrowUpTrayIcon className="cursor-pointer w-[20px]" />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                  />
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setModalState(false)}>
            Cencel
          </Button>
          <Button onClick={handleCategorySubmit} color="gray">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
