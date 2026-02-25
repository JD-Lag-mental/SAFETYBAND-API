import { Navigate } from 'react-router-dom'

export default function RoleRouter() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (!user.role) {
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
}
