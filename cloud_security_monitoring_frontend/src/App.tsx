import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080'

interface Asset {
  id: number
  assetName: string
  assetType: string
  ipAddress: string
  location: string
  status: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkUsage: number
  date: string
}
interface DashboardSummary {
  totalAssets: number
  uptimePercentage: number
  onlineAssets: number
  offlineAssets: number
  criticalAlerts: number
  avgCpuUsage: number
  avgMemoryUsage: number
}

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(
      localStorage.getItem('jwtToken')
  )

  const [assets, setAssets] = useState<Asset[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // LOGIN
  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid username or password')
      }

      const data = await response.json()

      // Save JWT token
      localStorage.setItem('jwtToken', data.token)
      setToken(data.token)

      setMessage('Login successful!')
    } catch (error) {
      setMessage(
          error instanceof Error ? error.message : 'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  // GET DASHBOARD SUMMARY
  const getDashboardSummary = async () => {
    const jwtToken = localStorage.getItem('jwtToken')

    if (!jwtToken) {
      setMessage('Please login first')
      return
    }

    try {
      const response = await fetch(
          `${API_URL}/api/assets/dashboard/summary`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }
      )

      if (!response.ok) {
        throw new Error(`Dashboard request failed: ${response.status}`)
      }

      const data = await response.json()

      setSummary(data)
    } catch (error) {
      setMessage(
          error instanceof Error
              ? error.message
              : 'Failed to load dashboard summary'
      )
    }
  }

  // GET ASSETS USING JWT
  const getAssets = async () => {
    const jwtToken = localStorage.getItem('jwtToken')

    if (!jwtToken) {
      setMessage('Please login first')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/api/assets`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const data = await response.json()

      setAssets(data)
      setMessage('Assets loaded successfully!')
    } catch (error) {
      setMessage(
          error instanceof Error
              ? error.message
              : 'Failed to load assets'
      )
    } finally {
      setLoading(false)
    }
  }

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    setToken(null)
    setAssets([])
    setMessage('Logged out successfully')
  }

  return (
      <div className="app">
        <h1>Cloud Security Monitoring System</h1>

        {!token ? (
            <div className="login-card">
              <h2>Login</h2>

              <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />

              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />

              <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {message && <p>{message}</p>}
            </div>
        ) : (
            <div className="dashboard">
              <div className="top-bar">
                <h2>Security Dashboard</h2>

                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>

              <p>JWT authentication is active.</p>

              <button
                  onClick={async () => {
                    setLoading(true)
                    await Promise.all([
                      getAssets(),
                      getDashboardSummary()
                    ])
                    setLoading(false)
                  }}
                  disabled={loading}
              >
                {loading ? 'Loading...' : 'Load Dashboard'}
              </button>

              {summary && (
                  <div className="dashboard-summary">

                    <div className="summary-card">
                      <h3>Total Assets</h3>
                      <p>{summary.totalAssets}</p>
                    </div>

                    <div className="summary-card">
                      <h3>Uptime</h3>
                      <p>{Number(summary.uptimePercentage ?? 0).toFixed(2)}%</p>
                    </div>

                    <div className="summary-card">
                      <h3>Online Assets</h3>
                      <p>{summary.onlineAssets}</p>
                    </div>

                    <div className="summary-card">
                      <h3>Offline Assets</h3>
                      <p>{summary.offlineAssets}</p>
                    </div>

                    <div className="summary-card">
                      <h3>Critical Alerts</h3>
                      <p>{summary.criticalAlerts}</p>
                    </div>

                    <div className="summary-card">
                      <h3>Avg CPU</h3>
                      <p>{Number(summary.avgCpuUsage ?? 0).toFixed(2)}%</p>
                    </div>

                    <div className="summary-card">
                      <h3>Avg Memory</h3>
                      <p>{Number(summary.avgMemoryUsage ?? 0).toFixed(2)}%</p>
                    </div>

                  </div>
              )}

              {message && <p>{message}</p>}

              {assets.length > 0 && (
                  <div className="assets">
                    <h2>Assets</h2>

                    {assets.map((asset) => (
                        <div className="asset-card" key={asset.id}>
                          <h3>{asset.assetName}</h3>

                          <p>
                            <strong>Type:</strong> {asset.assetType}
                          </p>

                          <p>
                            <strong>IP:</strong> {asset.ipAddress}
                          </p>

                          <p>
                            <strong>Location:</strong> {asset.location}
                          </p>

                          <p>
                            <strong>Status:</strong> {asset.status}
                          </p>

                          <p>
                            <strong>CPU:</strong> {asset.cpuUsage}%
                          </p>

                          <p>
                            <strong>Memory:</strong> {asset.memoryUsage}%
                          </p>

                          <p>
                            <strong>Disk:</strong> {asset.diskUsage}%
                          </p>

                          <p>
                            <strong>Network:</strong> {asset.networkUsage}%
                          </p>

                          <p>
                            <strong>Date:</strong> {asset.date}
                          </p>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}
      </div>
  )
}

export default App