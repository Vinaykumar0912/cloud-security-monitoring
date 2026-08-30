import { useState } from "react";
import apiClient from "../api/apiClient";

const AddAsset = ({ onAssetAdded }) => {

    const [formData, setFormData] = useState({
        assetName: "",
        assetType: "SERVER",
        ipAddress: "",
        location: "",
        status: "ONLINE",
        cpuUsage: "",
        memoryUsage: "",
        diskUsage: "",
        networkUsage: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);
        setMessage("");

        try {

            await apiClient.post(
                "/api/assets",
                {
                    assetName: formData.assetName,
                    assetType: formData.assetType,
                    ipAddress: formData.ipAddress,
                    location: formData.location,
                    status: formData.status,
                    cpuUsage: Number(formData.cpuUsage),
                    memoryUsage: Number(formData.memoryUsage),
                    diskUsage: Number(formData.diskUsage),
                    networkUsage: Number(formData.networkUsage)
                }
            );

            setMessage("Asset added successfully!");

            setFormData({
                assetName: "",
                assetType: "SERVER",
                ipAddress: "",
                location: "",
                status: "ONLINE",
                cpuUsage: "",
                memoryUsage: "",
                diskUsage: "",
                networkUsage: ""
            });

            if (onAssetAdded) {
                onAssetAdded();
            }

        } catch (error) {

            if (error?.response?.status === 403) {

                setMessage(
                    "You do not have permission to add assets."
                );

            } else {

                setMessage(
                    "Failed to add asset."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (
        <div
            style={{
                marginTop: "30px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px"
            }}
        >

            <h2>Add Asset</h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="assetName"
                    placeholder="Asset Name"
                    value={formData.assetName}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <select
                    name="assetType"
                    value={formData.assetType}
                    onChange={handleChange}
                >
                    <option value="SERVER">SERVER</option>
                    <option value="DATABASE">DATABASE</option>
                    <option value="NETWORK">NETWORK</option>
                    <option value="CLOUD">CLOUD</option>
                </select>

                <br /><br />

                <input
                    name="ipAddress"
                    placeholder="IP Address"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                </select>

                <br /><br />

                <input
                    type="number"
                    name="cpuUsage"
                    placeholder="CPU Usage %"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.cpuUsage}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="memoryUsage"
                    placeholder="Memory Usage %"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.memoryUsage}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="diskUsage"
                    placeholder="Disk Usage %"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.diskUsage}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="networkUsage"
                    placeholder="Network Usage %"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.networkUsage}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Asset"}
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

        </div>
    );
};

export default AddAsset;