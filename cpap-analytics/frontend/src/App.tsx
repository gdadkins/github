import React, { Suspense, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorBoundary } from './components/ErrorBoundary'
import ClinicalAppShell from './components/clinical/ClinicalAppShell'
import './styles/clinical-design-system.css'

// Lazy load components for better performance
const ClinicalDashboard = React.lazy(() => import('./components/clinical/ClinicalDashboard'))
const EnhancedDashboard = React.lazy(() => import('./components/EnhancedDashboard'))
const ClinicalLogin = React.lazy(() => import('./components/clinical/ClinicalLogin'))

// Auth context
const AuthContext = React.createContext<{
  user: any
  loading: boolean
  setUser: (user: any) => void
}>({ user: null, loading: false, setUser: () => {} })

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      import('./services/api').then(({ api }) => {
        api.getUserProfile()
          .then((profile: any) => {
            setUser(profile.user)
          })
          .catch(() => {
            localStorage.removeItem('access_token')
            setUser(null)
          })
          .finally(() => {
            setLoading(false)
          })
      }).catch(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => React.useContext(AuthContext)

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

// Public Route component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

// Dashboard wrapper with clinical layout
const DashboardWithLayout: React.FC = () => {
  return <ClinicalDashboard />
}

// Enhanced Dashboard wrapper
const EnhancedDashboardWrapper: React.FC = () => {
  const { user, setUser } = useAuth()
  
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }
  
  return <EnhancedDashboard user={user} onLogout={handleLogout} />
}

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <ClinicalLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ClinicalAppShell />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<EnhancedDashboardWrapper />} />
              <Route path="compliance" element={<div>Compliance View</div>} />
              <Route path="analytics" element={<div>Analytics View</div>} />
              <Route path="reports" element={<div>Reports View</div>} />
              <Route path="equipment" element={<div>Equipment View</div>} />
              <Route path="insights" element={<div>AI Insights View</div>} />
              <Route path="profile" element={<div>Profile Settings</div>} />
              <Route path="subscription" element={<div>Subscription Management</div>} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

const AppWithProvider: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithProvider
export { AuthContext, useAuth }