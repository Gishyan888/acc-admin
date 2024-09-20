import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import api from "../../../api/api";
import useModal from "../../../store/useModal";
export default function MostViewedPagesBarChart() {
  const [mostViewedPages, setMostViewedPages] = useState([]);
  const [viewsType, setViewsType] = useState("weekly");
  const { setModalDetails, resetModalDetails } = useModal();
  const [data, setData] = useState({ labels: [], datasets: [] });
  // Fetch most viewed pages data from the API
  const getMostViewedPages = () => {
    let apiURL = `/api/site/views?type=most_viewed_pages`;
    api
      .get(apiURL)
      .then((res) => {
        setMostViewedPages(res.data);
        setData({
          labels: res.data["weekly"]?.map((item) => item.name) || [],
          datasets: [
            {
              label: "Total Views",
              data: res.data["weekly"]?.map((item) => item.total_views) || [],
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

  const handleViewsTypeChange = (value) => {
    setViewsType(value);
  };

  useEffect(() => {
    setData({
      labels: mostViewedPages[viewsType]?.map((item) => item.name) || [],
      datasets: [
        {
          label: "Total Views",
          data:
            mostViewedPages[viewsType]?.map((item) => item.total_views) || [],
          backgroundColor: backgroundColors,
          borderWidth: 1,
          barThickness: 40, // Control bar thickness
        },
      ],
    });
  }, [viewsType]);

  // useEffect(() => {
  //   getMostViewedPages();
  // }, []);

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
      <h3 className="text-xl font-bold mb-2">Most Viewed Pages</h3>
      <select
        name="viewsType"
        onChange={(e) => handleViewsTypeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
        value={viewsType}
      >
        <option disabled>Filter By</option>
        <option value={"weekly"}>Weekly</option>
        <option value={"monthly"}>Monthly</option>
        <option value={"yearly"}>Yearly</option>
      </select>

      {mostViewedPages && mostViewedPages[viewsType]?.length > 0 ? (
        <div className="w-full h-[400px]">
          <Bar data={data} options={options} />
        </div>
      ) : (
        <p>There are no pages viewed yet.</p>
      )}
    </div>
  );
}
