import { CheckCircle, AlertTriangle } from "lucide-react"

const PlatformStatus = () => {
  // Sample platform status data
  const services = [
    { name: "API Services", status: "operational", uptime: "99.98%" },
    { name: "Web Application", status: "operational", uptime: "99.95%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
    { name: "Payment Processing", status: "degraded", uptime: "98.75%" },
    { name: "Search Engine", status: "operational", uptime: "99.92%" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
          <span className="font-medium">System Operational</span>
        </div>
        <span className="text-sm text-gray-400">Updated 5 min ago</span>
      </div>

      <div className="space-y-3 mt-4">
        {services.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-[#1e1e2d] rounded-lg">
            <div className="flex items-center">
              {service.status === "operational" ? (
                <CheckCircle size={16} className="text-green-500 mr-2" />
              ) : (
                <AlertTriangle size={16} className="text-yellow-500 mr-2" />
              )}
              <span>{service.name}</span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm ${service.status === "operational" ? "text-green-400" : "text-yellow-400"}`}>
                {service.status === "operational" ? "Operational" : "Degraded Performance"}
              </span>
              <span className="text-xs text-gray-400 ml-2">({service.uptime})</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#2d2d3a]">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Last Incident</span>
          <span className="text-sm">July 28, 2023</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Payment processing service degradation (Resolved)</p>
      </div>
    </div>
  )
}

export default PlatformStatus
