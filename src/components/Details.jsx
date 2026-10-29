import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock3,
  CircleHelp,
  CheckCircle2,
  Lock,
  HeartHandshake,
  User,
  Mail,
  FileCheck
} from "lucide-react";

export function Details({ item, go, onClaim, onMarkReunited, currentUser = "You", currentUserId = null, isSignedIn = false, onRequireAuth }) {
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimantName, setClaimantName] = useState("");
  const [claimDetails, setClaimDetails] = useState("");
  const [claimAnswers, setClaimAnswers] = useState({});

  if (!item) {
    return (
      <section className="page-wrap">
        <p>Item not found.</p>
        <button className="button button-outline" onClick={() => go("Browse items")}>
          Back to items
        </button>
      </section>
    );
  }

  const isFound = item.type === "Found";
  const isOwner = (currentUserId && item.reporterId === currentUserId) || (!item.reporterId && item.owner === "You" && currentUser === "You");
  const isReunited = item.status === "Reunited";
  const isHandover = item.status === "Handover scheduled";

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!isFound && claimDetails.trim().length < 10) {
      alert("Please describe where and how you found the item (at least 10 characters).");
      return;
    }

    const questions = Array.isArray(item.verificationQuestions) ? item.verificationQuestions : [];
    if (questions.some((question, index) => !String(claimAnswers[index] || "").trim())) {
      alert("Please answer each item-specific verification question before submitting your claim.");
      return;
    }

    onClaim(item, {
      name: claimantName.trim() || "Verified college student",
      details: claimDetails.trim(),
      answers: questions.map((question, index) => ({ question, answer: String(claimAnswers[index] || "").trim() }))
    });

    setShowClaimForm(false);
  };

  // Determine active step in the lifecycle timeline
  let activeStep = 2; // Default: Approved & Posted
  if (isReunited) activeStep = 5;
  else if (isHandover) activeStep = 4;

  return (
    <section className="page-wrap details-wrap">
      {/* Back button */}
      <button className="back-link" onClick={() => go("Browse items")}>
        <ArrowLeft size={16} /> Back to community board
      </button>

      <div className="details-grid">
        {/* Left Side: Visual Representation */}
        <div className={`details-art ${item.color || "mint"}`}>
          <span className="item-type-badge">
            {item.type === "Found" ? "FOUND ITEM" : "LOST ITEM"}
          </span>

          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="details-card-image" />
          ) : (
            <span className="details-emoji">{item.emoji || "📦"}</span>
          )}

          <div className="art-bottom">
            <span>
              <ShieldCheck size={15} /> Privacy-Shielded Card
            </span>
            <span>{item.date}</span>
          </div>
        </div>

        {/* Right Side: Copy & Actions */}
        <div className="details-copy">
          <div className="details-meta-top">
            <span className="item-category-tag">{item.category}</span>
            <span className="item-reporter-tag">Reported by: {isOwner ? "You" : "Campus community"}</span>
          </div>

          <h1>{item.title}</h1>

          <div className="detail-location">
            <span className="location-item">
              <MapPin size={16} />
              <strong>Location:</strong> {item.location}
            </span>
            <span className="location-sep">&bull;</span>
            <span className="location-item">
              <Clock3 size={16} />
              <strong>Spotted:</strong> {item.date}
            </span>
          </div>

          {/* Status Timeline Stepper */}
          <div className="timeline-container">
            <div className="timeline-label">Return Lifecycle Progress:</div>
            <div className="stepper">
              <div className={`step-node ${activeStep >= 1 ? "step-done" : ""}`}>
                <span className="step-circle">1</span>
                <span className="step-text">Reported</span>
              </div>
              <div className={`step-line ${activeStep >= 2 ? "line-done" : ""}`}></div>

              <div className={`step-node ${activeStep >= 2 ? "step-done" : ""}`}>
                <span className="step-circle">2</span>
                <span className="step-text">Moderated</span>
              </div>
              <div className={`step-line ${activeStep >= 3 ? "line-done" : ""}`}></div>

              <div className={`step-node ${activeStep >= 4 ? "step-done" : ""}`}>
                <span className="step-circle">3</span>
                <span className="step-text">Verified</span>
              </div>
              <div className={`step-line ${activeStep >= 5 ? "line-done" : ""}`}></div>

              <div className={`step-node ${activeStep >= 5 ? "step-done" : ""}`}>
                <span className="step-circle">4</span>
                <span className="step-text">Reunited</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="details-description-box">
            <h3>Public Description</h3>
            <p>{item.description}</p>
          </div>

          {/* Privacy Note */}
          <div className="detail-safety">
            <Lock size={20} />
            <div>
              <strong>Distinctive details are kept secret</strong>
              <p>
                To prevent fraudulent claims, the finder's private clues are hidden from this public page.
                To claim this item, describe distinctive features in the private verification form below.
              </p>
            </div>
          </div>

          {/* If the current student reported this item */}
          {isOwner && (
            <div className="owner-banner">
              <User size={18} />
              <div>
                <strong>You reported this item</strong>
                <p>Track claims for this item in your Dashboard.</p>
              </div>
              {!isReunited && (
                <button
                  type="button"
                  className="button button-small button-outline"
                  onClick={() => onMarkReunited(item.id)}
                >
                  <CheckCircle2 size={14} /> Mark as Reunited
                </button>
              )}
            </div>
          )}

          {/* If the item is already returned */}
          {isReunited ? (
            <div className="reunited-celebration">
              <HeartHandshake size={24} />
              <div>
                <strong>Successfully Reunited!</strong>
                <p>This item has already been returned to its verified campus owner.</p>
              </div>
            </div>
          ) : !showClaimForm ? (
            /* Button to open Claim Form */
            <div className="claim-action-wrap">
              <button
                className="button button-dark button-large"
                onClick={() => { if (!isSignedIn) { onRequireAuth?.(); return; } setShowClaimForm(true); }}
              >
                {isFound ? "I think this belongs to me" : "I found this item"} <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            /* Ownership Verification Form */
            <form className="claim-form" onSubmit={handleClaimSubmit}>
              <div className="claim-form-header">
                <FileCheck size={20} />
                <div>
                  <h3>{isFound ? "Verify Ownership Proof" : "Report You Found This"}</h3>
                  <p>
                    Submitted details are routed directly to the Campus Moderation Desk.
                  </p>
                </div>
              </div>

              <div className="claim-inputs-grid">
                <div>
                  <label className="field-label" htmlFor="claimant-name">
                    Your Full Name *
                  </label>
                  <input
                    id="claimant-name"
                    className="field"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="claimant-contact">
                    Email verified
                  </label>
                  <input
                    id="claimant-contact"
                    className="field"
                    type="email"
                    required
                    readOnly
                    value={currentUser}
                  />
                </div>
              </div>

              {Array.isArray(item.verificationQuestions) && item.verificationQuestions.length > 0 && (
                <div className="claim-verification-questions">
                  <div className="claim-verification-title">
                    <ShieldCheck size={17} />
                    <div>
                      <strong>Item-specific verification</strong>
                      <p>Answer the questions set by the reporter. These answers are private and reviewed by authorized staff.</p>
                    </div>
                  </div>
                  {item.verificationQuestions.map((question, index) => (
                    <div key={`${index}-${question}`}>
                      <label className="field-label" htmlFor={`claim-answer-${index}`}>{index + 1}. {question}</label>
                      <textarea
                        id={`claim-answer-${index}`}
                        className="field textarea short-textarea"
                        required
                        maxLength={1000}
                        value={claimAnswers[index] || ""}
                        onChange={(event) => setClaimAnswers((current) => ({ ...current, [index]: event.target.value }))}
                        placeholder="Write the detail you remember..."
                      />
                    </div>
                  ))}
                </div>
              )}

              <label className="field-label" htmlFor="claim-proof">
                {isFound
                  ? "Any additional proof of ownership (optional)"
                  : "Where and how did you find it? *"}
              </label>
              <textarea
                id="claim-proof"
                className="field textarea"
                required={!isFound}
                minLength={isFound ? undefined : 10}
                maxLength={500}
                value={claimDetails}
                onChange={(e) => setClaimDetails(e.target.value)}
                placeholder={
                  isFound
                    ? "Describe unique stickers, hidden scratches, specific items inside, wallpapers, or passwords that only the real owner knows..."
                    : "Describe where it was picked up and which campus desk it can be handed into..."
                }
              />

              <div className="claim-form-buttons">
                <button className="button button-dark" type="submit">
                  Submit Private Verification <ArrowRight size={16} />
                </button>
                <button
                  className="button button-outline"
                  type="button"
                  onClick={() => setShowClaimForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <p className="detail-footnote">
            <CircleHelp size={14} /> Reminder: Never send money or arrange meetings in isolated off-campus areas.
          </p>
        </div>
      </div>
    </section>
  );
}
