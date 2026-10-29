import React from "react";
import { ShieldAlert, RotateCcw, UserCheck, ShieldCheck, HelpCircle } from "lucide-react";

export function DemoBanner({
  role,
  setRole,
  onResetData,
  pendingCount,
  pendingClaimsCount,
  onNavigate
}) {
  const handleReset = () => {
    const ok = window.confirm(
      "Reset all items, claims, and moderation records back to starter sample data?"
    );
    if (ok) {
      onResetData();
    }
  };

  return (
    <div className="demo-banner-bar">
      <div className="demo-banner-inner">
        <div className="demo-banner-left">
          <span className="demo-tag">PROTOTYPE DEMO</span>
          <span className="demo-desc">
            Frontend-only showcase &middot; <strong>localStorage + simulated sign-in</strong> (No backend or live AI)
          </span>
        </div>

        <div className="demo-banner-right">
          {/* Quick role switcher */}
          <div className="role-switch-group" role="group" aria-label="Simulated User Role">
            <span className="role-label">Simulate Role:</span>
            <button
              type="button"
              className={`role-btn ${role === "student" ? "role-active" : ""}`}
              onClick={() => {
                setRole("student");
                onNavigate("Home");
              }}
              title="Student View: Browse, Report, and Claim items"
            >
              <UserCheck size={14} />
              <span>Student</span>
            </button>
            <button
              type="button"
              className={`role-btn ${role === "admin" ? "role-active" : ""}`}
              onClick={() => {
                setRole("admin");
                onNavigate("Admin dashboard", "admin");
              }}
              title="Campus Moderator View: Verify private clues and approve posts"
            >
              <ShieldCheck size={14} />
              <span>Campus Admin</span>
              {(pendingCount > 0 || pendingClaimsCount > 0) && (
                <span className="role-badge" title="Pending reviews">
                  {pendingCount + pendingClaimsCount}
                </span>
              )}
            </button>
          </div>

          {/* Reset Demo Data button */}
          <button
            type="button"
            className="demo-reset-btn"
            onClick={handleReset}
            title="Reset data back to starter demo items"
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
