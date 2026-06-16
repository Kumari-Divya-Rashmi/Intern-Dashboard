import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ user, activePage }) {
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const menuItems = isAdmin
    ? [
        {
          key: "admin",
          label: "Admin Dashboard",
          icon: "📊",
          path: "/admin/dashboard",
        },
        {
          key: "interns",
          label: "Interns",
          icon: "👥",
          path: "/admin/interns",
        },
        {
          key: "analytics",
          label: "Analytics",
          icon: "📈",
          path: "/admin/analytics",
        },
        {
          key: "activity",
          label: "Activity Logs",
          icon: "🕘",
          path: "/admin/activity",
        },
        {
          key: "profile",
          label: "Profile",
          icon: "👤",
          path: "/admin/profile",
        },
      ]
    : [
        {
          key: "intern",
          label: "My Dashboard",
          icon: "🏠",
          path: "/intern/dashboard",
        },
        {
          key: "rewards",
          label: "Rewards",
          icon: "🎁",
          path: "/intern/dashboard",
        },
        {
          key: "leaderboard",
          label: "Leaderboard",
          icon: "🏆",
          path: "/intern/dashboard",
        },
        {
          key: "profile",
          label: "Profile",
          icon: "👤",
          path: "/intern/dashboard",
        },
      ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">ID</div>

        <div>
          <h2>InternDash</h2>
          <p>{isAdmin ? "Admin Panel" : "Intern Portal"}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={activePage === item.key ? "nav-item active" : "nav-item"}
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <strong>{user?.name || "User"}</strong>
          <p>{user?.role || "intern"}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;