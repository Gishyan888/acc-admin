import { useState, useEffect } from "react";
import DatePickerWithRange from "../../../Components/DatePickerWithRange";
import { format } from "date-fns";
import {
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/16/solid";
import contactsIcon from "../../../Images/contacts.png";
import api from "../../../api/api";
import useModal from "../../../store/useModal";

export default function ContactsCountCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState({ start: null, end: null });
  const [contactsCount, setContactsCount] = useState(0);
  const { setModalDetails, resetModalDetails } = useModal();

  useEffect(() => {
    fetchContactsCount();
  }, []);

  const toggleDatePicker = () => {
    setIsOpen((prev) => !prev);
  };

  const fetchContactsCount = (startDate = "", endDate = "") => {
    const start = startDate ? format(startDate, "dd.MM.yyyy") : "";
    const end = endDate ? format(endDate, "dd.MM.yyyy") : "";
    api
      .get(`/api/admin/contact_with?startDay=${start}&endDay=${end}`)
      .then((res) => {
        setContactsCount(res.data && res.data.data ? res.data.data.length : 0);
      })
      .catch((error) => {
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
  };

  return (
    <div className="mt-8">
      <div className="bg-white px-8 py-4 rounded-md shadow-md w-9/12 ">
        <h3 className="text-xl font-bold mb-4">Contacts Count by date</h3>
        <div className="flex gap-4 items-center">
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
                  onClick={() => fetchContactsCount(range.start, range.end)}
                >
                  <AdjustmentsHorizontalIcon className="h-6 w-6 text-blue-800" />
                </button>
                <button title="Reset Filter" onClick={resetFilters}>
                  <ArrowPathIcon className="h-6 w-6 text-blue-800" />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="">
                <DatePickerWithRange range={range} setRange={setRange} />
              </div>
            )}
          </div>
          <div>
            <div className="bg-blue-100 px-4 py-4 rounded-md shadow-md flex flex-col w-80">
              <div
                className={
                  " py-2 w-full flex flex-col bg-blue-100 h-full justify-between items-center"
                }
              >
                <p className="text-blue-800 font-bold text-xl">
                  Contacts Count
                </p>
                <div className="flex items-center w-20 h-20">
                  <img
                    alt="contacts icon"
                    src={contactsIcon}
                    className="object-cover"
                  />
                </div>
                <p className="text-blue-800 font-bold text-4xl">
                  {contactsCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
