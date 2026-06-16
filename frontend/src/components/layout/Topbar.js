import React from "react";

function Topbar({ title, subtitle, user, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <div className="topbar-user">
          <span>{user?.name}</span>
          <small>{user?.email}</small>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;