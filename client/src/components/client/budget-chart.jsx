"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

const BudgetChart = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Sample data - in a real app, this would come from an API
    const data = {
      labels: ["Web Design", "Mobile App", "Marketing", "Branding", "Content"],
      datasets: [
        {
          label: "Budget Allocation",
          data: [5800, 8500, 2800, 3200, 1500],
          backgroundColor: [
            "rgba(147, 51, 234, 0.8)",
            "rgba(79, 70, 229, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
          ],
          borderColor: "#121218",
          borderWidth: 2,
        },
      ],
    }

    // Chart configuration
    const config = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#fff",
              padding: 20,
              font: {
                size: 12,
              },
              generateLabels: (chart) => {
                const datasets = chart.data.datasets
                return chart.data.labels.map((label, i) => {
                  const value = datasets[0].data[i]
                  const total = datasets[0].data.reduce((acc, val) => acc + val, 0)
                  const percentage = Math.round((value / total) * 100)

                  return {
                    text: `${label}: $${value} (${percentage}%)`,
                    fillStyle: datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i,
                  }
                })
              },
            },
          },
          tooltip: {
            backgroundColor: "#1e1e2d",
            titleColor: "#fff",
            bodyColor: "#9ca3af",
            borderColor: "#2d2d3a",
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const value = context.raw
                const total = context.dataset.data.reduce((acc, val) => acc + val, 0)
                const percentage = Math.round((value / total) * 100)
                return `$${value.toLocaleString()} (${percentage}%)`
              },
            },
          },
        },
        cutout: "65%",
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

export default BudgetChart
