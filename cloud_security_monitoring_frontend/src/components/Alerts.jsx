import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "./Alerts.css";

const AlertIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10.3 3.4 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
    </svg>
);

const RefreshIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
        <path d="M3 4v6h6" />
        <path d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
        <path d="M21 20v-6h-6" />
    </svg>
);

const CheckIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m5 12 4 4L19 6" />
    </svg>
);

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [view, setView] = useState("OPEN");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [resolvingId, setResolvingId] = useState(null);

    const loadAlerts = async () => {
        setLoading(true);
        setError("");

        try {
            const endpoint =
                view === "OPEN"
                    ? "/api/alerts/open"
                    : "/api/alerts/history";

            const response = await apiClient.get(endpoint);

            setAlerts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error("Failed to load alerts:", err);
            setError("Unable to load alerts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlerts();
    }, [view]);

    const resolveAlert = async (id) => {
        setResolvingId(id);
        setError("");

        try {
            await apiClient.put(
                `/api/alerts/${id}/resolve`
            );

            await loadAlerts();
        } catch (err) {
            console.error(
                "Failed to resolve alert:",
                err
            );

            setError(
                "Unable to resolve alert."
            );
        } finally {
            setResolvingId(null);
        }
    };



    const filteredAlerts =
        filter === "ALL"
            ? alerts
            : alerts.filter(
                (alert) =>
                    String(
                        alert.severity || ""
                    ).toUpperCase() === filter
            );



    const getSeverityClass = (severity) => {
        const value = String(
            severity || "MEDIUM"
        ).toUpperCase();

        if (value === "CRITICAL") {
            return "critical";
        }

        if (value === "HIGH") {
            return "high";
        }

        if (value === "WARNING") {
            return "warning";
        }

        return "medium";
    };



    const formatDate = (value) => {
        if (!value) {
            return "Recently";
        }

        try {
            return new Date(value).toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
        } catch {
            return value;
        }
    };

    return (
        <div className="alerts-page">



            <div className="alerts-heading">

                <div className="alert-view-tabs">

                    <button
                        className={
                            view === "OPEN"
                                ? "alert-view-tab active"
                                : "alert-view-tab"
                        }
                        onClick={() =>
                            setView("OPEN")
                        }
                    >
                        Open Alerts
                    </button>

                    <button
                        className={
                            view === "HISTORY"
                                ? "alert-view-tab active"
                                : "alert-view-tab"
                        }
                        onClick={() =>
                            setView("HISTORY")
                        }
                    >
                        Alert History
                    </button>

                </div>

                <button
                    className="alerts-refresh"
                    onClick={loadAlerts}
                    disabled={loading}
                >
                    <RefreshIcon />

                    {loading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


            <div className="alert-filters">

                {[
                    "ALL",
                    "CRITICAL",
                    "HIGH",
                    "WARNING",
                    "MEDIUM",
                ].map((item) => (

                    <button
                        key={item}
                        className={
                            filter === item
                                ? "alert-filter active"
                                : "alert-filter"
                        }
                        onClick={() =>
                            setFilter(item)
                        }
                    >
                        {item === "ALL"
                            ? "All"
                            : item}
                    </button>

                ))}

                <span className="alert-count">

                    {filteredAlerts.length}{" "}

                    {view === "OPEN"
                        ? "open"
                        : "resolved"}

                </span>

            </div>




            {error && (
                <div className="alerts-error">
                    {error}
                </div>
            )}


            {loading && (
                <div className="alerts-empty">
                    Loading alerts...
                </div>
            )}




            {!loading &&
                filteredAlerts.length > 0 && (

                    <div className="alert-list">

                        {filteredAlerts.map(
                            (alert) => {

                                const severityClass =
                                    getSeverityClass(
                                        alert.severity
                                    );

                                return (

                                    <div
                                        className={`alert-card ${severityClass}`}
                                        key={alert.id}
                                    >


                                        <div
                                            className={`alert-icon ${severityClass}`}
                                        >
                                            <AlertIcon />
                                        </div>

]

                                        <div className="alert-content">

                                            <div className="alert-top">

                                                <div className="alert-title-area">

                                                    <span
                                                        className={`severity-badge ${severityClass}`}
                                                    >
                                                        {String(
                                                            alert.severity ||
                                                            "MEDIUM"
                                                        ).toUpperCase()}
                                                    </span>

                                                    <h3>
                                                        {alert.title ||
                                                            alert.message ||
                                                            "Security Alert"}
                                                    </h3>

                                                </div>

                                                <span className="alert-time">

                                                    {formatDate(
                                                        alert.createdAt ||
                                                        alert.timestamp ||
                                                        alert.date
                                                    )}

                                                </span>

                                            </div>



                                            <p className="alert-message">

                                                {alert.message ||
                                                    "A security event requires attention."}

                                            </p>

                                            <div className="alert-meta">

                                                {alert.assetName && (
                                                    <span>
                                                        Asset:{" "}

                                                        <strong>
                                                            {
                                                                alert.assetName
                                                            }
                                                        </strong>
                                                    </span>
                                                )}

                                                {alert.assetId && (
                                                    <span>
                                                        Asset ID:{" "}

                                                        {
                                                            alert.assetId
                                                        }
                                                    </span>
                                                )}

                                                {alert.type && (
                                                    <span>
                                                        Type:{" "}

                                                        {
                                                            alert.type
                                                        }
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                        {view === "OPEN" ? (

                                            <button
                                                className="resolve-button"
                                                onClick={() =>
                                                    resolveAlert(
                                                        alert.id
                                                    )
                                                }
                                                disabled={
                                                    resolvingId ===
                                                    alert.id
                                                }
                                            >

                                                {resolvingId ===
                                                alert.id
                                                    ? "Resolving..."
                                                    : "Resolve"}

                                            </button>

                                        ) : (

                                            <div className="resolved-info">

                                                <span className="alert-status-badge">
                                                    RESOLVED
                                                </span>

                                                <span className="resolved-time">
                                                    {formatDate(
                                                        alert.resolvedAt
                                                    )}
                                                </span>

                                            </div>

                                        )}

                                    </div>

                                );
                            }
                        )}

                    </div>

                )}



            {!loading &&
                filteredAlerts.length === 0 && (

                    <div className="alerts-empty">

                        <div className="empty-alert-icon">
                            <CheckIcon />
                        </div>

                        <strong>

                            {view === "OPEN"
                                ? "No open alerts"
                                : "No alert history"}

                        </strong>

                        <span>

                            {view === "OPEN"
                                ? "Your monitored infrastructure currently has no matching security alerts."
                                : "There are no resolved security alerts to display."}

                        </span>

                    </div>

                )}

        </div>
    );
};

export default Alerts;