import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import useModal from "../../store/useModal";
import Pagination from "../../Components/Pagination";
import usePagination from "../../store/usePagination";
import { EyeIcon } from "@heroicons/react/24/solid";

export default function MailingHistory() {
  const currentPage = usePagination((state) => state.currentPage);
  const setCurrentPage = usePagination((state) => state.setCurrentPage);
  const [pageCount, setPageCount] = useState(1);

  const [mailingHistory, setMailingHistory] = useState([]);
  const { setModalDetails, resetModalDetails } = useModal();

  const navigate = useNavigate();
  const getMailingHistory = () => {
    api
      .get(`/api/admin/email_message/history?page=${currentPage}`)
      .then((res) => {
        setMailingHistory(res.data.data);
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

  const gethistory = (history) => {
    navigate(`/mailing-history/${history.id}`);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, []);
  useEffect(() => {
    getMailingHistory();
  }, [currentPage]);

  return (
    <div className="p-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Companies
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Sent At
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mailingHistory.map((history, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => gethistory(history)}
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  {history.subject}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {history.companies && history.companies.length > 2
                    ? `${(history.companies[0], history.companies[1])}+${
                        history.companies.length - 2
                      } others`
                    : history.companies.map((company) => company).join(", ")}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {history.sent_at}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EyeIcon className="h-5 w-5 text-blue-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{" "}
      <Pagination pageCount={pageCount} />
    </div>
  );
}
