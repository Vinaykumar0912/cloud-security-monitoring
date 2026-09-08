import { useEffect, useState } from "react";
import "./App.css";

import { useAuth } from "./context/AuthContext.jsx";
import Login from "./components/Login.jsx";
import Alerts from "./components/Alerts.jsx";
import AddAsset from "./components/AddAsset.jsx";
import EditAsset from "./components/EditAsset.jsx";
import apiClient from "./api/apiClient";

interface Asset {
  id: number;
  assetName: string;
  assetType: string;
  ipAddress: string;
  location: string;
  status: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  date: string;
}

interface DashboardSummary {
  totalAssets: number;
  uptimePercentage: number;
  onlineAssets: number;
  offlineAssets: number;
  criticalAlerts: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
}

type Page = "dashboard" | "assets" | "alerts" | "add-asset";

function Icon({
                name,
                size = 18,
              }: {
  name: string;
  size?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    dashboard: (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </>
    ),

    server: (
        <>
          <rect x="3" y="4" width="18" height="6" rx="1.5" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" />
          <path d="M7 7h.01M7 17h.01" />
          <path d="M11 7h7M11 17h7" />
        </>
    ),

    alert: (
        <>
          <path d="M10.3 3.4 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </>
    ),

    plus: (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
    ),

    settings: (
        <>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6.2v-2.6h.2A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h2.6V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14h-.2a1.7 1.7 0 0 0-1.6 1Z" />
        </>
    ),

    logout: (
        <>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M21 19V5a2 2 0 0 0-2-2h-7" />
        </>
    ),

    help: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.7 9a2.4 2.4 0 1 1 4.1 1.7c-.9.9-1.8 1.2-1.8 2.8" />
          <path d="M12 17h.01" />
        </>
    ),

    bell: (
        <>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </>
    ),

    search: (
        <>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </>
    ),

    refresh: (
        <>
          <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
          <path d="M3 4v6h6" />
          <path d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
          <path d="M21 20v-6h-6" />
        </>
    ),

    arrow: (
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>
    ),

    close: (
        <>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </>
    ),
  };

  return (
      <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
      >
        {paths[name] ?? paths.server}
      </svg>
  );
}
function getHealthStatus(cpuUsage: number, memoryUsage: number): string {
    const cpu = Number(cpuUsage) || 0;
    const memory = Number(memoryUsage) || 0;

    if (cpu >= 90) {
        return "CRITICAL";
    }

    if (memory >= 80) {
        return "WARNING";
    }

    return "NORMAL";
}
function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toUpperCase();

  const className =
      normalized === "ONLINE"
          ? "status-badge status-online"
          : normalized === "CRITICAL"
              ? "status-badge status-critical"
              : normalized === "WARNING"
                  ? "status-badge status-warning"
                  : "status-badge status-offline";

  return (
      <span className={className}>
      <span className="status-dot" />
        {status || "Unknown"}
    </span>
  );
}

function MetricBar({
                     label,
                     value,
                     type,
                   }: {
  label: string;
  value: number;
  type: "green" | "blue" | "orange";
}) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
      <div className="metric">
        <div className="metric-top">
          <span>{label}</span>
          <strong>{safeValue.toFixed(2)}%</strong>
        </div>

        <div className="progress">
          <div
              className={`progress-${type}`}
              style={{ width: `${safeValue}%` }}
          />
        </div>
      </div>
  );
}

function App() {
  const { accessToken, logout, role } = useAuth();

  const [page, setPage] = useState<Page>("dashboard");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedAsset, setSelectedAsset] =
      useState<Asset | null>(null);
    const [editingAsset, setEditingAsset] =
        useState<Asset | null>(null);
  const isAdmin =
      role === "ROLE_ADMIN" || role === "ADMIN";

  /* =========================
     LOAD DASHBOARD
  ========================= */

  const loadDashboard = async () => {
    if (!accessToken) return;

    setLoading(true);

    try {
      const [summaryResponse, assetsResponse] =
          await Promise.all([
            apiClient.get("/api/assets/dashboard/summary"),
            apiClient.get("/api/assets"),
          ]);

      setSummary(summaryResponse.data);
      setAssets(assetsResponse.data);
    } catch (error) {
      console.error("Dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD ASSETS
  ========================= */

  const loadAssets = async () => {
    if (!accessToken) return;

    setLoading(true);

    try {
      const response = await apiClient.get("/api/assets");
      setAssets(response.data);
    } catch (error) {
      console.error("Asset loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEARCH + FILTER
  ========================= */

  const searchAssets = async (
      searchValue: string,
      statusValue: string
  ) => {
    if (!accessToken) return;

    setLoading(true);

    try {
      const response = await apiClient.get(
          "/api/assets/search",
          {
            params: {
              search:
                  searchValue.trim() || undefined,
              status:
                  statusValue || undefined,
            },
          }
      );

      setAssets(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

    /* =========================
     DELETE ASSET
  ========================= */

    const deleteAsset = async (asset: Asset) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${asset.assetName}"?\n\nThis will also remove its related alerts.`
        );

        if (!confirmed) return;

        try {
            await apiClient.delete(`/api/assets/${asset.id}`);

            // Close details modal if this asset is currently open
            setSelectedAsset(null);

            // Refresh asset list
            await loadAssets();

            // Refresh dashboard data
            await loadDashboard();

        } catch (error) {
            console.error("Asset deletion failed:", error);

            window.alert(
                "Unable to delete the asset. Please try again."
            );
        }
    };
  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    if (accessToken) {
      loadDashboard();
    }
  }, [accessToken]);

  /* =========================
     NAVIGATION
  ========================= */

  const changePage = (newPage: Page) => {
    setPage(newPage);

    if (newPage === "dashboard") {
      loadDashboard();
    }

    if (newPage === "assets") {
      loadAssets();
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    logout();

    setAssets([]);
    setSummary(null);
    setSelectedAsset(null);
    setPage("dashboard");
  };

  /* =========================
     LOGIN
  ========================= */

  if (!accessToken) {
    return <Login />;
  }

  /* =========================
     PAGE TITLE
  ========================= */

  const pageTitle =
      page === "dashboard"
          ? "Security Dashboard"
          : page === "assets"
              ? "Assets"
              : page === "alerts"
                  ? "Alerts"
                  : "Add Asset";

  return (
      <div className="app">

        {/* ==================================================
          SIDEBAR
      ================================================== */}

        <aside className="sidebar">

          {/* BRAND */}

          <div className="brand">
            <div className="brand-logo">
              CS
            </div>

            <div className="brand-text">
              <h2>Cloud Security</h2>
              <span>Monitoring System</span>
            </div>
          </div>

          {/* WORKSPACE */}

          <div className="sidebar-section">

            <p className="sidebar-title">
              WORKSPACE
            </p>

            <button
                className={
                  page === "dashboard"
                      ? "nav-button active"
                      : "nav-button"
                }
                onClick={() => changePage("dashboard")}
            >
              <Icon name="dashboard" />
              <span>Dashboard</span>
            </button>

            <button
                className={
                  page === "assets"
                      ? "nav-button active"
                      : "nav-button"
                }
                onClick={() => changePage("assets")}
            >
              <Icon name="server" />
              <span>Assets</span>
            </button>

            <button
                className={
                  page === "alerts"
                      ? "nav-button active"
                      : "nav-button"
                }
                onClick={() => changePage("alerts")}
            >
              <Icon name="alert" />
              <span>Alerts</span>
            </button>

          </div>

          {/* ADMINISTRATION */}

          {isAdmin && (
              <div className="sidebar-section">

                <p className="sidebar-title">
                  ADMINISTRATION
                </p>

                <button
                    className={
                      page === "add-asset"
                          ? "nav-button active"
                          : "nav-button"
                    }
                    onClick={() => changePage("add-asset")}
                >
                  <Icon name="plus" />
                  <span>Add Asset</span>
                </button>

              </div>
          )}

          {/* SIDEBAR BOTTOM */}

          <div className="sidebar-bottom">

            <button className="nav-button">
              <Icon name="settings" />
              <span>Settings</span>
            </button>

            <div className="user-card">

              <div className="avatar">
                {isAdmin ? "AD" : "US"}
              </div>

              <div className="user-card-info">
                <strong>
                  {isAdmin ? "admin" : "user"}
                </strong>

                <span>
                {role || "USER"}
              </span>
              </div>

            </div>

            <button
                className="logout-button"
                onClick={handleLogout}
            >
              <Icon name="logout" />
              <span>Log out</span>
            </button>

          </div>

        </aside>

        {/* ==================================================
          MAIN AREA
      ================================================== */}

        <div className="main">

          {/* ==================================================
            HEADER
        ================================================== */}

          <header className="header">

            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-slash">/</span>
              <strong>{pageTitle}</strong>
            </div>

            <div className="header-right">

              <button
                  className="header-icon"
                  title="Help"
              >
                <Icon name="help" size={17} />
              </button>

              <button
                  className="header-icon"
                  title="Notifications"
              >
                <Icon name="bell" size={17} />
              </button>

              <div className="header-user">
                <div className="avatar small">
                  {isAdmin ? "AD" : "US"}
                </div>

                <span>
                {isAdmin ? "admin" : "user"}
              </span>
              </div>

            </div>

          </header>

          {/* ==================================================
            CONTENT
        ================================================== */}

          <main className="content">

            {/* ==================================================
              DASHBOARD
          ================================================== */}

            {page === "dashboard" && (
                <>

                  <div className="page-header">

                    <div>
                      <p className="eyebrow">
                        OVERVIEW
                      </p>

                      <h1>
                        Security Dashboard
                      </h1>

                      <p>
                        Monitor your cloud infrastructure
                        health and security posture.
                      </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={loadDashboard}
                        disabled={loading}
                    >
                      <Icon name="refresh" size={16} />

                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                  </div>

                  {/* SECURITY OVERVIEW */}

                  <section>

                    <div className="section-header">

                      <div>
                        <h2>
                          Security overview
                        </h2>

                        <p>
                          Current status across monitored
                          infrastructure
                        </p>
                      </div>

                      <button
                          className="link-button"
                          onClick={() =>
                              changePage("assets")
                          }
                      >
                        View all assets
                        <Icon name="arrow" size={15} />
                      </button>

                    </div>

                    <div className="summary-grid">

                      <div className="summary-card">

                    <span className="summary-label">
                      TOTAL ASSETS
                    </span>

                        <strong>
                          {summary?.totalAssets ?? 0}
                        </strong>

                        <small>
                          All monitored infrastructure
                        </small>

                      </div>

                      <div className="summary-card">

                    <span className="summary-label">
                      ONLINE ASSETS
                    </span>

                        <strong className="green-text">
                          {summary?.onlineAssets ?? 0}
                        </strong>

                        <small>
                          Currently operational
                        </small>

                      </div>

                      <div className="summary-card">

                    <span className="summary-label">
                      OFFLINE ASSETS
                    </span>

                        <strong>
                          {summary?.offlineAssets ?? 0}
                        </strong>

                        <small>
                          Currently unavailable
                        </small>

                      </div>

                      <div className="summary-card">

                    <span className="summary-label">
                      CRITICAL ALERTS
                    </span>

                        <strong className="red-text">
                          {summary?.criticalAlerts ?? 0}
                        </strong>

                        <small>
                          Requires attention
                        </small>

                      </div>

                    </div>

                  </section>

                  {/* LOWER PANELS */}

                  <div className="dashboard-panels">

                    {/* SYSTEM PERFORMANCE */}

                    <section className="panel">

                      <div className="panel-header">

                        <div>
                          <h2>
                            System performance
                          </h2>

                          <p>
                            Aggregated health metrics
                          </p>
                        </div>

                        <span className="live">
                      <span className="live-dot" />
                      Live
                    </span>

                      </div>

                      <MetricBar
                          label="System uptime"
                          value={
                              summary?.uptimePercentage ?? 0
                          }
                          type="green"
                      />

                      <MetricBar
                          label="Average CPU usage"
                          value={
                              summary?.avgCpuUsage ?? 0
                          }
                          type="blue"
                      />

                      <MetricBar
                          label="Average memory usage"
                          value={
                              summary?.avgMemoryUsage ?? 0
                          }
                          type="orange"
                      />

                    </section>

                    {/* RECENT ACTIVITY */}

                    <section className="panel">

                      <div className="panel-header">

                        <div>
                          <h2>
                            Recent assets
                          </h2>

                          <p>
                            Latest monitored infrastructure
                          </p>
                        </div>

                      </div>

                      <div className="recent-list">

                        {assets
                            .slice(0, 4)
                            .map((asset) => (

                                <div
                                    className="recent-item"
                                    key={asset.id}
                                >

                                  <div className="recent-icon">
                                    <Icon
                                        name="server"
                                        size={17}
                                    />
                                  </div>

                                  <div className="recent-info">

                                    <strong>
                                      {asset.assetName}
                                    </strong>

                                    <span>
                              {asset.assetType} ·{" "}
                                      {asset.location}
                            </span>

                                  </div>

                                  <StatusBadge
                                      status={asset.status}
                                  />

                                </div>

                            ))}

                        {assets.length === 0 && (
                            <div className="empty">
                              No assets available.
                            </div>
                        )}

                      </div>

                    </section>

                  </div>

                </>
            )}

            {/* ==================================================
              ASSETS
          ================================================== */}

            {page === "assets" && (
                <>

                  <div className="page-header">

                    <div>
                      <p className="eyebrow">
                        INFRASTRUCTURE
                      </p>

                      <h1>
                        Assets
                      </h1>

                      <p>
                        Monitor and manage your cloud
                        infrastructure.
                      </p>
                    </div>

                    {isAdmin && (
                        <button
                            className="primary-button"
                            onClick={() =>
                                changePage("add-asset")
                            }
                        >
                          <Icon name="plus" size={17} />
                          Add asset
                        </button>
                    )}

                  </div>

                  {/* TOOLBAR */}

                  <div className="asset-toolbar">

                    <div className="search-box">

                      <Icon
                          name="search"
                          size={18}
                      />

                      <input
                          placeholder="Search assets by name..."
                          value={search}
                          onChange={(e) => {
                            const value =
                                e.target.value;

                            setSearch(value);

                            searchAssets(
                                value,
                                status
                            );
                          }}
                      />

                    </div>

                    <select
                        value={status}
                        onChange={(e) => {
                          const value =
                              e.target.value;

                          setStatus(value);

                          searchAssets(
                              search,
                              value
                          );
                        }}
                    >

                      <option value="">
                        All statuses
                      </option>

                      <option value="ONLINE">
                        Online
                      </option>

                      <option value="OFFLINE">
                        Offline
                      </option>



                    </select>

                    <span className="asset-count">
                  {assets.length} assets
                </span>

                  </div>

                  {/* ASSET TABLE */}

                  <div className="asset-table">

                      <div className="asset-table-header">
                          <span>ASSET</span>
                          <span>LOCATION</span>
                          <span>CPU</span>
                          <span>MEMORY</span>
                          <span>STATUS</span>
                          <span>HEALTH STATUS</span>
                      </div>

                    {loading && (
                        <div className="empty">
                          Loading assets...
                        </div>
                    )}

                    {!loading &&
                        assets.map((asset) => (

                            <div
                                className="asset-table-row"
                                key={asset.id}
                                onClick={() =>
                                    setSelectedAsset(asset)
                                }
                            >

                              <div className="asset-name">

                                <div className="asset-symbol">
                                  <Icon
                                      name="server"
                                      size={18}
                                  />
                                </div>

                                <div>
                                  <strong>
                                    {asset.assetName}
                                  </strong>

                                  <span>
                            {asset.assetType} ·{" "}
                                    {asset.ipAddress}
                          </span>
                                </div>

                              </div>

                              <div className="table-location">
                                {asset.location}
                              </div>

                              <div className="table-value">
                                {Number(
                                    asset.cpuUsage
                                ).toFixed(1)}
                                %
                              </div>

                              <div className="table-value">
                                {Number(
                                    asset.memoryUsage
                                ).toFixed(1)}
                                %
                              </div>

                                <div>
                                    <StatusBadge
                                        status={asset.status}
                                    />
                                </div>

                                <div>
                                    <StatusBadge
                                        status={getHealthStatus(
                                            asset.cpuUsage,
                                            asset.memoryUsage
                                        )}
                                    />
                                </div>

                            </div>

                        ))}

                    {!loading &&
                        assets.length === 0 && (
                            <div className="empty">
                              No matching assets found.
                            </div>
                        )}

                  </div>

                </>
            )}

            {/* ==================================================
              ALERTS
          ================================================== */}

            {page === "alerts" && (
                <>

                  <div className="page-header">

                    <div>
                      <p className="eyebrow">
                        SECURITY
                      </p>

                      <h1>
                        Alerts
                      </h1>

                      <p>
                        Review and manage security alerts.
                      </p>
                    </div>

                  </div>

                  <div className="alerts-container">
                    <Alerts />
                  </div>

                </>
            )}

            {/* ==================================================
              ADD ASSET
          ================================================== */}

            {page === "add-asset" && isAdmin && (
                <>

                  <div className="page-header">

                    <div>
                      <p className="eyebrow">
                        ADMINISTRATION
                      </p>

                      <h1>
                        Add asset
                      </h1>

                      <p>
                        Add a monitored infrastructure
                        asset to the system.
                      </p>
                    </div>

                  </div>

                  <div className="add-asset-container">

                    <AddAsset
                        onAssetAdded={async () => {
                          await loadDashboard();
                          setPage("assets");
                        }}
                        onCancel={() =>
                            setPage("assets")
                        }
                    />

                  </div>

                </>
            )}

          </main>

        </div>



          {/* ==================================================
          ASSET DETAILS MODAL
        ================================================== */}

          {selectedAsset && (
              <div
                  className="modal-overlay"
                  onClick={() => {
                      setSelectedAsset(null);
                      setEditingAsset(null);
                  }}
              >

                  <div
                      className="asset-modal"
                      onClick={(e) => e.stopPropagation()}
                  >

                      {editingAsset ? (

                          /* =========================
                             EDIT ASSET
                          ========================= */

                          <EditAsset
                              asset={editingAsset}

                              onAssetUpdated={async () => {
                                  setEditingAsset(null);
                                  setSelectedAsset(null);
                                  await loadDashboard();
                              }}

                              onCancel={() => {
                                  setEditingAsset(null);
                              }}
                          />

                      ) : (

                          /* =========================
                             ASSET DETAILS
                          ========================= */

                          <>

                              <div className="modal-header">

                                  <div>

                                      <p className="eyebrow">
                                          ASSET DETAILS
                                      </p>

                                      <h2>
                                          {selectedAsset.assetName}
                                      </h2>

                                      <p>
                                          {selectedAsset.assetType} ·{" "}
                                          {selectedAsset.ipAddress}
                                      </p>

                                  </div>

                                  <button
                                      className="modal-close"
                                      onClick={() =>
                                          setSelectedAsset(null)
                                      }
                                  >
                                      <Icon
                                          name="close"
                                          size={18}
                                      />
                                  </button>

                              </div>


                              {/* =========================
                     STATUS
                  ========================= */}

                              <div className="modal-status">

                                  <div className="modal-status-item">

                      <span className="modal-status-label">
                        Status
                      </span>

                                      <StatusBadge
                                          status={selectedAsset.status}
                                      />

                                  </div>


                                  <div className="modal-status-item">

                      <span className="modal-status-label">
                        Health Status
                      </span>

                                      <StatusBadge
                                          status={getHealthStatus(
                                              selectedAsset.cpuUsage,
                                              selectedAsset.memoryUsage
                                          )}
                                      />

                                  </div>

                              </div>


                              {/* =========================
                     ASSET DETAILS
                  ========================= */}

                              <div className="asset-details-grid">

                                  <div className="detail-item">

                      <span>
                        Location
                      </span>

                                      <strong>
                                          {selectedAsset.location}
                                      </strong>

                                  </div>


                                  <div className="detail-item">

                      <span>
                        IP address
                      </span>

                                      <strong>
                                          {selectedAsset.ipAddress}
                                      </strong>

                                  </div>


                                  <div className="detail-item">

                      <span>
                        CPU usage
                      </span>

                                      <strong>
                                          {Number(
                                              selectedAsset.cpuUsage
                                          ).toFixed(2)}
                                          %
                                      </strong>

                                  </div>


                                  <div className="detail-item">

                      <span>
                        Memory usage
                      </span>

                                      <strong>
                                          {Number(
                                              selectedAsset.memoryUsage
                                          ).toFixed(2)}
                                          %
                                      </strong>

                                  </div>


                                  <div className="detail-item">

                      <span>
                        Disk usage
                      </span>

                                      <strong>
                                          {Number(
                                              selectedAsset.diskUsage
                                          ).toFixed(2)}
                                          %
                                      </strong>

                                  </div>


                                  <div className="detail-item">

                      <span>
                        Network usage
                      </span>

                                      <strong>
                                          {Number(
                                              selectedAsset.networkUsage
                                          ).toFixed(2)}
                                          %
                                      </strong>

                                  </div>

                              </div>


                              {/* =========================
                     MODAL FOOTER
                  ========================= */}

                              <div className="modal-footer">

                                  {isAdmin && (
                                      <button
                                          className="secondary-button"
                                          onClick={() =>
                                              setEditingAsset(selectedAsset)
                                          }
                                      >
                                          Edit asset
                                      </button>
                                  )}


                                  {isAdmin && (
                                      <button
                                          className="delete-button"
                                          onClick={() =>
                                              deleteAsset(selectedAsset)
                                          }
                                      >
                                          Delete asset
                                      </button>
                                  )}


                                  <button
                                      className="secondary-button"
                                      onClick={() =>
                                          setSelectedAsset(null)
                                      }
                                  >
                                      Close
                                  </button>

                              </div>

                          </>

                      )}

                  </div>

              </div>
          )}

      </div>
  );
}

export default App;