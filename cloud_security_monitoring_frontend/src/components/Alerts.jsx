import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

const Alerts = () => {

    const { role } = useAuth();

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [assetId, setAssetId] = useState("");
    const [severity, setSeverity] = useState("HIGH");
    const [alertMessage, setAlertMessage] = useState("");

    const canModify =
        role === "ROLE_ADMIN" ||
        role === "ROLE_OPERATOR";


    // ==========================================
    // GET OPEN ALERTS
    // ==========================================

    const loadAlerts = async () => {

        setLoading(true);
        setMessage("");

        try {

            const response =
                await apiClient.get(
                    "/api/alerts/open"
                );

            setAlerts(response.data);

        } catch (error) {

            setMessage(
                error?.response?.status === 403
                    ? "You do not have permission to view alerts."
                    : "Failed to load alerts."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // CREATE ALERT
    // ADMIN + OPERATOR
    // ==========================================

    const createAlert = async (event) => {

        event.preventDefault();

        if (!canModify) {
            setMessage(
                "You do not have permission to create alerts."
            );
            return;
        }

        try {

            await apiClient.post(
                "/api/alerts",
                null,
                {
                    params: {
                        assetId: Number(assetId),
                        severity: severity,
                        message: alertMessage
                    }
                }
            );

            setMessage(
                "Alert created successfully!"
            );

            setAssetId("");
            setAlertMessage("");
            setSeverity("HIGH");

            await loadAlerts();

        } catch (error) {

            setMessage(
                error?.response?.status === 403
                    ? "You do not have permission to create alerts."
                    : "Failed to create alert."
            );
        }
    };


    // ==========================================
    // RESOLVE ALERT
    // ADMIN + OPERATOR
    // ==========================================

    const resolveAlert = async (id) => {

        if (!canModify) {
            setMessage(
                "You do not have permission to resolve alerts."
            );
            return;
        }

        try {

            await apiClient.put(
                `/api/alerts/${id}/resolve`
            );

            setMessage(
                "Alert resolved successfully!"
            );

            await loadAlerts();

        } catch (error) {

            setMessage(
                error?.response?.status === 403
                    ? "You do not have permission to resolve alerts."
                    : "Failed to resolve alert."
            );
        }
    };


    // ==========================================
    // LOAD ALERTS WHEN COMPONENT OPENS
    // ==========================================

    useEffect(() => {

        loadAlerts();

    }, []);


    return (
        <div
            style={{
                marginTop: "30px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px"
            }}
        >

            <h2>Alerts</h2>

            <p>
                Current Role:{" "}
                <strong>{role || "UNKNOWN"}</strong>
            </p>


            {message && (
                <p>{message}</p>
            )}


            {/* ==================================
                CREATE ALERT
                ================================== */}

            {canModify && (

                <form
                    onSubmit={createAlert}
                    style={{
                        marginBottom: "25px",
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "8px"
                    }}
                >

                    <h3>Create Alert</h3>

                    <input
                        type="number"
                        placeholder="Asset ID"
                        value={assetId}
                        onChange={(event) =>
                            setAssetId(event.target.value)
                        }
                        required
                    />

                    <select
                        value={severity}
                        onChange={(event) =>
                            setSeverity(event.target.value)
                        }
                    >
                        <option value="LOW">
                            LOW
                        </option>

                        <option value="MEDIUM">
                            MEDIUM
                        </option>

                        <option value="HIGH">
                            HIGH
                        </option>

                        <option value="CRITICAL">
                            CRITICAL
                        </option>
                    </select>

                    <input
                        type="text"
                        placeholder="Alert message"
                        value={alertMessage}
                        onChange={(event) =>
                            setAlertMessage(
                                event.target.value
                            )
                        }
                        required
                    />

                    <button type="submit">
                        Create Alert
                    </button>

                </form>
            )}


            {/* ==================================
                ALERT LIST
                ================================== */}

            {loading ? (

                <p>Loading alerts...</p>

            ) : alerts.length === 0 ? (

                <p>No open alerts.</p>

            ) : (

                alerts.map((alert) => (

                    <div
                        key={alert.id}
                        style={{
                            padding: "15px",
                            marginBottom: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                        }}
                    >

                        <h3>
                            {alert.severity}
                        </h3>

                        <p>
                            <strong>Asset:</strong>{" "}
                            {alert.assetName ||
                                alert.assetId}
                        </p>

                        <p>
                            <strong>Message:</strong>{" "}
                            {alert.message}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {alert.status}
                        </p>

                        <p>
                            <strong>Created:</strong>{" "}
                            {alert.createdAt}
                        </p>


                        {canModify && (

                            <button
                                onClick={() =>
                                    resolveAlert(
                                        alert.id
                                    )
                                }
                            >
                                Resolve
                            </button>

                        )}

                    </div>

                ))

            )}

        </div>
    );
};

export default Alerts;