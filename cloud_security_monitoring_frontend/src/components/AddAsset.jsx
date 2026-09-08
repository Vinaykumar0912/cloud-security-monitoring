import { useState } from "react";
import apiClient from "../api/apiClient";
import "./AddAsset.css";

function AddAsset({ onAssetAdded, onCancel }) {
    const [formData, setFormData] = useState({
        assetName: "",
        assetType: "SERVER",
        ipAddress: "",
        location: "",
        cpuUsage: "",
        memoryUsage: "",
        diskUsage: "",
        networkUsage: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        const metricFields = [
            "cpuUsage",
            "memoryUsage",
            "diskUsage",
            "networkUsage"
        ];

        if (metricFields.includes(name)) {

            // Allow empty value while editing
            if (value === "") {
                setFormData({
                    ...formData,
                    [name]: value
                });
                return;
            }

            // Allow only numbers with maximum 2 decimal places
            if (!/^\d*(\.\d{0,2})?$/.test(value)) {
                return;
            }

            const number = Number(value);

            // Maximum value is 100
            if (number > 100) {
                setFormData({
                    ...formData,
                    [name]: "100"
                });
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (
            !formData.assetName.trim() ||
            !formData.ipAddress.trim() ||
            !formData.location.trim()
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        const ipAddress = formData.ipAddress.trim();

        const ipv4Pattern =
            /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (!ipv4Pattern.test(ipAddress)) {
            setError("Please enter a valid IPv4 address.");
            return;
        }

        setLoading(true);

        try {
            await apiClient.post("/api/assets", {
                assetName: formData.assetName.trim(),
                assetType: formData.assetType,
                ipAddress: formData.ipAddress.trim(),
                location: formData.location.trim(),
                status: "ONLINE",
                cpuUsage: Number(formData.cpuUsage) || 0,
                memoryUsage: Number(formData.memoryUsage) || 0,
                diskUsage: Number(formData.diskUsage) || 0,
                networkUsage: Number(formData.networkUsage) || 0,
            });

            setMessage("Asset added successfully.");

            setFormData({
                assetName: "",
                assetType: "SERVER",
                ipAddress: "",
                location: "",
                cpuUsage: "",
                memoryUsage: "",
                diskUsage: "",
                networkUsage: "",
            });

            if (onAssetAdded) {
                setTimeout(() => {
                    onAssetAdded();
                }, 500);
            }
        } catch (err) {
            console.error("Failed to add asset:", err);

            const data = err?.response?.data;

            if (data?.errors && typeof data.errors === "object") {
                const firstError = Object.values(data.errors)[0];
                setError(firstError || "Invalid asset details.");
            } else if (data?.message) {
                setError(data.message);
            } else {
                setError("Failed to add asset. Please check the entered details.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-asset-card">
            <section className="add-asset-section">

                <div className="add-asset-section-header">
                    <h2>Asset information</h2>

                    <p>
                        Identify the infrastructure asset you want to
                        monitor.
                    </p>
                </div>

                <div className="add-asset-form-grid">
                    <div className="form-field">
                        <label htmlFor="assetName">
                            Asset name
                        </label>

                        <input
                            id="assetName"
                            name="assetName"
                            type="text"
                            placeholder="e.g. Production Server"
                            value={formData.assetName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="ipAddress">
                            IP address
                        </label>

                        <input
                            id="ipAddress"
                            name="ipAddress"
                            type="text"
                            placeholder="e.g. 192.168.1.10"
                            value={formData.ipAddress}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="location">
                            Location
                        </label>

                        <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="e.g. Bangalore"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="assetType">
                            Asset type
                        </label>

                        <select
                            id="assetType"
                            name="assetType"
                            value={formData.assetType}
                            onChange={handleChange}
                        >
                            <option value="SERVER">
                                Server
                            </option>

                            <option value="DATABASE">
                                Database
                            </option>

                            <option value="NETWORK">
                                Network
                            </option>

                            <option value="APPLICATION">
                                Application
                            </option>

                            <option value="OTHER">
                                Other
                            </option>
                        </select>
                    </div>

                </div>

            </section>

            <section className="add-asset-section metrics-section">

                <div className="add-asset-section-header">
                    <h2>Initial health metrics</h2>

                    <p>
                        Set the current usage values for this asset.
                    </p>
                </div>

                <div className="add-asset-form-grid">

                    <div className="form-field">
                        <label htmlFor="cpuUsage">
                            CPU usage (%)
                        </label>

                        <input
                            id="cpuUsage"
                            name="cpuUsage"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                            value={formData.cpuUsage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="memoryUsage">
                            Memory usage (%)
                        </label>

                        <input
                            id="memoryUsage"
                            name="memoryUsage"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                            value={formData.memoryUsage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="diskUsage">
                            Disk usage (%)
                        </label>

                        <input
                            id="diskUsage"
                            name="diskUsage"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                            value={formData.diskUsage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="networkUsage">
                            Network usage (%)
                        </label>

                        <input
                            id="networkUsage"
                            name="networkUsage"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                            value={formData.networkUsage}
                            onChange={handleChange}
                        />
                    </div>

                </div>

            </section>
            {error && (
                <div className="add-asset-error">
                    {error}
                </div>
            )}

            {message && (
                <div className="add-asset-success">
                    {message}
                </div>
            )}
            <div className="add-asset-footer">

                <button
                    type="button"
                    className="add-asset-cancel"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="add-asset-submit"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    <span className="add-asset-plus">+</span>

                    {loading
                        ? "Adding..."
                        : "Add asset"}
                </button>

            </div>

        </div>
    );
}

export default AddAsset;