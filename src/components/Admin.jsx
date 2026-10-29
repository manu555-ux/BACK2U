import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  KeyRound,
  Lock,
  PackageCheck,
  AlertTriangle,
  MapPin,
  Clock,
  User,
  HeartHandshake,
  Check,
  X,
  MessageSquare
} from "lucide-react";

export function Admin({
  items,
  privateDetails = {},
  claims,
  approveItem,
  rejectItem,
  updateClaim,
  onMarkReunited
}) {
  const [activeTab, setActiveTab] = useState("claims");
  const [handoverModal, setHandoverModal] = useState(null); // claim object
  const [customHandoverLoc, setCustomHandoverLoc] = useState(
    "Campus Security Desk, Block A Ground Floor (Bring Student ID)"
  );
  const [rejectItemModal, setRejectItemModal] = useState(null); // item object
  const [rejectionReason, setRejectionReason] = useState(
    "Contains sensitive personal info or doesn't comply with campus guidelines."
  );

  const pendingItems = items.filter((i) => !i.approved && !i.rejectionReason);
  const pendingClaims = claims.filter((c) => c.status === "Pending review");
  const approvedClaims = claims.filter((c) => c.status === "Approved for handover");
  const reunitedItems = items.filter((i) => i.status === "Reunited");
  const rejectedItems = items.filter((i) => i.rejectionReason);

  // Helper to find the original item corresponding to a claim
  const getItemForClaim = (itemId) => {
    return items.find((i) => i.id === itemId);
  };

  const handleApproveHandover = (claim) => {
    updateClaim(
      claim.id,
      "Approved for handover",
      "Secret clue verified successfully.",
      customHandoverLoc
    );
    setHandoverModal(null);
  };

  const handleRejectPost = (item) => {
    rejectItem(item.id, rejectionReason);
    setRejectItemModal(null);
  };

  return (
    <section className="page-wrap admin-page">
      {/* Page Title & Intro */}
      <div className="page-intro">
        <div className="eyebrow">CAMPUS SAFETY &amp; MODERATION</div>
        <h1>
          Moderator <span>Review Desk.</span>
        </h1>
        <p>
          Verify ownership claims side-by-side, approve new campus posts, and oversee secure handovers.
        </p>
      </div>

      {/* Production Warning Banner */}
      <div className="safety-panel admin-warning">
        <ShieldCheck size={24} />
        <div>
          <h3>Prototype Demonstration Notice</h3>
          <p>
            In this front-end demo, moderation actions update your browser's local state. In a real university deployment, this moderation interface would be secured by campus SSO (Google Workspace for Education / Microsoft Entra ID), server-side Role-Based Access Control (RBAC), and encrypted audit logs.
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs-nav">
        <button
          className={`tab-btn ${activeTab === "claims" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("claims")}
        >
          <KeyRound size={16} />
          <span>
            Verify Claims Queue{" "}
            {pendingClaims.length > 0 && (
              <span className="count-badge">{pendingClaims.length}</span>
            )}
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === "posts" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          <PackageCheck size={16} />
          <span>
            New Posts Queue{" "}
            {pendingItems.length > 0 && (
              <span className="count-badge">{pendingItems.length}</span>
            )}
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === "archive" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("archive")}
        >
          <HeartHandshake size={16} />
          <span>Resolved &amp; Reunited ({reunitedItems.length})</span>
        </button>
      </div>

      {/* TAB 1: SIDE-BY-SIDE CLAIM VERIFICATION */}
      {activeTab === "claims" && (
        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <h2>Ownership Claims Awaiting Verification</h2>
              <p>Compare the Finder's private clue with the Claimant's proof of ownership.</p>
            </div>
            <span className="queue-status-indicator">
              {pendingClaims.length} pending verification
            </span>
          </div>

          {claims.length > 0 ? (
            <div className="claims-comparison-list">
              {claims.map((claim) => {
                const matchedItem = getItemForClaim(claim.itemId);
                const isPending = claim.status === "Pending review";
                const isApproved = claim.status === "Approved for handover";

                return (
                  <div
                    key={claim.id}
                    className={`comparison-card ${isApproved ? "claim-card-approved" : ""}`}
                  >
                    {/* Header */}
                    <div className="comparison-card-header">
                      <div className="claim-id-pill">Claim #{claim.id}</div>
                      <h3 className="claim-item-heading">
                        Item: {claim.itemTitle}
                      </h3>
                      <span
                        className={`status-pill ${
                          isApproved
                            ? "status-found"
                            : claim.status === "Rejected"
                            ? "status-lost"
                            : "status-pending"
                        }`}
                      >
                        <span className="status-dot"></span>
                        {claim.status}
                      </span>
                    </div>

                    {/* Side-by-Side Comparison Container */}
                    <div className="comparison-grid">
                      {/* Left: Finder's Registered Secret Clue */}
                      <div className="comparison-col finder-col">
                        <div className="col-header">
                          <Lock size={15} />
                          <strong>Finder's Secret Clue (Private)</strong>
                        </div>

                        {matchedItem ? (
                          <div className="col-content">
                            <p className="item-meta-row">
                              <strong>Reported By:</strong> {matchedItem.owner} (
                              {matchedItem.type} item)
                            </p>
                            <p className="item-meta-row">
                              <strong>Found At:</strong> {matchedItem.location}
                            </p>
                            <div className="secret-highlight-box">
                              <span className="secret-badge">
                                <KeyRound size={12} /> REGISTERED SECRET CLUE:
                              </span>
                              <p className="secret-text">
                                "{privateDetails[String(matchedItem.id)]?.secret || "No secret clue was provided by finder."}"
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="muted-text">Item record not found.</p>
                        )}
                      </div>

                      {/* Right: Claimant's Submitted Proof */}
                      <div className="comparison-col claimant-col">
                        <div className="col-header">
                          <User size={15} />
                          <strong>Claimant's Submitted Proof</strong>
                        </div>

                        <div className="col-content">
                          <p className="item-meta-row">
                            <strong>Claimant:</strong> {claim.claimantName}
                          </p>
                          <p className="item-meta-row">
                            <strong>Contact:</strong> {claim.claimantContact}
                          </p>
                          <p className="item-meta-row">
                            <strong>Submitted:</strong> {claim.submittedAt}
                          </p>
                          <div className="claim-proof-box">
                            <span className="proof-badge">CLAIMANT'S STATED PROOF:</span>
                            {claim.details && <p className="proof-text">"{claim.details}"</p>}
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
                        </div>
                      </div>
                    </div>

                    {/* Moderator Action Buttons */}
                    <div className="comparison-card-actions">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            className="button button-dark button-small"
                            onClick={() => setHandoverModal(claim)}
                          >
                            <Check size={14} /> Approve for Campus Handover
                          </button>

                          <button
                            type="button"
                            className="button button-outline button-small"
                            onClick={() =>
                              updateClaim(
                                claim.id,
                                "Needs more details",
                                "Please provide additional photos or receipt to campus desk."
                              )
                            }
                          >
                            <MessageSquare size={14} /> Request More Details
                          </button>

                          <button
                            type="button"
                            className="button button-danger button-small"
                            onClick={() =>
                              updateClaim(
                                claim.id,
                                "Rejected",
                                "Claim proof does not match finder's secret clue."
                              )
                            }
                          >
                            <X size={14} /> Reject Claim
                          </button>
                        </>
                      ) : isApproved && matchedItem && matchedItem.status !== "Reunited" ? (
                        <div className="approved-actions-row">
                          <span className="handover-loc-info">
                            <strong>Handover Destination:</strong> {claim.handoverLocation}
                          </span>
                          <button
                            type="button"
                            className="button button-dark button-small"
                            onClick={() => onMarkReunited(matchedItem.id)}
                          >
                            <HeartHandshake size={14} /> Mark as Reunited &amp; Complete Handover
                          </button>
                        </div>
                      ) : (
                        <div className="claim-status-info">
                          <span>Status: {claim.status}</span>
                          {claim.adminNotes && <small> &middot; Note: {claim.adminNotes}</small>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-small">
              <CheckCircle2 size={32} />
              <h4>No claims awaiting review</h4>
              <p>Submitted ownership verification claims will appear here for comparison.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NEW POSTS MODERATION QUEUE */}
      {activeTab === "posts" && (
        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <h2>New Community Posts Awaiting Approval</h2>
              <p>Ensure posts follow campus safety policies before publishing to the community board.</p>
            </div>
            <span className="queue-status-indicator">
              {pendingItems.length} awaiting review
            </span>
          </div>

          {pendingItems.length > 0 ? (
            <div className="admin-items-list">
              {pendingItems.map((item) => (
                <div className="admin-row-card" key={item.id}>
                  <div className="admin-row-left">
                    <span className={`activity-emoji ${item.color || "mint"}`}>
                      {item.emoji || "📦"}
                    </span>
                    <div className="admin-item-details">
                      <h4>
                        {item.title}{" "}
                        <span className="item-type-badge-inline">
                          {item.type}
                        </span>
                      </h4>
                      <div className="admin-meta-line">
                        <span>
                          <MapPin size={13} /> {item.location}
                        </span>
                        <span>&bull;</span>
                        <span>
                          <Clock size={13} /> {item.date}
                        </span>
                        <span>&bull;</span>
                        <span>Category: {item.category}</span>
                        <span>&bull;</span>
                        <span>Reported by: {item.owner}</span>
                      </div>
                      <p className="admin-item-desc">{item.description}</p>
                      {privateDetails[String(item.id)]?.secret && (
                        <div className="admin-secret-preview">
                          <KeyRound size={13} />
                          <strong>Finder's Private Clue:</strong> {privateDetails[String(item.id)]?.secret}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="button button-dark button-small"
                      onClick={() => approveItem(item.id)}
                    >
                      <Check size={14} /> Approve &amp; Publish
                    </button>
                    <button
                      type="button"
                      className="button button-danger button-small"
                      onClick={() => setRejectItemModal(item)}
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-small">
              <CheckCircle2 size={32} />
              <h4>All caught up!</h4>
              <p>No new lost or found posts are waiting for campus moderation.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESOLVED & REUNITED ARCHIVE */}
      {activeTab === "archive" && (
        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <h2>Reunited Belongings &amp; Closed Cases</h2>
              <p>Audit trail of successfully reunited campus items.</p>
            </div>
          </div>

          {reunitedItems.length > 0 ? (
            <div className="archive-list">
              {reunitedItems.map((item) => (
                <div className="archive-card" key={item.id}>
                  <span className={`activity-emoji ${item.color || "mint"}`}>
                    {item.emoji || "📦"}
                  </span>
                  <div className="archive-details">
                    <h4>{item.title}</h4>
                    <span className="archive-meta">
                      {item.category} &middot; Returned at {item.location}
                    </span>
                    <p className="archive-desc">{item.description}</p>
                  </div>
                  <span className="status-pill status-reunited">
                    <CheckCircle2 size={13} /> Reunited 🎉
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-small">
              <HeartHandshake size={32} />
              <h4>No reunited items recorded yet</h4>
              <p>Items marked as reunited will be logged here for university records.</p>
            </div>
          )}

          {/* Rejected Items Audit */}
          {rejectedItems.length > 0 && (
            <div className="rejected-archive-section">
              <h3>Rejected Posts Archive ({rejectedItems.length})</h3>
              <div className="archive-list">
                {rejectedItems.map((item) => (
                  <div className="archive-card rejected-card" key={item.id}>
                    <span className="activity-emoji rose">⚠️</span>
                    <div className="archive-details">
                      <h4>{item.title} (Rejected)</h4>
                      <p className="rejection-reason-text">
                        <strong>Reason:</strong> {item.rejectionReason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Handover Location Modal */}
      {handoverModal && (
        <div className="modal-backdrop" onClick={() => setHandoverModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <ShieldCheck size={20} />
              <h3>Approve Handover for Claim #{handoverModal.id}</h3>
            </div>
            <p className="modal-body-text">
              The ownership claim for <strong>"{handoverModal.itemTitle}"</strong> was verified.
              Specify the safe campus pickup desk where the claimant can present their Student ID:
            </p>

            <label className="field-label" htmlFor="handover-loc-input">
              Campus Handover Location &amp; Instructions:
            </label>
            <input
              id="handover-loc-input"
              className="field"
              value={customHandoverLoc}
              onChange={(e) => setCustomHandoverLoc(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="button button-dark"
                onClick={() => handleApproveHandover(handoverModal)}
              >
                Confirm &amp; Schedule Handover
              </button>
              <button
                className="button button-outline"
                onClick={() => setHandoverModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectItemModal && (
        <div className="modal-backdrop" onClick={() => setRejectItemModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header-danger">
              <AlertTriangle size={20} />
              <h3>Reject Post: "{rejectItemModal.title}"</h3>
            </div>
            <p className="modal-body-text">
              Provide a reason so the student understands why this listing cannot be published:
            </p>

            <label className="field-label" htmlFor="rejection-reason-input">
              Rejection Reason:
            </label>
            <textarea
              id="rejection-reason-input"
              className="field textarea short-textarea"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="button button-danger"
                onClick={() => handleRejectPost(rejectItemModal)}
              >
                Confirm Rejection
              </button>
              <button
                className="button button-outline"
                onClick={() => setRejectItemModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
