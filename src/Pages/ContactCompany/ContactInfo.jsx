import api from "../../api/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function ContactInfo() {
  const { contact_id } = useParams();
  const [contactsData, setContactsData] = useState([]);

  const getContactInfo = () => {
    let apiURL = `/api/admin/contact_with/${contact_id}`;
    api
      .get(apiURL)
      .then((res) => {
        setContactsData(res.data);
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

  useEffect(() => {
    getContactInfo();
  }, []);

  return (
    <div className="p-8">
      <div className="flex gap-8">
        <div className="w-full">
          <h3 className="mb-4 text-xl pb-1 border-b border-b-gray-500 w-1/2">
            Guest Info
          </h3>
          <div className="bg-white p-8 rounded-md shadow-md">
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Fullname:
              </span>
              <span>{contactsData?.contact?.full_name}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Phone:
              </span>
              <span>{contactsData?.contact?.phone_number}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Email:
              </span>
              <span>{contactsData?.contact?.email}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Company:
              </span>
              <span>{contactsData?.contact?.company}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Country:
              </span>
              <span>{contactsData?.contact?.country}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                City:
              </span>
              <span>{contactsData?.contact?.city}</span>
            </p>
          </div>
        </div>
        <div className="w-full">
          <h3 className="mb-4 text-xl pb-1 border-b border-b-gray-500 w-1/2">
            Company Info
          </h3>
          <div className="bg-white p-8 rounded-md shadow-md">
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Brand Name:
              </span>
              <span>{contactsData?.company?.brand_name}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Phone:
              </span>
              <span>{contactsData?.company?.phone}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Email:
              </span>
              <span>{contactsData?.company?.email}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                Country:
              </span>
              <span>{contactsData?.company?.country}</span>
            </p>
            <p className="text-gray-900 py-1">
              <span className="italic mr-4 font-semibold text-gray-600">
                City:
              </span>
              <span>{contactsData?.company?.city}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="my-8 rounded-md bg-white p-2 shadow-md">
        <span className="italic mr-4 font-semibold text-gray-600">
          Subject:
        </span>
        <span>{contactsData?.contact?.subject}</span>
      </div>
      <div className="my-8 rounded-md bg-white p-2 shadow-md">
        <span className="italic mr-4 font-semibold text-gray-600">
        Message:
        </span>
        <span>{contactsData?.contact?.message}</span>
      </div>
    </div>
  );
}
