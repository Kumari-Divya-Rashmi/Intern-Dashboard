import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import DashboardLayout from "../components/layout/DashboardLayout";

function InternDashboard({ user, onLogout }) {
  const [intern, setIntern] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showRewardsInfo, setShowRewardsInfo] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setError("");
      setRefreshing(true);

      const internData = await apiRequest("/api/intern/me");
      const leaderboardData = await apiRequest("/api/intern/leaderboard");

      setIntern(internData.data);
      setLeaderboard(leaderboardData.data || []);
    } catch (error) {
      setError(error.message || "Failed to load dashboard");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCopyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(intern.referralCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      setError("Failed to copy referral code");
    }
  };

  const handleShareReferralCode = () => {
    const message = `Hi, please support my internship fundraising campaign. Use my referral code: ${intern.referralCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  if (error) {
    return (
      <DashboardLayout
        user={user}
        onLogout={onLogout}
        title="Intern Dashboard"
        subtitle="Track your referral code, donations, rewards, and leaderboard rank."
        activePage="intern"
      >
        <div className="state-card error-state">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchDashboard}>Try Again</button>
        </div>
      </DashboardLayout>
    );
  }

  if (!intern) {
    return (
      <DashboardLayout
        user={user}
        onLogout={onLogout}
        title="Intern Dashboard"
        subtitle="Track your referral code, donations, rewards, and leaderboard rank."
        activePage="intern"
      >
        <div className="state-card">
          <div className="loader"></div>
          <h3>Loading dashboard...</h3>
          <p>Please wait while we fetch your latest data.</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalDonations = intern.totalDonations || 0;
  const targetAmount = intern.targetAmount || 1;
  const tasksCompleted = intern.tasksCompleted || 0;
  const totalTasks = intern.totalTasks || 1;

  const donationProgress = Math.min(
    Math.round((totalDonations / targetAmount) * 100),
    100
  );

  const taskProgress = Math.min(
    Math.round((tasksCompleted / totalTasks) * 100),
    100
  );

  const remainingAmount = Math.max(targetAmount - totalDonations, 0);

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      title="Intern Dashboard"
      subtitle="Track your referral code, donations, rewards, and leaderboard rank."
      activePage="intern"
    >
      <section className="intern-action-row">
        <button onClick={fetchDashboard} disabled={refreshing}>
          {refreshing ? "Refreshing..." : "Refresh Dashboard"}
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <p>Total Donations</p>
          <h2>₹{totalDonations.toLocaleString("en-IN")}</h2>
          <span>Target: ₹{targetAmount.toLocaleString("en-IN")}</span>
        </div>

        <div className="stat-card">
          <p>Referral Code</p>
          <h2>{intern.referralCode}</h2>

          <div className="card-actions">
            <button onClick={handleCopyReferralCode}>
              {copied ? "Copied!" : "Copy Code"}
            </button>

            <button onClick={handleShareReferralCode}>Share</button>
          </div>
        </div>

        <div className="stat-card">
          <p>Tasks Completed</p>
          <h2>
            {tasksCompleted}/{totalTasks}
          </h2>
          <span>{taskProgress}% task progress</span>
        </div>

        <div className="stat-card">
          <p>Role</p>
          <h2>{intern.role}</h2>
          <span>Logged in as {user?.email}</span>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel donation-panel">
          <div className="panel-header">
            <h3>Donation Progress</h3>
            <span>{donationProgress}%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${donationProgress}%` }}
            ></div>
          </div>

          <div className="progress-summary">
            <div>
              <p>Raised</p>
              <strong>₹{totalDonations.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <p>Remaining</p>
              <strong>₹{remainingAmount.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <p>Target</p>
              <strong>₹{targetAmount.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Rewards</h3>

            <button
              className="small-action-btn"
              onClick={() => setShowRewardsInfo(!showRewardsInfo)}
            >
              {showRewardsInfo ? "Hide Info" : "View Criteria"}
            </button>
          </div>

          {showRewardsInfo && (
            <div className="info-box">
              <p>
                Rewards are unlocked based on donation progress and admin
                verification.
              </p>

              <ul>
                <li>Certificate: Basic participation completion</li>
                <li>Gift Card: Good fundraising performance</li>
                <li>LinkedIn Recommendation: Excellent overall performance</li>
              </ul>
            </div>
          )}

          <div className="reward-list">
            {(intern.rewards || []).map((reward) => (
              <div className="reward-item" key={reward.title}>
                <span>{reward.title}</span>

                <strong className={reward.unlocked ? "unlocked" : "locked"}>
                  {reward.unlocked ? "Unlocked" : "Locked"}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel leaderboard-panel">
          <div className="panel-header">
            <h3>Leaderboard</h3>
            <span>Top Performers</span>
          </div>

          <div className="leaderboard-list">
            {leaderboard.length === 0 ? (
              <p className="panel-note">No leaderboard data available yet.</p>
            ) : (
              leaderboard.map((item, index) => (
                <div className="leaderboard-item" key={item._id}>
                  <span>#{index + 1}</span>

                  <p>{item.name}</p>

                  <strong>
                    ₹{(item.totalDonations || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default InternDashboard;