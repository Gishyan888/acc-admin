import { useEffect, useState } from "react";
import api from "../../api/api";
import Pagination from "../../Components/Pagination";
import usePagination from "../../store/usePagination";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/16/solid";

export default function Contacts() {
  const navigate = useNavigate();
  const [contactsData, setContactsData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = usePagination((state) => state.currentPage);

  const getContactsInfo = () => {
    let apiURL = `/api/admin/contact_with?page=${currentPage}`;
    api
      .get(apiURL)
      .then((res) => {
        setContactsData(res.data.data);
        setPageCount(res.data.meta.last_page);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showContactInfo = (contact_id) => {
    navigate(`/contact/${contact_id}/show`);
  };

  useEffect(() => {
    getContactsInfo();
  }, [currentPage]);

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Company</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"></th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Brand Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Guest Name
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
