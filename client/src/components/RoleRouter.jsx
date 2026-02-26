import { Navigate } from 'react-router-dom'

export default function RoleRouter() {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr || userStr === 'undefined') {
      return <Navigate to="/login" replace />
    }
    
    const user = JSON.parse(userStr)
    
    if (!user || !user.role) {
      return <Navigate to="/login" replace />
    }

    // Redirigir según el rol
    switch (user.role) {
      case 'STUDENT':
        return <Navigate to="/dashboard/student" replace />
      case 'PARENT':
        return <Navigate to="/dashboard/parent" replace />
      case 'ADMIN':
        return <Navigate to="/dashboard/admin" replace />
      default:
        return <Navigate to="/login" replace />
    }
  } catch (error) {
    console.error('Error parsing user:', error)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return <Navigate to="/login" replace />
  }
}
