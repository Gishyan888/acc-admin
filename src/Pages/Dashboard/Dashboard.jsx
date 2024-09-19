import { useEffect, useState } from "react";
import api from "../../api/api";
import MostViewedPagesBarChart from "./Components/MostViewedPagesBarChart";
import SiteViewsCountLineChart from "./Components/SiteViewsCountLineChart";
import Select from "react-select";
import useModal from "../../store/useModal";
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
        <div className="bg-white px-8 py-4 rounded-md shadow-md w-2xl">
          <h3 className="text-xl font-bold mb-2">Products Count</h3>
          <div className="flex gap-8">
            <div
              className={
                "py-2 px-8 rounded-full w-[250px] flex flex-col bg-yellow-100"
              }
            >
              <label className="text-yellow-800">Pending</label>
              <span className="text-yellow-800 font-semibold">
                {reports.products_count ? reports.products_count.pending : 0}
              </span>
            </div>
            <div
              className={
                "bg-green-100 py-2 px-8 rounded-full w-[250px] flex flex-col"
              }
            >
              <label className="text-green-800">Approved</label>
              <span className="text-green-800 font-semibold">
                {reports.products_count ? reports.products_count.approved : 0}
              </span>
            </div>
            <div
              className={
                "bg-red-100 py-2 px-8 rounded-full w-[250px] flex flex-col"
              }
            >
              <label className="text-red-800">Rejected</label>
              <span className="text-red-800 font-semibold">
                {reports.products_count ? reports.products_count.rejected : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white px-8 py-4 rounded-md shadow-md w-2xl flex flex-col justify-end">
          <div
            className={
              "bg-blue-100 py-2 px-8 rounded-full w-[250px] flex flex-col"
            }
          >
            <label className="text-blue-800">Contacts Count</label>
            <span className="text-blue-800 font-semibold">
              {reports.contact_count}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="bg-white px-8 py-4 rounded-md shadow-md mt-8">
          <h3 className="text-xl font-bold mb-2">Company Count</h3>
          <div className="flex gap-8">
            <div
              className={
                "py-2 px-8 rounded-full w-[250px] flex flex-col bg-yellow-100"
              }
            >
              <label className="text-yellow-800">Pending</label>
              <span className="text-yellow-800 font-semibold">
                {reports.company_count ? reports.company_count.pending : 0}
              </span>
            </div>
            <div
              className={
                "bg-green-100 py-2 px-8 rounded-full w-[250px] flex flex-col"
              }
            >
              <label className="text-green-800">Approved</label>
              <span className="text-green-800 font-semibold">
                {reports.company_count ? reports.company_count.approved : 0}
              </span>
            </div>
            <div
              className={
                "bg-red-100 py-2 px-8 rounded-full w-[250px] flex flex-col"
              }
            >
              <label className="text-red-800">Rejected</label>
              <span className="text-red-800 font-semibold">
                {reports.company_count ? reports.company_count.rejected : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <MostViewedPagesBarChart />
      <SiteViewsCountLineChart />
    </div>
  );
}
