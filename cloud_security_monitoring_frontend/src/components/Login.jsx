import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "./Login.css";

const Login = () => {
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("Please enter your username and password.");
            return;
        }

        setLoading(true);

        try {
            await login(username, password);
        } catch (err) {
            console.error("Login failed:", err);

            if (err?.response?.status === 401) {
                setError("Invalid username or password.");
            } else {
                setError(
                    err?.response?.data?.message ||
                    "Unable to login. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                {/* Logo */}

                <div className="login-brand">

                    <div className="login-logo">
                        CS
                    </div>

                    <div>
                        <h1>Cloud Security</h1>
                        <span>Monitoring System</span>
                    </div>

                </div>


                {/* Login Card */}

                <div className="login-card">

                    <div className="login-heading">

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to access your security dashboard.
                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>

                        {/* Username */}

                        <div className="login-field">

                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                placeholder="Enter your username"
                                autoComplete="username"
                                disabled={loading}
                            />

                        </div>


                        {/* Password */}

                        <div className="login-field">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                            />

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}


                        {/* Login */}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>


                    <div className="login-footer">
                        Secure access · JWT authentication
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;