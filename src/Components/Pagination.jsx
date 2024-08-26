import React from "react";
import ReactPaginate from "react-paginate";
import usePagination from "../store/usePagination";
export default function Pagination({ pageCount }) {
  const currentPage = usePagination((state) => state.currentPage);

  const handlePageClick = (selected) => {
    console.log({ selected });
    // usePagination.getState().setCurrentPage();
  };
  return (
    <div>
      <ReactPaginate
        className="flex justify-around w-1/4 bg-gray-300 rounded-lg h-[30px] items-center"
        breakLabel="..."
        nextLabel=">"
        onPageChange={({ selected }) => {
          handlePageClick(selected);
        }}
        pageCount={pageCount}
        previousLabel="<"
        initialPage={1}
      />
    </div>
  );
}
