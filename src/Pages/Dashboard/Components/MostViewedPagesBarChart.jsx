import React from 'react'
import { Bar } from "react-chartjs-2";


export default function MostViewedPagesBarChart() {
    const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (data) {
            return "Custom Label Text:" + data.formattedValue;
          }
        }
      },
      datalabels: {
        color: "white",
        font: {
          weight: 'bold' as const,
          size:14,
          family: 'poppins'
        }
      },
    }
  }
  return (
    <div>
      
    </div>
  )
}
