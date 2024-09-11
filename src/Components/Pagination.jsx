import React from "react";
import ReactPaginate from "react-paginate";
import usePagination from "../store/usePagination";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";

export default function Pagination({ pageCount }) {
  const currentPage = usePagination((state) => state.currentPage);
  const setCurrentPage = usePagination((state) => state.setCurrentPage);

  const handlePageClick = (selected) => {
    setCurrentPage(selected + 1); 
  };

  return (
    <div>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={3}
        initialPage={currentPage - 1}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => handlePageClick(selected)}
        forcePage={currentPage - 1} 
        containerClassName="flex justify-end items-center mt-4"
        pageClassName="mx-2 cursor-pointer"
        pageLinkClassName="py-2 px-3 text-gray-700"
        activeClassName="border flex justify-center items-center w-10 h-10 rounded-border-10 border-green-color text-white"
        previousLabel={
          <div
            className={`flex gap-2 justify-center items-center ${
              currentPage === 1
                ? "opacity-50 text-gray-300 cursor-not-allowed"
                : "cursor-pointer text-green-color"
            }`}
          >
            <ChevronLeftIcon className="text-xs" />
            Prev
          </div>
        }
        nextLabel={
          <div
            className={`flex gap-2 justify-center items-center cursor-pointer ${
              currentPage === pageCount
                ? "opacity-50 text-gray-300 cursor-not-allowed"
                : "text-green-color"
            }`}
          >
            Next
            <ChevronLeftIcon className="rotate-180 text-xs" />
          </div>
        }
        breakLabel={<div className="mx-2">...</div>}
      />
    </div>
  );
}
