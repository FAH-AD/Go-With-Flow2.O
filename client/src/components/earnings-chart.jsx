"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

const EarningsChart = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Sample data - in a real app, this would come from an API
    const data = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Earnings",
          data: [520, 680, 450, 690],
          backgroundColor: "rgba(147, 51, 234, 0.2)",
          borderColor: "#9333EA",
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: "#9333EA",
          fill: true,
        },
      ],
    }

    // Chart configuration
    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#1e1e2d",
            titleColor: "#fff",
            bodyColor: "#9ca3af",
            borderColor: "#2d2d3a",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `$${context.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(45, 45, 58, 0.5)",
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
            },
          },
          y: {
            grid: {
              color: "rgba(45, 45, 58, 0.5)",
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
              callback: (value) => "$" + value,
            },
            beginAtZero: true,
          },
        },
      },
    }

    // Create chart
    if (chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Create new chart
      chartInstance.current = new Chart(chartRef.current, config)
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default EarningsChart
