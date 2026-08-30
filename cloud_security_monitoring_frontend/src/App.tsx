import { useState } from 'react'
import './App.css'

import { useAuth } from './context/AuthContext.jsx'
import Login from './components/Login.jsx'
import Alerts from './components/Alerts.jsx'
import apiClient from './api/apiClient'

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

  const { accessToken, logout } = useAuth()

  const [assets, setAssets] = useState<Asset[]>([])
  const [summary, setSummary] =
      useState<DashboardSummary | null>(null)

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)


  // GET DASHBOARD SUMMARY
  const getDashboardSummary = async () => {

    if (!accessToken) {
      setMessage('Please login first')
      return
    }

    try {

      const response = await apiClient.get(
          '/api/assets/dashboard/summary'
      )

      setSummary(response.data)

    } catch (error) {

      setMessage(
          error instanceof Error
              ? error.message
              : 'Failed to load dashboard summary'
      )
    }
  }


  // GET ASSETS
  const getAssets = async () => {

    if (!accessToken) {
      setMessage('Please login first')
      return
    }

    setLoading(true)
    setMessage('')

    try {

      const response = await apiClient.get(
          '/api/assets'
      )

      setAssets(response.data)
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

    logout()

    setAssets([])
    setSummary(null)
    setMessage('Logged out successfully')
  }


  return (
      <div className="app">

        <h1>Cloud Security Monitoring System</h1>

        {!accessToken ? (

            // LOGIN PAGE
            <Login />

        ) : (

            // DASHBOARD
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
                {loading
                    ? 'Loading...'
                    : 'Load Dashboard'}
              </button>


              {/* DASHBOARD SUMMARY */}

              {summary && (

                  <div className="dashboard-summary">

                    <div className="summary-card">
                      <h3>Total Assets</h3>
                      <p>
                        {summary.totalAssets}
                      </p>
                    </div>


                    <div className="summary-card">
                      <h3>Uptime</h3>
                      <p>
                        {Number(
                            summary.uptimePercentage ?? 0
                        ).toFixed(2)}%
                      </p>
                    </div>


                    <div className="summary-card">
                      <h3>Online Assets</h3>
                      <p>
                        {summary.onlineAssets}
                      </p>
                    </div>


                    <div className="summary-card">
                      <h3>Offline Assets</h3>
                      <p>
                        {summary.offlineAssets}
                      </p>
                    </div>


                    <div className="summary-card">
                      <h3>Critical Alerts</h3>
                      <p>
                        {summary.criticalAlerts}
                      </p>
                    </div>


                    <div className="summary-card">
                      <h3>Avg CPU</h3>
                      <p>
                        {Number(
                            summary.avgCpuUsage ?? 0
                        ).toFixed(2)}%
                      </p>
                    </div>


                    <div className="summary-card">
                      <h3>Avg Memory</h3>
                      <p>
                        {Number(
                            summary.avgMemoryUsage ?? 0
                        ).toFixed(2)}%
                      </p>
                    </div>

                  </div>

              )}


              {/* MESSAGE */}

              {message && (
                  <p>{message}</p>
              )}


              {/* ASSETS */}

              {assets.length > 0 && (

                  <div className="assets">

                    <h2>Assets</h2>

                    {assets.map((asset) => (

                        <div
                            className="asset-card"
                            key={asset.id}
                        >

                          <h3>
                            {asset.assetName}
                          </h3>


                          <p>
                            <strong>Type:</strong>{' '}
                            {asset.assetType}
                          </p>


                          <p>
                            <strong>IP:</strong>{' '}
                            {asset.ipAddress}
                          </p>


                          <p>
                            <strong>Location:</strong>{' '}
                            {asset.location}
                          </p>


                          <p>
                            <strong>Status:</strong>{' '}
                            {asset.status}
                          </p>


                          <p>
                            <strong>CPU:</strong>{' '}
                            {asset.cpuUsage}%
                          </p>


                          <p>
                            <strong>Memory:</strong>{' '}
                            {asset.memoryUsage}%
                          </p>


                          <p>
                            <strong>Disk:</strong>{' '}
                            {asset.diskUsage}%
                          </p>


                          <p>
                            <strong>Network:</strong>{' '}
                            {asset.networkUsage}%
                          </p>


                          <p>
                            <strong>Date:</strong>{' '}
                            {asset.date}
                          </p>

                        </div>

                    ))}

                  </div>

              )}
              <Alerts />

            </div>

        )}

      </div>
  )
}

export default App