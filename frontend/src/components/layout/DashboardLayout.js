import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({
  user,
  onLogout,
  title,
  subtitle,
  activePage,
  children,
}) {
  return (
    <div className="app-shell">
      <Sidebar user={user} activePage={activePage} />

      <div className="main-shell">
        <Topbar
          title={title}
          subtitle={subtitle}
          user={user}
          onLogout={onLogout}
        />

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;