import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RoleRouter from './components/RoleRouter'
import ProtectedRoute from './components/ProtectedRoute'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import ParentDashboard from './pages/dashboard/ParentDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-white">SafetyBand</div>
          <div className="text-white text-sm mt-2">Cargando...</div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
        />

        {/* DASHBOARD ROUTER - Redirige según rol */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleRouter />
            </ProtectedRoute>
          }
        />

        {/* RUTAS POR ROL - ESTUDIANTE */}
        <Route 
          path="/dashboard/student" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <StudentDashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />

        {/* RUTAS POR ROL - PADRE/TUTOR */}
        <Route 
          path="/dashboard/parent" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ParentDashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />

        {/* RUTAS POR ROL - ADMINISTRADOR */}
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />

        {/* RUTA POR DEFECTO */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
