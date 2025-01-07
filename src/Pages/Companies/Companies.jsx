import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/16/solid";
import Pagination from "../../Components/Pagination";
import usePagination from "../../store/usePagination";

export default function Companies() {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = usePagination((state) => state.currentPage);
  const setCurrentPage = usePagination((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    api
      .get(`/api/admin/company?page=${currentPage}`)
      .then((res) => {
        setCompanyData(res.data.data);
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
  }, [currentPage]);

  const getCompany = (company) => {
    navigate(`/company/${company.id}`);
  };

  return (
    <div className="mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6">Companies</h1> */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"></th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Brand Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companyData.map((company, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => getCompany(company)}
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EyeIcon className="h-5 w-5 text-blue-500" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {company.brand_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {company.company_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {company.email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {company.phone_number}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      company.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : company.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {company.status}
                  </span>
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
