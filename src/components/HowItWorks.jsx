import React from "react";
import {
  Search,
  KeyRound,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Database,
  Users
} from "lucide-react";

export function HowItWorks({ go }) {
  return (
    <section className="page-wrap how-page">
      <div className="page-intro">
        <div className="eyebrow">DESIGN THINKING &amp; PRIVACY ARCHITECTURE</div>
        <h1>
          Lost it? Find it.
          <br />
          <span>Get it BACK2U.</span>
        </h1>
        <p>
          BACK2U applies Design Thinking principles to solve the chaotic campus lost-and-found problem:
          protecting student privacy while maximizing the chances of safe return.
        </p>
      </div>

      {/* 3 Step Process Cards */}
      <div className="steps-grid large-steps">
        <div className="step-card">
          <span className="step-number">01</span>
          <div className="step-icon step-lilac">
            <Search size={24} />
          </div>
          <h3>1. Search or Report</h3>
          <p>
            Browse the active campus board first. If missing, post a public report with general
            appearance and approximate location. Avoid posting sensitive ID numbers or contact details.
          </p>
        </div>

        <div className="step-card">
          <span className="step-number">02</span>
          <div className="step-icon step-peach">
            <KeyRound size={24} />
          </div>
          <h3>2. Private Clue Verification</h3>
          <p>
            The finder registers a <strong>"Secret Clue"</strong> (e.g. hidden sticker, scratch, or
            contents inside). This is never shown on the public card. Claimants must describe this
            secret to verify genuine ownership!
          </p>
        </div>

        <div className="step-card">
          <span className="step-number">03</span>
          <div className="step-icon step-green">
            <HeartHandshake size={24} />
          </div>
          <h3>3. Supervised Handover</h3>
          <p>
            Once verified by campus moderators, an in-person handover is scheduled at an official
            campus desk (Library Front Desk, Security Office, or Department Office) with Student ID
            verification.
          </p>
        </div>
      </div>

      {/* Design Thinking Methodology Section */}
      <div className="design-thinking-panel">
        <div className="dt-header">
          <Sparkles size={20} />
          <h2>The 5 Stages of Design Thinking in BACK2U</h2>
        </div>
        <div className="dt-stages-grid">
          <div className="dt-stage">
            <span className="dt-number">1. Empathize</span>
            <p>
              Students who lose critical items (laptops, IDs, calculators) experience severe anxiety.
              Finders hesitate to hand items to strangers for fear of dishonest claims.
            </p>
          </div>
          <div className="dt-stage">
            <span className="dt-number">2. Define</span>
            <p>
              Problem Statement: How might we create a campus platform that reunites lost items quickly
              while eliminating false claims and safeguarding personal contact information?
            </p>
          </div>
          <div className="dt-stage">
            <span className="dt-number">3. Ideate</span>
            <p>
              We conceptualized the <strong>Two-Tier Disclosure Model</strong>: Public listing for
              discovery, combined with a Cryptographic/Confidential Secret Clue for proof.
            </p>
          </div>
          <div className="dt-stage">
            <span className="dt-number">4. Prototype</span>
            <p>
              Built this interactive, responsive React application showcasing the student workflow,
              claim verification interface, and campus moderation desk.
            </p>
          </div>
          <div className="dt-stage">
            <span className="dt-number">5. Test &amp; Evolve</span>
            <p>
              Gathered user feedback on clarity, added side-by-side clue verification for moderators,
              and established the roadmap for production database integration.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Real Deployment Roadmap */}
      <div className="safety-panel">
        <div className="safety-symbol">
          <Database size={26} />
        </div>
        <div>
          <h3>Roadmap: Moving from Prototype to Campus Production</h3>
          <p>
            This prototype uses browser memory (<code>localStorage</code>) to demonstrate the user
            journey. In a production university system:
          </p>
          <ul className="roadmap-bullets">
            <li>
              <strong>Campus SSO:</strong> Integration with institutional Single Sign-On (Google
              Workspace for Education or Microsoft 365) to verify student enrollments.
            </li>
            <li>
              <strong>Relational Database:</strong> PostgreSQL/Supabase database storing items, claims,
              and tamper-proof audit trails.
            </li>
            <li>
              <strong>Server-Side Role Authorization:</strong> Restricting the moderation desk to verified
              campus security and administrative staff.
            </li>
            <li>
              <strong>Encrypted Clue Storage:</strong> Finder's secret clue encrypted at rest on the server
              and never sent to the client browser until an authorized moderator requests it.
            </li>
          </ul>
        </div>
      </div>

      <div className="how-cta-row">
        <button className="button button-dark button-large" onClick={() => go("Report")}>
          Report an Item Now <ArrowRight size={17} />
        </button>
        <button className="button button-outline button-large" onClick={() => go("Browse items")}>
          Browse Active Items
        </button>
      </div>
    </section>
  );
}
