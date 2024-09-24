import { useEffect, useState } from "react";
import api from "../../api/api";
import MostViewedPagesBarChart from "./Components/MostViewedPagesBarChart";
import SiteViewsCountLineChart from "./Components/SiteViewsCountLineChart";
import Select from "react-select";
import useModal from "../../store/useModal";
import StatusCard from "./Components/StatusCard";
import approvedIcon from "../../Images/approved.png";
import rejectedIcon from "../../Images/rejected.png";
import pendingIcon from "../../Images/pending.png";
import contactsIcon from "../../Images/contacts.png";
import ContactsCountCard from "./Components/ContactsCountCard";

export default function Dashboard() {
  const [reports, setReports] = useState({});
  const { setModalDetails, resetModalDetails } = useModal();

  const getReports = () => {
    let apiURL = `/api/site/reports`;
    api
      .get(apiURL)
      .then((res) => {
        setReports(res?.data);
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
    getReports();
  }, []);

  return (
    <div className="p-8">
      <div className="flex gap-8">
        <div>
          <div className="bg-[#fffaf0] px-8 py-4 rounded-md shadow-md w-2xl">
            <h3 className="text-xl font-bold mb-4">Products Count</h3>
            <div className="flex gap-8">
              <StatusCard
                title="Pending"
                count={
                  reports.products_count ? reports.products_count.pending : 0
                }
                icon={pendingIcon}
                containerClassName={"bg-yellow-200"}
                color="text-yellow-900"
              />{" "}
              <StatusCard
                title="Approved"
                count={
                  reports.products_count ? reports.products_count.approved : 0
                }
                icon={approvedIcon}
                containerClassName={"bg-green-200"}
                color="text-green-900"
              />{" "}
              <StatusCard
                title="Rejected"
                count={
                  reports.products_count ? reports.products_count.rejected : 0
                }
                icon={rejectedIcon}
                containerClassName={"bg-red-200"}
                color="text-red-900"
              />
            </div>
          </div>
          <div className="bg-white px-8 py-4 rounded-md shadow-md mt-8">
            <h3 className="text-xl font-bold mb-4">Company Count</h3>
            <div className="flex gap-8">
              <StatusCard
                title="Pending"
                count={
                  reports.company_count ? reports.company_count.pending : 0
                }
                icon={pendingIcon}
                containerClassName={"bg-yellow-100"}
                color="text-yellow-800"
              />{" "}
              <StatusCard
                title="Approved"
                count={
                  reports.company_count ? reports.company_count.approved : 0
                }
                icon={approvedIcon}
                containerClassName={"bg-green-100"}
                color="text-green-800"
              />{" "}
              <StatusCard
                title="Rejected"
                count={
                  reports.company_count ? reports.company_count.rejected : 0
                }
                icon={rejectedIcon}
                containerClassName={"bg-red-100"}
                color="text-red-800"
              />
            </div>
          </div>
        </div>

        <ContactsCountCard
          icon={contactsIcon}
          title="Contacts Count"
          count={reports.contact_count ?? 0}
        />
      </div>

      <MostViewedPagesBarChart />
      <SiteViewsCountLineChart />
    </div>
  );
}
