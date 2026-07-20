import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { 
  FiGrid, 
  FiFileText, 
  FiUser, 
  FiLogOut, 
  FiUsers, 
  FiShield, 
  FiEdit, 
  FiPlus, 
  FiRefreshCw, 
  FiActivity 
} from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "Administrator", role: "Super Admin" };
  const location = useLocation();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecords: 0,
    totalAdmins: 0,
    totalEditors: 0,
  });

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getDashboardStats();
      if (data) {
        setStats({
          totalUsers: Number(data.totalUsers || 0),
          totalRecords: Number(data.totalRecords || 0),
          totalAdmins: Number(data.totalAdmins || 0),
          totalEditors: Number(data.totalEditors || 0),
        });
      }
    } catch (error) {
      console.error("Dashboard Metrics Recovery Error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      
      {/* 1. Layout Fixed Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <FiGrid /> OpenDB Manager
        </div>
        <nav className="sidebar-menu">
          <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <FiGrid /> Dashboard
          </Link>
          <Link to="/records" className={`sidebar-link ${location.pathname === '/records' ? 'active' : ''}`}>
            <FiFileText /> Records
          </Link>
          <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
            <FiUser /> Profile
          </Link>
          <button onClick={logout} className="sidebar-link logout-btn">
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>

      <div className="main-wrapper">
        
        {/* 1. Top Navigation Bar */}
        <header className="top-nav">
          <div className="nav-profile">
            <span>{user?.name}</span>
            <div className="avatar-wrapper">
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Admin'}`} 
                alt="User profile avatar" 
                className="avatar-img"
              />
            </div>
          </div>
        </header>

        {/* Main Area View container */}
        <main className="content-body">
          
          {/* 3. Dashboard Header */}
          <div className="dashboard-header">
            <div className="header-title">
              <h1>Dashboard</h1>
              <p>Welcome back, {user?.name} 👋  |  Role: <strong>{user?.role}</strong></p>
            </div>
            <div className="header-meta">
              {currentTime}
            </div>
          </div>

          {/* 4. Premium Statistics Cards */}
          <section className="stats-grid">
            <div className="stat-card users">
              <div className="stat-card-content">
                <div>
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">{stats.totalUsers}</div>
                </div>
                <div className="stat-icon-box"><FiUsers /></div>
              </div>
              <div className="stat-desc">System registered active accounts</div>
            </div>

            <div className="stat-card records">
              <div className="stat-card-content">
                <div>
                  <div className="stat-label">Total Records</div>
                  <div className="stat-value">{stats.totalRecords}</div>
                </div>
                <div className="stat-icon-box"><FiFileText /></div>
              </div>
              <div className="stat-desc">Data sets stored inside OpenDB ecosystem</div>
            </div>

            <div className="stat-card admins">
              <div className="stat-card-content">
                <div>
                  <div className="stat-label">Total Admins</div>
                  <div className="stat-value">{stats.totalAdmins}</div>
                </div>
                <div className="stat-icon-box"><FiShield /></div>
              </div>
              <div className="stat-desc">Privileged global system managers</div>
            </div>

            <div className="stat-card editors">
              <div className="stat-card-content">
                <div>
                  <div className="stat-label">Total Editors</div>
                  <div className="stat-value">{stats.totalEditors}</div>
                </div>
                <div className="stat-icon-box"><FiEdit /></div>
              </div>
              <div className="stat-desc">Content coordinators and writers</div>
            </div>
          </section>

          {/* 6. Extra Widgets Section Grid */}
          <section className="widgets-grid">
            <div className="glass-card">
              <div className="card-title"><FiActivity /> Recent Activity</div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div>
                    <div>New record added by Editor Alpha</div>
                    <div className="activity-time">10 mins ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div>
                    <div>User configuration updated</div>
                    <div className="activity-time">1 hour ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div>
                    <div>Database structural optimization complete</div>
                    <div className="activity-time">4 hours ago</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <div className="card-title">Quick Actions</div>
              <div className="action-group">
                {/* 7. Buttons implementation style */}
                <button className="btn-primary" onClick={() => navigate("/records")}>
                  <FiPlus /> Create New Record
                </button>
                <button className="btn-primary" style={{ background: '#475569', boxShadow: 'none' }} onClick={fetchData}>
                  <FiRefreshCw /> Synchronize API Data
                </button>
              </div>
            </div>

            <div className="glass-card">
              <div className="card-title">System Status</div>
              <div className="status-metrics">
                <div className="status-row">
                  <span>Core Engine API</span>
                  <span className="status-pill">Operational</span>
                </div>
                <div className="status-row">
                  <span>Database Cluster</span>
                  <span className="status-pill">Healthy (99.9%)</span>
                </div>
                <div className="status-row">
                  <span>Memory Load</span>
                  <span className="status-pill" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>24% capacity</span>
                </div>
              </div>
            </div>
          </section>

          {/* Analytics Visual Data Grid */}
          <section className="charts-grid">
            {/* 6. Recent Records Table View */}
            <div className="glass-card">
              <div className="card-title">Recent System Records</div>
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>ID Identifier</th>
                      <th>Data Context Node</th>
                      <th>Class Classification</th>
                      <th>System Status Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#DB-9021</td>
                      <td>Global User Matrix Configuration</td>
                      <td>System Config</td>
                      <td><span className="badge success">Active Verified</span></td>
                    </tr>
                    <tr>
                      <td>#DB-8841</td>
                      <td>Analytical Processing Engine Logs</td>
                      <td>Application Logs</td>
                      <td><span className="badge info">Queued Stream</span></td>
                    </tr>
                    <tr>
                      <td>#DB-7120</td>
                      <td>Transactional History Ledger Schema</td>
                      <td>Financial Core</td>
                      <td><span className="badge success">Active Verified</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Pie and Bar Chart Modules */}
            <div className="glass-card">
              <div className="card-title">Users by Role Breakdown</div>
              <div className="pie-chart-container">
                <div className="pie-mock"></div>
                <div className="pie-legend">
                  <div className="legend-item"><span className="legend-color" style={{background: '#3b82f6'}}></span> Users</div>
                  <div className="legend-item"><span className="legend-color" style={{background: '#8b5cf6'}}></span> Admins</div>
                  <div className="legend-item"><span className="legend-color" style={{background: '#f59e0b'}}></span> Editors</div>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-card">
            <div className="card-title">Records by Category Performance</div>
            <div className="bar-chart-container">
              <div className="bar-wrapper">
                <div className="bar-column" style={{ height: '85%' }}></div>
                <div className="bar-label">System Config</div>
              </div>
              <div className="bar-wrapper">
                <div className="bar-column" style={{ height: '45%' }}></div>
                <div className="bar-label">Application Logs</div>
              </div>
              <div className="bar-wrapper">
                <div className="bar-column" style={{ height: '65%' }}></div>
                <div className="bar-label">Financial Core</div>
              </div>
              <div className="bar-wrapper">
                <div className="bar-column" style={{ height: '25%' }}></div>
                <div className="bar-label">Audit Archives</div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;