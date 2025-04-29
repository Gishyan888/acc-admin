import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { EyeIcon, CheckIcon } from "@heroicons/react/16/solid";
import Pagination from "../../Components/Pagination";
import usePagination from "../../store/usePagination";
import Switch from "../../Components/Switch";
import useModal from "../../store/useModal";

export default function Companies() {
  const { setModalDetails, resetModalDetails } = useModal();

  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = usePagination((state) => state.currentPage);
  const setCurrentPage = usePagination((state) => state.setCurrentPage);
  const [activeSwitchIds, setActiveSwitchIds] = useState([]);
  const [toggleStatusChanged, setToggleStatusChanged] = useState(false);
  // const
  useEffect(() => {
    setCurrentPage(1);
  }, []);
  useEffect(() => {
    fetchCompanies();
  }, [currentPage, toggleStatusChanged]);

  const getCompany = (company) => {
    navigate(`/company/${company.id}`);
  };

  const fetchCompanies = () => {
    api
      .get(`/api/admin/company?page=${currentPage}`)
      .then((res) => {
        setCompanyData(res.data.data);
        setCompanyData((prevCompanies) =>
          prevCompanies.map((company) => {
            return { ...company, isEnabled: company.status === "Suspended" };
          })
        );
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

  const handleStatusChange = (id) => {
    const activeCompany = companyData.find((company) => company.id === id);
    if (activeCompany) {
      if (
        (activeCompany.status === "Suspended" && activeCompany.isEnabled) ||
        (activeCompany.status === "Approved" && !activeCompany.isEnabled)
      ) {
        return;
      } else {
        let status;
        if (activeCompany.isEnabled && activeCompany.status === "Approved") {
          status = "suspended";
        }
        if (!activeCompany.isEnabled && activeCompany.status === "Suspended") {
          status = "approved";
        }
        setActiveSwitchIds((prevIds) =>
          prevIds.filter((prevId) => prevId !== id)
        );
        api
          .put(`/api/admin/company-status/${id}?do=${status}&_method=PUT`)
          .then((res) => {
            setToggleStatusChanged(!toggleStatusChanged);
            setModalDetails({
              isVisible: true,
              image: "success",
              onClose: () => {
                resetModalDetails();
              },
            });
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
      }
    }
  };

  const handleToggle = (id) => {
    setActiveSwitchIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds;
      } else {
        return [...prevIds, id];
      }
    });
    setCompanyData((prevCompanies) =>
      prevCompanies.map((company) => {
        if (company.id === id) {
          return { ...company, isEnabled: !company.isEnabled };
        } else {
          return company;
        }
      })
    );
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Suspend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companyData.map((company, index) => (
              <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                <td
                  className="px-4 py-3 text-sm text-gray-900"
                  onClick={() => getCompany(company)}
                >
                  <EyeIcon className="h-5 w-5 text-blue-500" />
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900"
                  onClick={() => getCompany(company)}
                >
                  {company.brand_name}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900"
                  onClick={() => getCompany(company)}
                >
                  {company.company_name}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900"
                  onClick={() => getCompany(company)}
                >
                  {company.email}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900"
                  onClick={() => getCompany(company)}
                >
                  {company.phone_number}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900"
                  onClick={() => getCompany(company)}
                >
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
                <td className="px-4 py-3 text-sm text-gray-900">
                  {company &&
                    (company.status === "Approved" ||
                      company.status === "Suspended") && (
                      <div className="flex items-center justify-between">
                        <Switch
                          enabled={company.isEnabled}
                          onToggle={() => handleToggle(company.id)}
                        />
                        {activeSwitchIds.find((id) => id === company.id) && (
                          <button
                            onClick={() => handleStatusChange(company.id)}
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Save status"
                          >
                            <CheckIcon className="h-5 w-5 text-blue-500" />
                          </button>
                        )}
                      </div>
                    )}
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
