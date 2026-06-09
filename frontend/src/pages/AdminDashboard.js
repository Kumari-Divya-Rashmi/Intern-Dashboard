import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import AdminCharts from "../components/AdminCharts";

function AdminDashboard({ user, onLogout }) {
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingDonation, setEditingDonation] = useState({});
  const [analytics, setAnalytics] = useState(null);  


  const fetchInterns = async () => {
  try {
    setError("");
    setLoading(true);

    const internsData = await apiRequest(`/api/admin/interns?search=${search}`);
    const analyticsData = await apiRequest("/api/admin/analytics");

    setInterns(internsData.data);
    setAnalytics(analyticsData.data);
  } catch (error) {
    setError(error.message || "Failed to fetch interns");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleDonationInput = (internId, value) => {
    setEditingDonation({
      ...editingDonation,
      [internId]: value,
    });
  };

  const updateDonation = async (internId) => {
    try {
      const amount = Number(editingDonation[internId]);

      if (Number.isNaN(amount) || amount < 0) {
        setError("Please enter a valid donation amount");
        return;
      }

      await apiRequest(`/api/admin/interns/${internId}/donation`, {
        method: "PATCH",
        body: JSON.stringify({ amount }),
      });

      setEditingDonation({
        ...editingDonation,
        [internId]: "",
      });

      fetchInterns();
    } catch (error) {
      setError(error.message || "Failed to update donation");
    }
  };

  const updateReward = async (internId, rewardTitle, unlocked) => {
    try {
      await apiRequest(`/api/admin/interns/${internId}/reward`, {
        method: "PATCH",
        body: JSON.stringify({
          rewardTitle,
          unlocked,
        }),
      });

      fetchInterns();
    } catch (error) {
      setError(error.message || "Failed to update reward");
    }
  };

  const getProgress = (totalDonations, targetAmount) => {
    if (!targetAmount) return 0;
    return Math.min(Math.round((totalDonations / targetAmount) * 100), 100);
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header admin-header">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Manage Interns</h1>
          <p className="subtitle">
            Search interns, update donations, manage rewards, and monitor
            performance.
          </p>
        </div>

        <div className="header-actions">
          <button onClick={fetchInterns}>Refresh</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </section>

      <section className="admin-summary-grid">
        <div className="stat-card">
          <p>Total Interns</p>
          <h2>{interns.length}</h2>
          <span>Registered interns</span>
        </div>

        <div className="stat-card">
          <p>Total Donations</p>
          <h2>
            ₹
            {interns
              .reduce((sum, intern) => sum + (intern.totalDonations || 0), 0)
              .toLocaleString("en-IN")}
          </h2>
          <span>Across all interns</span>
        </div>

        <div className="stat-card">
          <p>Admin</p>
          <h2>{user.name}</h2>
          <span>{user.email}</span>
        </div>
      </section>
    
    <AdminCharts analytics={analytics} />
    
      <section className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by name, email, or referral code"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              fetchInterns();
            }
          }}
        />

        <button onClick={fetchInterns}>Search</button>
      </section>

      {error && <div className="error-message admin-error">{error}</div>}

      {loading ? (
        <div className="panel">
          <p className="panel-note">Loading interns...</p>
        </div>
      ) : interns.length === 0 ? (
        <div className="panel">
          <p className="panel-note">No interns found.</p>
        </div>
      ) : (
        <section className="admin-intern-grid">
          {interns.map((intern) => {
            const progress = getProgress(
              intern.totalDonations,
              intern.targetAmount
            );

            return (
              <div className="admin-intern-card" key={intern._id}>
                <div className="intern-card-header">
                  <div>
                    <h3>{intern.name}</h3>
                    <p>{intern.email}</p>
                  </div>

                  <span className="role-badge">{intern.role}</span>
                </div>

                <div className="intern-meta-grid">
                  <div>
                    <p>Referral Code</p>
                    <strong>{intern.referralCode}</strong>
                  </div>

                  <div>
                    <p>Donations</p>
                    <strong>
                      ₹{(intern.totalDonations || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <p>Target</p>
                    <strong>
                      ₹{(intern.targetAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <p>Progress</p>
                    <strong>{progress}%</strong>
                  </div>
                </div>

                <div className="admin-progress-track">
                  <div
                    className="admin-progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="donation-update-row">
                  <input
                    type="number"
                    placeholder="Enter new donation amount"
                    value={editingDonation[intern._id] || ""}
                    onChange={(event) =>
                      handleDonationInput(intern._id, event.target.value)
                    }
                  />

                  <button onClick={() => updateDonation(intern._id)}>
                    Update
                  </button>
                </div>

                <div className="reward-admin-section">
                  <h4>Rewards</h4>

                  {intern.rewards.map((reward) => (
                    <div className="admin-reward-row" key={reward.title}>
                      <span>{reward.title}</span>

                      <button
                        className={reward.unlocked ? "unlock-btn" : "lock-btn"}
                        onClick={() =>
                          updateReward(
                            intern._id,
                            reward.title,
                            !reward.unlocked
                          )
                        }
                      >
                        {reward.unlocked ? "Unlocked" : "Locked"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default AdminDashboard;