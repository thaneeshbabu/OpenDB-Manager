import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiUser, 
  FiShield, 
  FiDatabase, 
  FiCamera, 
  FiEdit3, 
  FiKey, 
  FiLogOut, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiActivity, 
  FiCheckCircle, 
  
} from "react-icons/fi";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Recover active user structural context profiles dynamically
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {
    name: "Jonathan Sutherland",
    email: "j.sutherland@opendb.io",
    role: "Admin",
    id: "USR-004829",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Sector 7G, Enterprise Cloud Hub",
    joinedDate: "January 14, 2025",
    loginCount: 142,
    recordsCreated: 1248,
    lastActivity: "Just Now"
  };

  useEffect(() => {
    // Trigger smooth execution tracking for completion indicator logic
    const timer = setTimeout(() => setProfileCompletion(85), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="profile-page-wrapper">
      
      {/* 2. Header Block Element */}
      <header className="profile-view-header">
        <h1>My Profile</h1>
        <p>Manage your account information and secure settings configuration</p>
      </header>

      {/* Structural Master Layout Framework */}
      <div className="profile-layout-grid">
        
        {/* Left Side: 3. Hero Profile Card Column Block */}
        <aside className="glass-panel-card hero-profile-card">
          <div className="avatar-upload-shell">
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundType=gradientLinear`} 
              alt="Profile Avatar" 
              className="avatar-image-frame"
            />
            <button className="avatar-badge-pill" title="Update Profile Photo" onClick={() => alert("Photo upload stream initializing...")}>
              <FiCamera />
            </button>
          </div>

          <div className="profile-identity-info">
            <h2>{user.name}</h2>
            <div className="user-email-meta">{user.email}</div>
            
            {/* 8. Account Badge */}
            <span className="role-badge-chip">
              <FiShield /> {user.role} Account
            </span>
          </div>

          {/* 8. Profile Completion Progress Bar */}
          <div className="completion-progress-block">
            <div className="progress-label-flex">
              <span>Profile Completion</span>
              <span>{profileCompletion}%</span>
            </div>
            <div className="progress-track-rail">
              <div className="progress-fill-bar" style={{ width: `${profileCompletion}%` }}></div>
            </div>
          </div>

          <div className="status-row-indicator">
            <span>Account Status</span>
            <span className="status-active-tag">
              <FiCheckCircle /> Active
            </span>
          </div>
        </aside>

        {/* Right Side: 4. Information Cards Master Area Node */}
        <main className="main-profile-content-area">
          
          {/* Subgrid row wrapper housing individual data segments */}
          <div className="info-cards-subgrid">
            
            {/* Card Node One: Personal Information */}
            <section className="glass-panel-card">
              <div className="section-title-wrapper">
                <FiUser />
                <h3>Personal Information</h3>
              </div>
              <div className="data-attribute-list">
                <div className="data-attribute-item">
                  <span className="attribute-label-text">Full Display Name</span>
                  <span className="attribute-value-text">{user.name}</span>
                </div>
                <div className="data-attribute-item">
                  <span className="attribute-label-text">Communication Email</span>
                  <span className="attribute-value-text">{user.email}</span>
                </div>
                <div className="data-attribute-item">
                  <span className="attribute-label-text">Verified Phone</span>
                  <span className="attribute-value-text">{user.phone || "Not Configured"}</span>
                </div>
                <div className="data-attribute-item">
                  <span className="attribute-label-text">Station Address Location</span>
                  <span className="attribute-value-text">{user.address || "Not Configured"}</span>
                </div>
              </div>
            </section>

            {/* Card Node Two: Account Information */}
            <section className="glass-panel-card">
              <div className="section-title-wrapper">
                <FiShield />
                <h3>Account Configuration</h3>
              </div>
              <div className="data-attribute-list">
                <div className="data-attribute-item">
                  <span className="attribute-label-text">System Assignment Role</span>
                  <span className="attribute-value-text">{user.role}</span>
                </div>
                <div className="data-attribute-item">
                  <span className="attribute-label-text">Unique User UID Identifier</span>
                  <span className="attribute-value-text" style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{user.id || "USR-980124"}</span>
                </div>
                <div className="data-attribute-item">
                  <span className="attribute-label-text">System Deployment Cluster</span>
                  <span className="attribute-value-text">OpenDB-Production-US</span>
                </div>
                <div className="data-attribute-item">
                  <span className="attribute-label-text">Last Log Session Access</span>
                  <span className="attribute-value-text">July 12, 2026 - 19:42 UTC</span>
                </div>
              </div>
            </section>

            {/* Card Node Three: Performance Statistics */}
            <section className="glass-panel-card">
              <div className="section-title-wrapper">
                <FiDatabase />
                <h3>Metrics &amp; Analytics</h3>
              </div>
              <div className="data-attribute-list">
                <div className="data-attribute-item">
                  <span className="attribute-label-text">Total Database Records Created</span>
                  <span className="attribute-value-text">{user.recordsCreated || 0} items</span>
                </div>
                <div className="data-attribute-item">
                  <span className="attribute-label-text">System Authentication Sessions</span>
                  <span className="attribute-value-text">{user.loginCount || 0} verified entries</span>
                </div>
                <div className="data-attribute-item">
                  <span className="attribute-label-text">Active Member Duration Timeline</span>
                  <span className="attribute-value-text">Since {user.joinedDate || "Account Initialization"}</span>
                </div>
              </div>
            </section>

            {/* Card Node Four: 8. Security Status Evaluation Node */}
            <section className="glass-panel-card">
              <div className="section-title-wrapper">
                <FiShield />
                <h3>System Security Assessment</h3>
              </div>
              <div className="security-metric-flex">
                <div className="security-badge-card">
                  <FiCheckCircle />
                  <div>
                    <strong>Two-Factor Authentication Active</strong>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your node endpoint is guarded via hardware authenticator tokens.</p>
                  </div>
                </div>
                <div className="data-attribute-list" style={{ marginTop: '4px' }}>
                  <div className="data-attribute-item">
                    <span className="attribute-label-text">Encryption Standard Key</span>
                    <span className="attribute-value-text">AES-GCM-256 Bit Node</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 8. Recent Activity Historical Stream Section */}
          <section className="glass-panel-card">
            <div className="section-title-wrapper">
              <FiActivity />
              <h3>Recent Audit Operational Logs</h3>
            </div>
            <div className="recent-activity-timeline">
              <div className="timeline-event-row">
                <div className="timeline-icon-box"><FiDatabase /></div>
                <div className="timeline-log-details">
                  <h4>Updated structural database layout context nodes</h4>
                  <p>Applied programmatic alterations to global collection references • 2 hours ago</p>
                </div>
              </div>
              <div className="timeline-event-row">
                <div className="timeline-icon-box"><FiClock /></div>
                <div className="timeline-log-details">
                  <h4>Authenticated secure credentials verification gateway session</h4>
                  <p>Authorized access point token generation via terminal console entry • July 12, 2026 at 19:42</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Action Buttons Toolbar Block Component */}
          <footer className="profile-actions-toolbar">
            <button className="action-btn-node btn-gradient" onClick={() => alert("Profile parameters alteration modal interface stream initialized.")}>
              <FiEdit3 /> Edit Profile Metrics
            </button>
            <button className="action-btn-node btn-secondary" onClick={() => alert("Cryptographic passport transformation framework processing requested.")}>
              <FiKey /> Change Security Password
            </button>
            <button className="action-btn-node btn-danger" onClick={handleLogout}>
              <FiLogOut /> Disconnect Session Lifecycle
            </button>
          </footer>

        </main>
      </div>
    </div>
  );
}

export default Profile;