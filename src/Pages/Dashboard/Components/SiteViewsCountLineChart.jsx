import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import api from "../../../api/api";
import useModal from "../../../store/useModal";

export default function SiteViewsCountLineChart({ type = "weekly" }) {
  const [siteViewsCount, setSiteViewsCount] = useState([]);
  const [viewsTypeForSiteViews, setViewsTypeForSiteViews] = useState("weekly");
  const { setModalDetails, resetModalDetails } = useModal();
  const [data, setData] = useState({ labels: [], datasets: [] });

  // Fetch most viewed pages data from the API
  const getMostViewedPages = () => {
    let apiURL = `/api/site/views?type=site_views`;
    api
      .get(apiURL)
      .then((res) => {
        setSiteViewsCount(res.data);
        setData({
          labels: res.data["weekly"]?.map((item) => item.date) || [],
          datasets: [
            {
              label: "Total Views",
              data: res.data["weekly"]?.map((item) => item.views) || [],
              backgroundColor: backgroundColors,
              borderWidth: 1,
              barThickness: 40, // Control bar thickness
            },
          ],
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
  };

  const handleViewsTypeForSiteViewsChange = (value) => {
    setViewsTypeForSiteViews(value);
  };

  useEffect(() => {
    getMostViewedPages();
  }, []);

  useEffect(() => {
    setData({
      labels: siteViewsCount[viewsTypeForSiteViews]?.map((item) => item.date) || [],
      datasets: [
        {
          label: "Total Views",
          data: siteViewsCount[viewsTypeForSiteViews]?.map((item) => item.views) || [],
          backgroundColor: backgroundColors,
          borderWidth: 1,
          barThickness: 40, // Control bar thickness
        },
      ],
    });
  }, [viewsTypeForSiteViews]);

  // Chart options to customize y-axis, tooltips, and layout
  const options = {
    scales: {
      y: {
        ticks: {
          // Ensure ticks only show integers
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
          stepSize: 1, // Step size of 1 for clean integer ticks
          beginAtZero: true, // Start the axis at zero
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        callbacks: {
          // Customize tooltip to show formatted value
          label: function (data) {
            return `Views count: ${data.formattedValue}`;
          },
        },
      },
    },
  };

  // Define the dataset colors and data structure
  const backgroundColors = ["#53D9D9", "#002B49", "#0067A0"];

  return (
    <div className="mt-8 bg-white p-8 rounded-md shadow-md w-9/12">
      <h3 className="text-xl font-bold mb-2">Site Views</h3>
      <select
        name="viewsTypeForSiteViews"
        onChange={(e) => handleViewsTypeForSiteViewsChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
        value={viewsTypeForSiteViews}
      >
        <option disabled>Filter By</option>
        <option value={"weekly"}>Weekly</option>
        <option value={"monthly"}>Monthly</option>
        <option value={"yearly"}>Yearly</option>
      </select>
      <div className="w-full h-[400px]">
        <Line data={data} options={options} />
      </div>{" "}
    </div>
  );
}
