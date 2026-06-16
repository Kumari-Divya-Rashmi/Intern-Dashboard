import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import AdminCharts from "../components/AdminCharts";
import DashboardLayout from "../components/layout/DashboardLayout";

function AdminDashboard({ user, onLogout, activePage = "admin" }) {
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = user || savedUser;

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

      const internsData = await apiRequest(
        `/api/admin/interns?search=${search}`
      );

      const analyticsData = await apiRequest("/api/admin/analytics");

      setInterns(internsData.data || []);
      setAnalytics(analyticsData.data || null);
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

    return Math.min(
      Math.round((totalDonations / targetAmount) * 100),
      100
    );
  };

  const totalDonationAmount = interns.reduce(
    (sum, intern) => sum + (intern.totalDonations || 0),
    0
  );

  const getPageTitle = () => {
    if (activePage === "admin") return "Admin Dashboard";
    if (activePage === "interns") return "Intern Management";
    if (activePage === "analytics") return "Analytics";
    if (activePage === "activity") return "Activity Logs";
    if (activePage === "profile") return "Profile";

    return "Admin Dashboard";
  };

  const getPageSubtitle = () => {
    if (activePage === "admin") {
      return "Manage interns, donations, rewards, analytics, and activity.";
    }

    if (activePage === "interns") {
      return "Search, filter, update donations, and manage intern rewards.";
    }

    if (activePage === "analytics") {
      return "Track donation performance, reward status, and intern growth.";
    }

    if (activePage === "activity") {
      return "Monitor admin actions and recent system activity.";
    }

    if (activePage === "profile") {
      return "View your admin profile and account details.";
    }

    return "Manage interns, donations, rewards, analytics, and activity.";
  };

  const renderSummaryCards = () => {
    return (
      <section className="admin-summary-grid">
        <div className="stat-card">
          <p>Total Interns</p>
          <h2>{interns.length}</h2>
          <span>Registered interns</span>
        </div>

        <div className="stat-card">
          <p>Total Donations</p>
          <h2>₹{totalDonationAmount.toLocaleString("en-IN")}</h2>
          <span>Across all interns</span>
        </div>

        <div className="stat-card">
          <p>Admin</p>
          <h2>{currentUser?.name || "Admin"}</h2>
          <span>{currentUser?.email || "admin@example.com"}</span>
        </div>
      </section>
    );
  };

  const renderInternsSection = () => {
    return (
      <>
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
                      <strong>{intern.referralCode || "N/A"}</strong>
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

                    {(intern.rewards || []).map((reward) => (
                      <div className="admin-reward-row" key={reward.title}>
                        <span>{reward.title}</span>

                        <button
                          className={
                            reward.unlocked ? "unlock-btn" : "lock-btn"
                          }
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
      </>
    );
  };

  const renderActivitySection = () => {
    return (
      <section className="panel">
        <div className="panel-header">
          <h3>Recent Activity Logs</h3>
          <span>Coming soon</span>
        </div>

        <p className="panel-note">
          Here we will show admin actions like donation updates, reward unlocks,
          intern registrations, and profile changes.
        </p>

        <div className="reward-list">
          <div className="reward-item">
            <span>Admin dashboard opened</span>
            <strong className="unlocked">Active</strong>
          </div>

          <div className="reward-item">
            <span>Donation history module will be added next</span>
            <strong className="locked">Pending</strong>
          </div>
        </div>
      </section>
    );
  };

  const renderProfileSection = () => {
    return (
      <section className="panel">
        <div className="panel-header">
          <h3>Admin Profile</h3>
          <span>{currentUser?.role || "admin"}</span>
        </div>

        <div className="intern-meta-grid">
          <div>
            <p>Name</p>
            <strong>{currentUser?.name || "Admin"}</strong>
          </div>

          <div>
            <p>Email</p>
            <strong>{currentUser?.email || "admin@example.com"}</strong>
          </div>

          <div>
            <p>Role</p>
            <strong>{currentUser?.role || "admin"}</strong>
          </div>

          <div>
            <p>Access Level</p>
            <strong>Full admin access</strong>
          </div>
        </div>
      </section>
    );
  };

  const renderPageContent = () => {
    if (activePage === "admin") {
      return (
        <>
          {renderSummaryCards()}
          <AdminCharts analytics={analytics} />
          {renderInternsSection()}
        </>
      );
    }

    if (activePage === "interns") {
      return (
        <>
          {renderSummaryCards()}
          {renderInternsSection()}
        </>
      );
    }

    if (activePage === "analytics") {
      return (
        <>
          {renderSummaryCards()}
          <AdminCharts analytics={analytics} />
        </>
      );
    }

    if (activePage === "activity") {
      return renderActivitySection();
    }

    if (activePage === "profile") {
      return renderProfileSection();
    }

    return (
      <>
        {renderSummaryCards()}
        <AdminCharts analytics={analytics} />
      </>
    );
  };

  return (
    <DashboardLayout
      user={currentUser}
      onLogout={onLogout}
      title={getPageTitle()}
      subtitle={getPageSubtitle()}
      activePage={activePage}
    >
      {renderPageContent()}
    </DashboardLayout>
  );
}

export default AdminDashboard;