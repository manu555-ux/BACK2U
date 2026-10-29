import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  HeartHandshake,
  Check,
  X,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight
} from "lucide-react";

import { initialItems, initialClaims } from "./data/mockData";
import { DemoBanner } from "./components/DemoBanner";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { Browse } from "./components/Browse";
import { Report } from "./components/Report";
import { Details } from "./components/Details";
import { Dashboard } from "./components/Dashboard";
import { Admin } from "./components/Admin";
import { HowItWorks } from "./components/HowItWorks";
import { NotificationModal } from "./components/NotificationModal";
import { AuthPanel } from "./components/AuthPanel";
import { demoMode, supabase, supabaseConfigured } from "./lib/supabase";

import "./styles.css";

// Helper functions for localStorage persistence
const stripPrivateFields = (item) => {
  const { secret, contact, ...publicItem } = item || {};
  return publicItem;
};

const loadItems = () => {
  try {
    const saved = localStorage.getItem("back2u-items");
    return (saved ? JSON.parse(saved) : initialItems).map(stripPrivateFields);
  } catch {
    return initialItems.map(stripPrivateFields);
  }
};

const loadPrivateDetails = () => {
  const starterPrivate = Object.fromEntries(initialItems
    .filter((item) => item.secret || item.contact)
    .map((item) => [String(item.id), { secret: item.secret || "", contact: item.contact || "" }]));
  try {
    const saved = JSON.parse(localStorage.getItem("back2u-private-details") || "{}");
    const legacyPrivate = Object.fromEntries(JSON.parse(localStorage.getItem("back2u-items") || "[]")
      .filter((item) => item.secret || item.contact)
      .map((item) => [String(item.id), { secret: item.secret || "", contact: item.contact || "" }]));
    return { ...starterPrivate, ...legacyPrivate, ...saved };
  } catch {
    return starterPrivate;
  }
};

const loadClaims = () => {
  try {
    const saved = localStorage.getItem("back2u-claims");
    return saved ? JSON.parse(saved) : initialClaims;
  } catch {
    return initialClaims;
  }
};

const initialNotifications = [
  {
    id: 1,
    title: "Claim Approved for Handover",
    message: "Your ownership verification for 'Navy Blue Ergonomic Backpack' was approved.",
    time: "Today, 1:25 PM",
    type: "success"
  },
  {
    id: 2,
    title: "New Item Spotted",
    message: "A Casio Scientific Calculator was reunited with its student owner in Lab 3.",
    time: "Oct 21, 5:40 PM",
    type: "shield"
  }
];

function App() {
  const [items, setItems] = useState(loadItems);
  const [privateDetails, setPrivateDetails] = useState(loadPrivateDetails);
  const [claims, setClaims] = useState(loadClaims);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("back2u-notifs");
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [page, setPage] = useState("Home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All categories");
  const [role, setRole] = useState("student"); // Profile role: student | moderator | admin
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const pendingPageRef = useRef(null);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Restore genuine Supabase sessions and react to email-link sign-in/sign-out.
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return undefined;
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive || error) return;
      const sessionUser = data?.session?.user;
      if (sessionUser) setUser({ id: sessionUser.id, email: sessionUser.email, demo: false });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!alive) return;
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email, demo: false });
        setAuthOpen(false);
        if (event === "SIGNED_IN") {
          setNotice(`Signed in successfully as ${session.user.email}.`);
          if (pendingPageRef.current) {
            setPage(pendingPageRef.current);
            pendingPageRef.current = null;
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setRole("student");
      }
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  // Frontend-only prototype: demo records are stored in this browser's localStorage.
  useEffect(() => {
    try { localStorage.setItem("back2u-items", JSON.stringify(items)); }
    catch (err) { console.warn("Could not save demo items to localStorage", err); }
  }, [items]);

  useEffect(() => {
    try { localStorage.setItem("back2u-private-details", JSON.stringify(privateDetails)); }
    catch (err) { console.warn("Could not save demo private details", err); }
  }, [privateDetails]);

  useEffect(() => {
    try { localStorage.setItem("back2u-claims", JSON.stringify(claims)); }
    catch (err) { console.warn("Could not save demo claims to localStorage", err); }
  }, [claims]);

  useEffect(() => {
    try { localStorage.setItem("back2u-notifs", JSON.stringify(notifications)); }
    catch (err) { console.warn("Could not save demo notifications", err); }
  }, [notifications]);

  // Page navigation helper. Browsing stays public; reporting, claiming, dashboard, and moderation require sign-in.
  const go = (targetPage, requestedRole = role) => {
    const protectedPages = ["Report", "My dashboard"];
    if (protectedPages.includes(targetPage) && !user) {
      pendingPageRef.current = targetPage;
      setAuthOpen(true);
      setMenuOpen(false);
      return;
    }
    // The prototype role switcher passes the intended role explicitly because
    // React state updates are asynchronous and the old callback can hold a stale role.
    if (targetPage === "Admin dashboard" && !["admin", "moderator"].includes(requestedRole)) {
      setNotice("The campus moderation desk is restricted to authorized staff accounts.");
      return;
    }
    setPage(targetPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open item details helper
  const openItem = (item) => {
    setSelectedItem(item);
    setPage("Details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add a new activity notification
  const addNotification = (title, message, type = "info") => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: "Just now",
      type
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Action: Submit a new item (Lost or Found)
  const handleSubmitItem = (formData) => {
    const { secret, contact, ...publicFormData } = formData;
    const newItem = {
      ...publicFormData,
      id: Date.now(),
      status: "Pending review",
      approved: false,
      date: "Just now",
      owner: "Campus student",
      reporterEmail: user?.email || null,
      reporterId: user?.id || null,
      createdAt: new Date().toISOString()
    };

    setPrivateDetails((prev) => ({ ...prev, [String(newItem.id)]: { secret: secret || "", contact: contact || "" } }));
    setItems((prev) => [stripPrivateFields(newItem), ...prev]);
    setNotice("Your item report was submitted and is now awaiting campus desk moderation.");
    addNotification(
      "Report Submitted",
      `Your report for "${newItem.title}" is queued for campus moderation.`,
      "info"
    );
    setPage("My dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Action: Submit an ownership claim for an item
  const handleSubmitClaim = (item, claimData) => {
    const newClaim = {
      id: Date.now(),
      itemId: item.id,
      itemTitle: item.title,
      claimantName: claimData.name || user?.email || "Verified student",
      claimantContact: user?.email || "",
      claimantId: user?.id || null,
      details: claimData.details,
      answers: Array.isArray(claimData.answers) ? claimData.answers : [],
      status: "Pending review",
      submittedAt: "Just now",
      adminNotes: "",
      handoverLocation: "Campus Security Desk, Block A Ground Floor"
    };

    setClaims((prev) => [newClaim, ...prev]);
    setNotice("Demo claim submitted for campus desk review. This prototype stores data only in this browser.");
    addNotification(
      "Claim Filed",
      `Your verification claim for "${item.title}" is under review.`,
      "shield"
    );
    setPage("My dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Action: Admin approves an item post
  const handleApproveItem = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              approved: true,
              status: i.status === "Pending review" ? "Available" : i.status
            }
          : i
      )
    );
    const item = items.find((i) => i.id === id);
    setNotice(`Item "${item?.title || 'Report'}" approved and published to the community board.`);
    addNotification("Post Published", `"${item?.title || 'Report'}" is now live on the board.`, "success");
  };

  // Action: Admin rejects an item post
  const handleRejectItem = (id, reason) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              approved: false,
              rejectionReason: reason || "Does not comply with campus safety guidelines."
            }
          : i
      )
    );
    const item = items.find((i) => i.id === id);
    setNotice(`Post "${item?.title || 'Report'}" was rejected.`);
    addNotification("Post Rejected", `"${item?.title || 'Report'}" was rejected: ${reason}`, "warning");
  };

  // Action: Admin updates claim status (Approve, Request more info, Reject)
  const handleUpdateClaim = (claimId, newStatus, adminNotes = "", handoverLocation = "") => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: newStatus,
              adminNotes: adminNotes || c.adminNotes,
              handoverLocation: handoverLocation || c.handoverLocation
            }
          : c
      )
    );

    const claim = claims.find((c) => c.id === claimId);

    // If claim was approved for handover, update the corresponding item's status!
    if (newStatus === "Approved for handover" && claim) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === claim.itemId ? { ...i, status: "Handover scheduled" } : i
        )
      );
      addNotification(
        "Handover Scheduled",
        `Handover scheduled for "${claim.itemTitle}" at ${handoverLocation || 'Campus Desk'}.`,
        "success"
      );
      setNotice(`Claim #${claimId} approved for handover.`);
    } else if (newStatus === "Needs more details") {
      addNotification(
        "Follow-Up Requested",
        `Additional details requested for claim on "${claim?.itemTitle}".`,
        "warning"
      );
      setNotice(`Requested more details for claim #${claimId}.`);
    } else {
      setNotice(`Claim #${claimId} status updated to: ${newStatus}.`);
    }
  };

  // Action: Mark an item as successfully reunited
  const handleMarkReunited = (itemId) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: "Reunited" } : i))
    );
    const item = items.find((i) => i.id === itemId);
    setNotice(`Item "${item?.title || 'Item'}" marked as successfully reunited! 🎉`);
    addNotification(
      "Item Reunited 🎉",
      `"${item?.title || 'Item'}" was successfully returned to its owner!`,
      "success"
    );
  };

  // Action: Reset demo state back to default
  const handleResetData = () => {
    localStorage.removeItem("back2u-items");
    localStorage.removeItem("back2u-private-details");
    localStorage.removeItem("back2u-claims");
    localStorage.removeItem("back2u-notifs");
    setItems(initialItems.map(stripPrivateFields));
    setPrivateDetails(loadPrivateDetails());
    setClaims(initialClaims);
    setNotifications(initialNotifications);
    setNotice("Demo data restored to initial campus showcase state.");
    setPage("Home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Counts for pending items and claims
  const pendingItemsCount = items.filter((i) => !i.approved && !i.rejectionReason).length;
  const pendingClaimsCount = claims.filter((c) => c.status === "Pending review").length;

  return (
    <div className="app-shell">
      {/* Top Demo Bar for Reviewers & Evaluators */}
      {demoMode && <DemoBanner
        role={role}
        setRole={setRole}
        onResetData={handleResetData}
        pendingCount={pendingItemsCount}
        pendingClaimsCount={pendingClaimsCount}
        onNavigate={go}
      />}

      {/* Main Top Navigation Bar */}
      <Navbar
        page={page}
        go={go}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
        unreadCount={notifications.length}
        pendingAdminCount={pendingItemsCount + pendingClaimsCount}
        role={role}
        currentUser={user?.email || ""}
        onSignIn={() => { pendingPageRef.current = null; setAuthOpen(true); }}
        onSignOut={async () => {
          if (user?.demo || !supabaseConfigured || !supabase) {
            setUser(null); setRole("student"); setNotice("You have signed out of the demo session.");
            return;
          }
          const { error } = await supabase.auth.signOut();
          if (error) setNotice(`Could not sign out: ${error.message}`);
          else setNotice("You have signed out securely.");
        }}
      />

      {/* Dismissible Notice Alert */}
      {notice && (
        <div className="notice-banner" role="status">
          <div className="notice-content">
            <Check size={16} />
            <span>{notice}</span>
          </div>
          <button
            className="notice-dismiss-btn"
            onClick={() => setNotice("")}
            aria-label="Dismiss notice"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Page Routing */}
      <main id="main-content">
        {page === "Home" && (
          <Home items={items} go={go} openItem={openItem} />
        )}

        {page === "Browse items" && (
          <Browse
            items={items}
            search={search}
            setSearch={setSearch}
            filterType={filterType}
            setFilterType={setFilterType}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            openItem={openItem}
            go={go}
          />
        )}

        {page === "Report" && (
          <Report onSubmit={handleSubmitItem} go={go} />
        )}

        {page === "Details" && selectedItem && (
          <Details
            item={items.find((i) => i.id === selectedItem.id) || selectedItem}
            go={go}
            onClaim={handleSubmitClaim}
            onMarkReunited={handleMarkReunited}
            currentUser={user?.email || "You"}
            currentUserId={user?.id || null}
            isSignedIn={Boolean(user)}
            onRequireAuth={() => { pendingPageRef.current = "Details"; setAuthOpen(true); }}
          />
        )}

        {page === "How it works" && (
          <HowItWorks go={go} />
        )}

        {page === "My dashboard" && (
          <Dashboard
            items={items}
            privateDetails={privateDetails}
            claims={claims}
            go={go}
            openItem={openItem}
            onMarkReunited={handleMarkReunited}
            currentUserId={user?.id || null}
            currentUserEmail={user?.email || null}
          />
        )}

        {page === "Admin dashboard" && ["admin", "moderator"].includes(role) && (
          <Admin
            items={items}
            privateDetails={privateDetails}
            claims={claims}
            approveItem={handleApproveItem}
            rejectItem={handleRejectItem}
            updateClaim={handleUpdateClaim}
            onMarkReunited={handleMarkReunited}
          />
        )}
      </main>

      {authOpen && <AuthPanel
        onClose={() => { setAuthOpen(false); pendingPageRef.current = null; }}
        onSignIn={(email, options = {}) => {
          if (!options.demo) return;
          const demoUser = { id: `demo-${email}`, email, demo: true };
          setUser(demoUser);
          setAuthOpen(false);
          setNotice(`Demo sign-in active for ${email}. Email ownership has not been verified.`);
          if (pendingPageRef.current) { setPage(pendingPageRef.current); pendingPageRef.current = null; }
        }}
      />}

      {/* Notifications Drawer */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
      />

      {/* Modern Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-mark">
              <HeartHandshake size={20} />
            </span>
            <strong>
              BACK<span className="brand-accent">2U</span>
            </strong>
          </div>
          <p className="footer-tagline">Lost it? Find it. Get it BACK2U.</p>
          <div className="footer-links">
            <button type="button" onClick={() => go("Home")}>Home</button>
            <button type="button" onClick={() => go("Browse items")}>Browse Items</button>
            <button type="button" onClick={() => go("Report")}>Report an Item</button>
            <button type="button" onClick={() => go("How it works")}>Design Thinking Model</button>
            <button type="button" onClick={() => go("Admin dashboard")}>
              Campus Admin Desk
              {(pendingItemsCount > 0 || pendingClaimsCount > 0) && (
                <span className="footer-badge">{pendingItemsCount + pendingClaimsCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <small>
            B.Tech Design Thinking Project · Frontend-only prototype · Demo sign-in and question suggestions are simulated; data stays in this browser.
          </small>
        </div>
      </footer>
    </div>
  );
}

// Mount React Root
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
