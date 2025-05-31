import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/design-system.css'

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./components/Dashboard'))
const Login = React.lazy(() => import('./components/Login'))

// Simple auth context for demo
const AuthContext = React.createContext<{
  user: any
  loading: boolean
  setUser: (user: any) => void
}>({ user: null, loading: false, setUser: () => {} })

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token')
    if (token) {
      // Verify token by trying to get user profile
      import('./services/api').then(({ api }) => {
        api.getUserProfile()
          .then((profile: any) => {
            setUser(profile.user)
          })
          .catch(() => {
            // Token is invalid, clear it
            localStorage.removeItem('access_token')
            setUser(null)
          })
          .finally(() => {
            setLoading(false)
          })
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

const AppRoutes: React.FC = () => {
  const { user, setUser } = useAuth()
  
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
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard onLogout={() => setUser(null)} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
export { AuthContext, useAuth }
