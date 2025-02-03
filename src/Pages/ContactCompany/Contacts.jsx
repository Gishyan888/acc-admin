import { useEffect, useState } from "react";
import api from "../../api/api";
import Pagination from "../../Components/Pagination";
import usePagination from "../../store/usePagination";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/16/solid";
import useModal from "../../store/useModal";
import DatePickerWithRange from "../../Components/DatePickerWithRange";
import { format } from "date-fns";

export default function Contacts() {
  const navigate = useNavigate();
  const [contactsData, setContactsData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = usePagination((state) => state.currentPage);
  const setCurrentPage = usePagination((state) => state.setCurrentPage);
  const { setModalDetails, resetModalDetails } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState({ start: null, end: null });
  const toggleDatePicker = () => {
    setIsOpen((prev) => !prev);
  };

  const fetchContactsCount = (startDate = "", endDate = "") => {
    const start = startDate ? format(startDate, "dd.MM.yyyy") : "";
    const end = endDate ? format(endDate, "dd.MM.yyyy") : "";
    api
      .get(`/api/admin/contact_with?startDay=${start}&endDay=${end}`)
      .then((res) => {
        setContactsData(res.data.data);
      })
      .catch((error) => {
        console.log({ error });
        setModalDetails({
          isVisible: true,
          image: "fail",
          errorMessage: error.response?.data?.message || "An error occurred",
          onClose: () => {
            resetModalDetails();
          },
        });
      });
  };

  const resetFilters = () => {
    setRange({ start: null, end: null });
    fetchContactsCount();
    toggleDatePicker();
  };
  const getContactsInfo = () => {
    let apiURL = `/api/admin/contact_with?page=${currentPage}`;
    api
      .get(apiURL)
      .then((res) => {
        setContactsData(res.data.data);
        setPageCount(res.data.meta.last_page);
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

  const showContactInfo = (contact_id) => {
    navigate(`/contact/${contact_id}/show`);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchContactsCount();
  }, []);

  useEffect(() => {
    getContactsInfo();
  }, [currentPage]);

  return (
    <div className="mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6">Contact Company</h1> */}
      <div className="mt-6 relative">
        <div className="">
          <div className="flex flex-col">
            <label>Filter by Date Range</label>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 mt-1">
              <input
                readOnly
                placeholder="Select date range"
                onClick={toggleDatePicker}
                value={`${
                  range.start ? format(range.start, "dd/MM/yyyy") : ""
                } - ${range.end ? format(range.end, "dd/MM/yyyy") : ""}`}
                className="px-4 py-2 border border-blue-500 rounded-md bg-white text-blue-800 focus:border-blue-800 focus:outline-none"
              />
              <button
                title="Filter by Date Range"
                onClick={() => {
                  fetchContactsCount(range.start, range.end);
                  toggleDatePicker();
                }}
              >
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-blue-800" />
              </button>
              <button title="Reset Filter" onClick={resetFilters}>
                <ArrowPathIcon className="h-6 w-6 text-blue-800" />
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="absolute">
              <DatePickerWithRange range={range} setRange={setRange} />
            </div>
          )}
        </div>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-x-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"></th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Brand Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Visitor Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contactsData.map((contact, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => showContactInfo(contact.id)}
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EyeIcon className="h-5 w-5 text-blue-500" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {contact.company_brand_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {contact.full_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {contact.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination pageCount={pageCount} />
    </div>
  );
}
