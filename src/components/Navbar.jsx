import React from "react";
import { HeartHandshake, Bell, Plus, Menu, X, ShieldCheck } from "lucide-react";

export function Navbar({
  page,
  go,
  menuOpen,
  setMenuOpen,
  onOpenNotifications,
  unreadCount,
  pendingAdminCount,
  role,
  currentUser,
  onSignIn,
  onSignOut
}) {
  const navLinks = [
    { name: "Home", page: "Home" },
    { name: "Browse items", page: "Browse items" },
    { name: "How it works", page: "How it works" },
    { name: "My dashboard", page: "My dashboard" },
    { name: "Admin desk", page: "Admin dashboard", adminOnly: true }
  ];

  return (
    <header className="topbar">
      {/* Brand logo */}
      <button className="brand" onClick={() => go("Home")} aria-label="BACK2U home">
        <span className="brand-mark">
          <HeartHandshake size={22} />
        </span>
        <span className="brand-text">
          BACK<span className="brand-accent">2U</span>
          <small>Campus Lost & Found</small>
        </span>
      </button>

      {/* Navigation links */}
      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`} aria-label="Main Navigation">
        {navLinks.filter((item) => !item.adminOnly || role === "admin" || role === "moderator").map((item) => {
          const isActive =
            page === item.page || (item.page === "Browse items" && page === "Details");
          return (
            <button
              key={item.page}
              className={`nav-link ${isActive ? "active" : ""}`}
              onClick={() => go(item.page)}
            >
              {item.name}
              {item.adminOnly && pendingAdminCount > 0 && (
                <span className="nav-admin-badge" title="Pending moderation">
                  {pendingAdminCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="top-actions">
        {/* Notification bell */}
        <button
          className="icon-button notification-btn"
          title="Notifications and updates"
          onClick={onOpenNotifications}
          aria-label="View notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>

        {currentUser ? (
          <button className="button button-outline auth-nav-button" onClick={onSignOut} title={`Signed in as ${currentUser}`}>
            <ShieldCheck size={16} /> <span>Sign out</span>
          </button>
        ) : (
          <button className="button button-outline auth-nav-button" onClick={onSignIn}>
            <ShieldCheck size={16} /> <span>College sign in</span>
          </button>
        )}

        {/* Report an item button */}
        <button className="button button-dark top-report" onClick={() => go("Report")}>
          <Plus size={17} />
          <span>Report an item</span>
        </button>

        {/* Mobile menu hamburger */}
        <button
          className="icon-button mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
