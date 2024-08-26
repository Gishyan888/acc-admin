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
export default function Categories() {
  const [categoriesOnPage, setCategoriesOnPage] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const mockData = {
    data: [
      {
        id: 1,
        name: "asa",
        parent_id: null,
        slug: "asa",
        icon: "http://127.0.0.1:8000/storage/categories/ueBEc8fGDRLPqOKwaaWt1ypUvKzRkrXdnTd36kgn.jpg",
        active: 1,
        subcategories: [
          {
            id: 2,
            name: "asa5",
            parent_id: 1,
            slug: "asa5",
            icon: "http://127.0.0.1:8000/storage/categories/VkmL6fugUCY5Rp9iU7nM23qdYDyKQECICOFKZFip.jpg",
            active: 1,
          },
        ],
        meta_title: "asa",
        meta_description: null,
        meta_keywords: null,
      },
      {
        id: 2,
        name: "asa5",
        parent_id: 1,
        slug: "asa5",
        icon: "http://127.0.0.1:8000/storage/categories/VkmL6fugUCY5Rp9iU7nM23qdYDyKQECICOFKZFip.jpg",
        active: 1,
      },
    ],
    links: {
      first: "http://127.0.0.1:8000/api/admin/categories?page=1",
      last: "http://127.0.0.1:8000/api/admin/categories?page=1",
      prev: null,
      next: null,
    },
    meta: {
      current_page: 1,
      from: 1,
      last_page: 10,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: "http://127.0.0.1:8000/api/admin/categories?page=1",
          label: "1",
          active: true,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      path: "http://127.0.0.1:8000/api/admin/categories",
      per_page: 10,
      to: 2,
      total: 2,
    },
  };
  const formRef = useRef(null);

  const handleEdit = () => {
    setActiveCategory(null);
  };
  const handleDelete = () => {};
  const handleFileUpload = (e) => {};

  useEffect(() => {
    // api
    //   .get("")
    //   .then((res) => {})
    //   .catch((err) => {
    //     console.log(err);
    //   });

    setCategoriesOnPage(mockData.data);
  }, []);

  return (
    <div className="flex w-full items-center px-4">
      <div className="w-1/3">
        {/* <Spinner isSpinning={loading} /> */}
        <div
          className={`mt-2 bg-white px-2 ${
            categoriesOnPage?.length ? "h-[600px] overflow-y-auto" : ""
          }`}
        >
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleCategoryCreate(activeCategory);
            }}
            className="mt-2 w-full"
          >
            <div className="border-b-gray-300 border-b py-2">
              <p>Add Category</p>
              <div className="flex items-center space-x-2 rounded">
                <Input
                  type="text"
                  onChange={(e) => setActiveCategory({ name1: e.target.value })}
                  className="ps-9"
                  required={true}
                  value={activeCategory?.name1 ?? ""}
                />
                <button>
                  <ArrowUpTrayIcon />
                  {/* <input
                    type="file"
                    onChange={handleFileUpload}
                    ref={hiddenFileInput}
                    className="none"
                  /> */}
                </button>
                <button title="Ավելացնել կատեգորիա">
                  <PlusIcon className="cursor-pointer w-[20px]" />
                </button>
              </div>
            </div>
          </form>
          <div>
            {categoriesOnPage?.map((item) => {
              return (
                <div key={item.id} className="my-2 mr-2">
                  <div key={item.id} className="my-2 flex items-center">
                    <Input
                      disabled={activeCategory?.id !== item.id}
                      value={item?.name ?? ""}
                      type="text"
                      name="title"
                      className="ps-9"
                      onChange={(e) =>
                        setActiveCategory({
                          id: item.id,
                          name: e.target.value,
                        })
                      }
                    />
                    <div className="flex pl-2">
                      {activeCategory?.id && activeCategory?.id == item.id ? (
                        <button
                          title="Պահպանել կատեգորիան"
                          onClick={() => {
                            handleEdit(activeCategory);
                          }}
                        >
                          <CheckIcon className="cursor-pointer h-[20px] w-[20px]" />
                        </button>
                      ) : (
                        <button
                          title="Խմբագրել կատեգորիան"
                          onClick={() => {
                            setActiveCategory(item);
                          }}
                        >
                          <PencilIcon className="mx-1 h-[20px] w-[20px] cursor-pointer" />
                        </button>
                      )}
                      <button
                        title="Ջնջել կատեգորիան"
                        onClick={() => handleDelete(item.id)}
                      >
                        <TrashIcon className="h-[20px] w-[20px] cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
