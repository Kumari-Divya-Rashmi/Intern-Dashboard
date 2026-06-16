import React from "react";

export function LoadingState({ message = "Loading data..." }) {
  return (
    <div className="state-card">
      <div className="loader"></div>
      <h3>{message}</h3>
      <p>Please wait while we fetch the latest data.</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong", onRetry }) {
  return (
    <div className="state-card error-state">
      <h3>⚠️ Error</h3>
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Try Again</button>}
    </div>
  );
}

export function EmptyState({
  title = "No data found",
  message = "There is nothing to show here yet.",
}) {
  return (
    <div className="state-card empty-state">
      <h3>📭 {title}</h3>
      <p>{message}</p>
    </div>
  );
}