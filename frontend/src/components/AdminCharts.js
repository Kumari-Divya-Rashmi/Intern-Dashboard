import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";


function AdminCharts({ analytics }) {
  if (!analytics) {
    return null;
  }

  const rewardData = [
    { name: "Unlocked", value: analytics.rewardStats.unlocked },
    { name: "Locked", value: analytics.rewardStats.locked },
  ];

  return (
    <section className="charts-grid">
      <div className="chart-card">
        <div className="panel-header">
          <h3>Top Interns by Donations</h3>
          <span>Top 5</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.topInterns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalDonations" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <div className="panel-header">
          <h3>Donation Trend</h3>
          <span>History</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.donationTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newAmount" name="Total Amount" />
            <Line type="monotone" dataKey="changeAmount" name="Change" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <div className="panel-header">
          <h3>Reward Status</h3>
          <span>Unlocked vs Locked</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={rewardData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {rewardData.map((entry, index) => (
                <Cell key={entry.name} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default AdminCharts;