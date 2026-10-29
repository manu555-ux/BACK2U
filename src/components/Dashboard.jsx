import React, { useState } from "react";
import {
  PackageCheck,
  KeyRound,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Info,
  MapPin,
  ExternalLink
} from "lucide-react";

export function Dashboard({ items, privateDetails = {}, claims, go, openItem, onMarkReunited, currentUserId = null, currentUserEmail = null }) {
  const [activeTab, setActiveTab] = useState("reports");

  const myReports = items.filter((i) => (currentUserId && i.reporterId === currentUserId) || (!i.reporterId && !currentUserEmail && i.owner === "You"));
  const pendingReports = myReports.filter((i) => !i.approved);
  const myClaims = claims.filter((claim) =>
    (currentUserId && claim.claimantId === currentUserId) ||
    myReports.some((item) => String(item.id) === String(claim.itemId))
  );
  const pendingClaims = myClaims.filter((c) => c.status === "Pending review");
  const approvedClaims = myClaims.filter((c) => c.status === "Approved for handover");

  return (
    <section className="page-wrap dashboard-page">
      <div className="page-intro">
        <div className="eyebrow">STUDENT PORTAL</div>
        <h1>
          My <span>Activity Hub.</span>
        </h1>
        <p>
          Monitor the status of your reported lost/found items and private ownership claims in real time.
        </p>
      </div>

      {/* Quick Statistics Strip */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <span>YOUR SUBMITTED REPORTS</span>
          <strong>{myReports.length}</strong>
          <small>{pendingReports.length} awaiting moderation</small>
        </div>

        <div className="stat-card">
          <span>OWNERSHIP CLAIMS</span>
          <strong>{myClaims.length}</strong>
          <small>{approvedClaims.length} approved for handover</small>
        </div>

        <div className="stat-card">
          <span>PENDING REVIEWS</span>
          <strong>{pendingReports.length + pendingClaims.length}</strong>
          <small>Campus desk is processing</small>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "reports" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          <PackageCheck size={16} />
          <span>My Reported Items ({myReports.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "claims" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("claims")}
        >
          <KeyRound size={16} />
          <span>My Ownership Claims ({myClaims.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "reports" ? (
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Items You've Reported</h2>
              <p>Items posted from this browser session.</p>
            </div>
            <button className="button button-dark button-small" onClick={() => go("Report")}>
              <Plus size={15} /> New Report
            </button>
          </div>

          {myReports.length > 0 ? (
            <div className="activity-list">
              {myReports.map((item) => {
                const isReunited = item.status === "Reunited";
                const isHandover = item.status === "Handover scheduled";

                let pillClass = "status-found";
                let pillText = "Published & Live";

                if (!item.approved) {
                  pillClass = "status-pending";
                  pillText = item.rejectionReason ? "Rejected by Moderator" : "Under Moderation";
                } else if (isReunited) {
                  pillClass = "status-reunited";
                  pillText = "Reunited 🎉";
                } else if (isHandover) {
                  pillClass = "status-handover";
                  pillText = "Handover Scheduled";
                }

                return (
                  <div className="activity-card" key={item.id}>
                    <div className="activity-card-left" onClick={() => openItem(item)}>
                      <span className={`activity-emoji ${item.color || "mint"}`}>
                        {item.emoji || "📦"}
                      </span>
                      <div className="activity-details">
                        <h4>{item.title}</h4>
                        <span className="activity-meta">
                          {item.type} item &middot; {item.category} &middot; {item.location} &middot; {item.date}
                        </span>
                        {privateDetails[String(item.id)]?.secret && (
                          <span className="activity-secret-badge">
                            <KeyRound size={12} /> Secret Clue: {privateDetails[String(item.id)]?.secret}
                          </span>
                        )}
                        {item.rejectionReason && (
                          <div className="rejection-note">
                            <AlertCircle size={14} /> Note: {item.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="activity-card-right">
                      <span className={`status-pill ${pillClass}`}>
                        <span className="status-dot"></span>
                        {pillText}
                      </span>

                      {item.approved && !isReunited && (
                        <button
                          type="button"
                          className="button button-small button-outline"
                          onClick={() => onMarkReunited(item.id)}
                          title="Mark this item as successfully returned"
                        >
                          <CheckCircle2 size={14} /> Mark Reunited
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-small">
              <PackageCheck size={32} />
              <h4>No items reported yet</h4>
              <p>When you lose or find something on campus, report it to have it tracked here.</p>
              <button className="button button-dark button-small" onClick={() => go("Report")}>
                Create your first report &rarr;
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Your Ownership Verification Requests</h2>
              <p>Claims you have filed to prove an item belongs to you.</p>
            </div>
          </div>

          {myClaims.length > 0 ? (
            <div className="activity-list">
              {myClaims.map((claim) => {
                const isApproved = claim.status === "Approved for handover";
                const isNeedsDetails = claim.status === "Needs more details";
                const isRejected = claim.status === "Rejected";

                let pillClass = "status-pending";
                if (isApproved) pillClass = "status-found";
                if (isNeedsDetails) pillClass = "status-pending";
                if (isRejected) pillClass = "status-lost";

                return (
                  <div className="activity-card claim-activity-card" key={claim.id}>
                    <div className="activity-card-left">
                      <span className="activity-emoji peach">🔐</span>
                      <div className="activity-details">
                        <h4>{claim.itemTitle}</h4>
                        <span className="activity-meta">
                          Submitted as: {claim.claimantName} ({claim.claimantContact}) &middot; {claim.submittedAt}
                        </span>

                        <div className="claim-proof-display">
                          <strong>Your submitted proof:</strong>
                          {claim.details && <p>"{claim.details}"</p>}
                          {Array.isArray(claim.answers) && claim.answers.length > 0 && (
                            <div className="claim-answers-review">
                              {claim.answers.map((entry, index) => (
                                <div key={`${claim.id}-${index}`}>
                                  <strong>Q{index + 1}: {entry.question}</strong>
                                  <p>{entry.answer}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Handover Instruction Banner */}
                        {isApproved && (
                          <div className="handover-notice-box">
                            <ShieldCheck size={18} />
                            <div>
                              <strong>Handover Approved by Campus Desk!</strong>
                              <p>
                                <strong>Pickup Location:</strong> {claim.handoverLocation || "Campus Security Desk, Block A Ground Floor"}
                              </p>
                              <small>
                                Bring your valid Student Smart ID card between 10:00 AM &ndash; 4:30 PM.
                              </small>
                            </div>
                          </div>
                        )}

                        {/* Moderator notes if requested more info */}
                        {claim.adminNotes && !isApproved && (
                          <div className="admin-feedback-note">
                            <Info size={14} />
                            <span>
                              <strong>Moderator Note:</strong> {claim.adminNotes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="activity-card-right">
                      <span className={`status-pill ${pillClass}`}>
                        <span className="status-dot"></span>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-small">
              <KeyRound size={32} />
              <h4>No claims submitted</h4>
              <p>When you spot something that belongs to you on the board, submit a private claim to verify ownership.</p>
              <button className="button button-outline button-small" onClick={() => go("Browse items")}>
                Browse items &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Demo storage disclaimer */}
      <div className="demo-note">
        <Info size={18} />
        <p>
          <strong>Prototype Architecture Note:</strong> This dashboard displays items stored inside your local browser memory (<code>localStorage</code>). In a production deployment, this would be backed by university Single Sign-On (SSO) and a secure database so your data persists across all your devices.
        </p>
      </div>
    </section>
  );
}
