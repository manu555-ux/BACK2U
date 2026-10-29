import React from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  BadgeCheck,
  HeartHandshake,
  Check,
  PackageCheck,
  MapPin,
  Clock,
  Search,
  KeyRound,
  ArrowDownRight
} from "lucide-react";

export function ItemCard({ item, openItem }) {
  const icon = item.emoji || "📦";
  const isFound = item.type === "Found";
  const isReunited = item.status === "Reunited";
  const isHandover = item.status === "Handover scheduled";

  let statusClass = "status-found";
  let statusText = isFound ? "Waiting for owner" : "Still missing";

  if (isReunited) {
    statusClass = "status-reunited";
    statusText = "Reunited 🎉";
  } else if (isHandover) {
    statusClass = "status-handover";
    statusText = "Handover in progress";
  } else if (!isFound) {
    statusClass = "status-lost";
  }

  return (
    <div
      className={`item-card ${isReunited ? "card-reunited" : ""}`}
      onClick={() => openItem(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openItem(item);
        }
      }}
      aria-label={`View details for ${item.title}`}
    >
      <div className={`item-visual ${item.color || "mint"}`}>
        <span className="item-type-badge">
          {item.type === "Found" ? "FOUND ITEM" : "LOST ITEM"}
        </span>

        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="item-card-image" />
        ) : (
          <span className="item-emoji">{icon}</span>
        )}

        <span className="item-date">{item.date}</span>
      </div>

      <div className="item-info">
        <div className="item-category-tag">{item.category}</div>
        <h3 className="item-title">{item.title}</h3>
        <div className="item-location">
          <MapPin size={14} />
          <span>{item.location}</span>
        </div>

        <div className="item-card-bottom">
          <span className={`status-pill ${statusClass}`}>
            <span className="status-dot"></span>
            {statusText}
          </span>
          <span className="card-arrow" aria-hidden="true">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function Home({ items, go, openItem }) {
  const approvedItems = items.filter((i) => i.approved);
  const recentItems = approvedItems.slice(0, 3);
  const reunitedCount = items.filter((i) => i.status === "Reunited").length;

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={14} /> A little campus kindness goes a long way
          </div>
          <h1>
            Lost something?
            <br />
            <span>Let’s bring it</span> BACK2U.
          </h1>
          <p className="hero-description">
            A privacy-first platform designed for university campuses. Report missing items,
            protect secret ownership clues, and reunite belongings safely at supervised campus desks.
          </p>

          <div className="hero-actions">
            <button
              className="button button-dark button-large"
              onClick={() => go("Browse items")}
            >
              Find an item <ArrowRight size={17} />
            </button>
            <button
              className="button button-outline button-large"
              onClick={() => go("Report")}
            >
              Report lost or found <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="trust-row">
            <span>
              <ShieldCheck size={17} /> Privacy-first verification
            </span>
            <span>
              <BadgeCheck size={17} /> Campus moderated
            </span>
            <span>
              <HeartHandshake size={17} /> Safe in-person handover
            </span>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-sun"></div>
          <div className="art-note note-one">
            <span>DESIGN THINKING</span>
            <strong>
              Empathy &amp; Trust
              <br />
              on our campus.
            </strong>
            <HeartHandshake size={24} />
          </div>
          <div className="art-bag">🎒</div>
          <div className="art-note note-two">
            <span className="tiny-check">
              <Check size={13} />
            </span>
            <div>
              <strong>Reunited with owner</strong>
              <small>Verified with private proof.</small>
            </div>
          </div>
          <div className="art-sparkle sparkle-one">✳</div>
          <div className="art-sparkle sparkle-two">✦</div>
          <div className="art-caption">
            CAMPUS LOST &amp; FOUND REIMAGINED <ArrowDownRight size={15} />
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <div>
          <strong>{approvedItems.length.toString().padStart(2, "0")}</strong>
          <span>active listings on the community board</span>
        </div>
        <div>
          <strong>{reunitedCount.toString().padStart(2, "0")}</strong>
          <span>items safely returned to their owners</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>ownership clues hidden from public view</span>
        </div>
        <div className="strip-icon" title="Community Driven">
          <HeartHandshake size={32} />
        </div>
      </section>

      {/* Recently Spotted Feed */}
      <section className="section recent-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE COMMUNITY BOARD</div>
            <h2>Recently spotted on campus</h2>
            <p>Every post is an opportunity to help a fellow student.</p>
          </div>
          <button className="text-link" onClick={() => go("Browse items")}>
            Browse all {approvedItems.length} items <ArrowRight size={16} />
          </button>
        </div>

        <div className="item-grid">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} openItem={openItem} />
          ))}
        </div>
      </section>

      {/* Split CTA */}
      <section className="split-cta">
        <div className="cta-icon">
          <PackageCheck size={26} />
        </div>
        <div>
          <h3>Found something that isn’t yours?</h3>
          <p>
            A quick report could save a classmate days of stress. Keep one distinctive secret clue
            private so the real owner can verify their claim without false disputes.
          </p>
        </div>
        <button className="button button-dark" onClick={() => go("Report")}>
          Make a report <ArrowRight size={16} />
        </button>
      </section>

      {/* Three Step Preview */}
      <section className="section how-preview">
        <div className="section-heading">
          <div>
            <div className="eyebrow">DESIGN THINKING PROCESS</div>
            <h2>Good things happen in three simple steps.</h2>
          </div>
          <button className="text-link" onClick={() => go("How it works")}>
            See the full process <ArrowRight size={16} />
          </button>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <div className="step-icon step-lilac">
              <Search size={22} />
            </div>
            <h3>1. Search or Report</h3>
            <p>
              Check the board first. If not found, post a brief description and the approximate campus
              location.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <div className="step-icon step-peach">
              <KeyRound size={22} />
            </div>
            <h3>2. Verify Privately</h3>
            <p>
              The finder registers a private clue. The claimant describes that secret detail to
              moderators without public exposure.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <div className="step-icon step-green">
              <HeartHandshake size={22} />
            </div>
            <h3>3. Return Safely</h3>
            <p>
              Coordinate an in-person handover at a campus security or department desk with student ID
              verification.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
