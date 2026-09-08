
import { useState } from "react";
import apiClient from "../api/apiClient";
import "./AddAsset.css";

function EditAsset({ asset, onAssetUpdated, onCancel }) {

    const [formData, setFormData] = useState({
        assetName: asset.assetName || "",
        assetType: asset.assetType || "SERVER",
        ipAddress: asset.ipAddress || "",
        location: asset.location || "",
        cpuUsage: asset.cpuUsage ?? "",
        memoryUsage: asset.memoryUsage ?? "",
        diskUsage: asset.diskUsage ?? "",
        networkUsage: asset.networkUsage ?? "",
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

            if (value === "") {
                setFormData({
                    ...formData,
                    [name]: value
                });
                return;
            }

            if (!/^\d*(\.\d{0,2})?$/.test(value)) {
                return;
            }

            const number = Number(value);

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

            await apiClient.put(`/api/assets/${asset.id}`, {
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

            setMessage("Asset updated successfully.");

            if (onAssetUpdated) {
                setTimeout(() => {
                    onAssetUpdated();
                }, 500);
            }

        }catch (err) {

            console.error("Failed to update asset:", err);

            const data = err?.response?.data;

            if (data?.errors && typeof data.errors === "object") {
                const firstError = Object.values(data.errors)[0];
                setError(firstError || "Invalid asset details.");
            } else if (data?.error) {
                setError(data.error);
            } else if (data?.message) {
                setError(data.message);
            } else {
                setError("Failed to update asset. Please check the entered details.");
            }
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-asset-card">

            {/* ASSET INFORMATION */}

            <section className="add-asset-section">

                <div className="add-asset-section-header">

                    <h2>Asset information</h2>

                    <p>
                        Update the infrastructure asset information.
                    </p>

                </div>

                <div className="add-asset-form-grid">

                    {/* ASSET NAME */}

                    <div className="form-field">

                        <label htmlFor="assetName">
                            Asset name
                        </label>

                        <input
                            id="assetName"
                            name="assetName"
                            type="text"
                            value={formData.assetName}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* IP ADDRESS */}

                    <div className="form-field">

                        <label htmlFor="ipAddress">
                            IP address
                        </label>

                        <input
                            id="ipAddress"
                            name="ipAddress"
                            type="text"
                            value={formData.ipAddress}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* LOCATION */}

                    <div className="form-field">

                        <label htmlFor="location">
                            Location
                        </label>

                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* ASSET TYPE */}

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


            {/* HEALTH METRICS */}

            <section className="add-asset-section metrics-section">

                <div className="add-asset-section-header">

                    <h2>Health metrics</h2>

                    <p>
                        Update the current usage values for this asset.
                    </p>

                </div>

                <div className="add-asset-form-grid">

                    {/* CPU */}

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
                            value={formData.cpuUsage}
                            onChange={handleChange}
                        />

                    </div>


                    {/* MEMORY */}

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
                            value={formData.memoryUsage}
                            onChange={handleChange}
                        />

                    </div>


                    {/* DISK */}

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
                            value={formData.diskUsage}
                            onChange={handleChange}
                        />

                    </div>


                    {/* NETWORK */}

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
                            value={formData.networkUsage}
                            onChange={handleChange}
                        />

                    </div>

                </div>

            </section>


            {/* MESSAGES */}

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


            {/* FOOTER */}

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
                    type="button"
                    className="add-asset-submit"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : "Save changes"}
                </button>

            </div>

        </div>
    );
}

export default EditAsset;