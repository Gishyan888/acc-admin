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
        breakLabel="..."
        nextLabel=">"
        onPageChange={({ selected }) => {
          handlePageClick(selected);
        }}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
