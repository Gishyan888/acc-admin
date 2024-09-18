import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import api from "../../../api/api";

export default function MostViewedPagesBarChart({ type = "weekly" }) {
  const [mostViewedPages, setMostViewedPages] = useState({});

  const getMostViewedPages = () => {
    let apiURL = `/api/site/views?type=most_viewed_pages`;
    api
      .get(apiURL)
      .then((res) => {
        console.log({ res: res.data });
        setMostViewedPages(res.data);
        console.log(mostViewedPages);
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
    getMostViewedPages();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (data) {
            console.log("ss", data);
            return "Views count:" + data.formattedValue;
          },
        },
      },
      datalabels: {
        color: "white",
        font: {
          weight: "bold", // Removed 'as const'
          size: 14,
          family: "poppins",
        },
      },
    },
  };

  const backgroundColors = ["#53D9D9", "#002B49", "#0067A0"];
  const data = {
    labels:
      mostViewedPages[type] && mostViewedPages[type].map((item) => item.name),
    datasets: [
      {
        label:
          mostViewedPages[type] &&
          mostViewedPages[type].map((item) => item.total_views),
        data:
          mostViewedPages[type] &&
          mostViewedPages[type].map((item) => item.total_views),
        backgroundColor: backgroundColors,
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
}
