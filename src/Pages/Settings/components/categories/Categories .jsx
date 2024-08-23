import React, { useEffect, useState, useRef } from "react";
import Input from "../../../../Components/Input";
import api from "../../../../api/api";
import Pagination from "../../../../Components/Pagination";
export default function Categories() {
  const [categoriesOnPage, setCategoriesOnPage] = useState([]);
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
      last_page: 1,
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

  useEffect(() => {
    api
      .get("")
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });

    setCategoriesOnPage(mockData.data);
  }, []);

  return (
    <div className="mt-4 p-2">
      {/* <Input /> */}
      <div className="bg-white">
        {/* <Pagination /> */}
      </div>
    </div>
  );
}
