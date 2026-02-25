import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'

export default function AdminDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalParents: 0,
    totalAdmins: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const mockUsers = [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          role: 'STUDENT',
          createdAt: '2024-01-15',
          status: 'active'
        },
        {
          id: '2',
          name: 'María García',
          email: 'maria@example.com',
          role: 'PARENT',
          createdAt: '2024-01-10',
          status: 'active'
        },
        {
          id: '3',
          name: 'Carlos López',
          email: 'carlos@example.com',
          role: 'ADMIN',
          createdAt: '2024-01-05',
          status: 'active'
        }
      ]
      
      setUsers(mockUsers)
      setStats({
        totalUsers: mockUsers.length,
        totalStudents: mockUsers.filter(u => u.role === 'STUDENT').length,
        totalParents: mockUsers.filter(u => u.role === 'PARENT').length,
        totalAdmins: mockUsers.filter(u => u.role === 'ADMIN').length
      })
    } catch (err) {
      setError('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        setUsers(users.filter(u => u.id !== userId))
      } catch (err) {
        setError('Error eliminando usuario')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-red-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  const getRoleBadge = (role) => {
    switch(role) {
      case 'ADMIN':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: '⚙️', label: 'Administrador' }
      case 'PARENT':
        return { bg: 'bg-purple-100', text: 'text-purple-800', icon: '👨‍👩‍👧', label: 'Padre/Tutor' }
      case 'STUDENT':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: '👨‍🎓', label: 'Estudiante' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '👤', label: role }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Header Card */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-red-100">Bienvenido, {user?.name} • Gestiona el sistema SafetyBand</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Usuarios</h3>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-5xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Estudiantes</h3>
              <span className="text-3xl">👨‍🎓</span>
            </div>
            <p className="text-5xl font-bold text-green-600">{stats.totalStudents}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Padres/Tutores</h3>
              <span className="text-3xl">👨‍👩‍👧</span>
            </div>
            <p className="text-5xl font-bold text-purple-600">{stats.totalParents}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Admin</h3>
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-5xl font-bold text-red-600">{stats.totalAdmins}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
              {users.length} usuarios
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Usuario</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Email</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Rol</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Registro</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Estado</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const badge = getRoleBadge(u.role)
                  return (
                    <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{badge.icon}</span>
                          <span className="font-semibold text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{u.createdAt}</td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          ✓ Activo
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition transform hover:scale-105"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tu Perfil de Administrador</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pb-6 border-b md:border-b-0 md:border-r border-gray-200">
              <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold mb-1">Nombre</p>
              <p className="text-2xl font-bold text-gray-800">{user?.name}</p>
            </div>
            <div className="pb-6 border-b md:border-b-0 md:border-r border-gray-200">
              <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold mb-1">Rol</p>
              <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full font-bold">
                ⚙️ Administrador
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
