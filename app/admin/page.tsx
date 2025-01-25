import React from "react"
import AdminBarChart from "@/components/Admin/BarChart"
import AdminPieChart from "@/components/Admin/PieChart"
import AdminFullBarChart from "@/components/Admin/AreaChart"

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-5">
        <AdminBarChart />
        <AdminPieChart />
      </div>
      <AdminFullBarChart />
    </div>
  )
}

export default AdminDashboard


