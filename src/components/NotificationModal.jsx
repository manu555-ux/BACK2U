import React from "react";
import { X, Bell, CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";

export function NotificationModal({ isOpen, onClose, notifications, onClear }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="notification-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Bell size={18} />
            <h3>Campus Activity & Alerts</h3>
            {notifications.length > 0 && (
              <span className="notif-count-pill">{notifications.length}</span>
            )}
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close notifications">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {notifications.length === 0 ? (
            <div className="drawer-empty">
              <CheckCircle2 size={36} />
              <h4>You're all caught up!</h4>
              <p>No new activity yet. Actions like reporting items or claim status updates will appear here.</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((n) => (
                <div key={n.id} className={`notification-item notif-${n.type || "info"}`}>
                  <div className="notif-icon">
                    {n.type === "success" && <CheckCircle2 size={16} />}
                    {n.type === "warning" && <AlertCircle size={16} />}
                    {n.type === "shield" && <ShieldCheck size={16} />}
                    {!["success", "warning", "shield"].includes(n.type) && <Clock size={16} />}
                  </div>
                  <div className="notif-content">
                    <p className="notif-title">{n.title}</p>
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="drawer-footer">
            <button className="button button-outline button-small" onClick={onClear}>
              Clear notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
