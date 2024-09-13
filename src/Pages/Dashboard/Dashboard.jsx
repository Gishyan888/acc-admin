import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Dashboard() {
  const [reports, setReports] = useState({});

  const getReports = () => {
    let apiURL = `/api/site/reports`;
    api
      .get(apiURL)
      .then((res) => {
        setReports(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <div className="p-8">
      <div className="flex gap-8">
        {reports.products_count && (
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
                  {reports.products_count.pending}
                </span>
              </div>
              <div
                className={
                  "bg-green-100 py-2 px-8 rounded-full w-[250px] flex flex-col"
                }
              >
                <label className="text-green-800">Approved</label>
                <span className="text-green-800 font-semibold">
                  {reports.products_count.approved}
                </span>
              </div>
              <div
                className={
                  "bg-red-100 py-2 px-8 rounded-full w-[250px] flex flex-col"
                }
              >
                <label className="text-red-800">Rejected</label>
                <span className="text-red-800 font-semibold">
                  {reports.products_count.rejected}
                </span>
              </div>
            </div>
          </div>
        )}
        {reports.contact_count && (
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
        )}
      </div>
    </div>
  );
}
