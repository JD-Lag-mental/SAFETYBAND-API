import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'

export default function ParentDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTransfer, setShowTransfer] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [transferAmount, setTransferAmount] = useState('')

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
      setStudents([
        {
          id: '1',
          name: 'Juan Jr.',
          email: 'juan.jr@example.com',
          balance: 250.50,
          status: 'active'
        },
        {
          id: '2',
          name: 'María',
          email: 'maria@example.com',
          balance: 150.00,
          status: 'active'
        }
      ])
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

  const handleTransfer = async (e) => {
    e.preventDefault()
    try {
      setTransferAmount('')
      setShowTransfer(false)
      setSelectedStudent(null)
      await loadData()
    } catch (err) {
      setError('Error en la transferencia')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-purple-600">Cargando tu panel...</p>
        </div>
      </div>
    )
  }

  const totalStudentBalance = students.reduce((sum, s) => sum + s.balance, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Bienvenido, {user?.name}</h1>
          <p className="text-purple-100">Panel de Padre/Tutor • Gestiona fondos de tus estudiantes</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Saldo Total</h3>
              <span className="text-3xl">💰</span>
            </div>
            <div className="text-5xl font-bold text-purple-600">${totalStudentBalance.toFixed(2)}</div>
            <p className="text-gray-500 text-sm mt-2">Fondos asignados a estudiantes</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-pink-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Estudiantes</h3>
              <span className="text-3xl">👨‍🎓</span>
            </div>
            <div className="text-5xl font-bold text-pink-600">{students.length}</div>
            <p className="text-gray-500 text-sm mt-2">Under your supervision</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Estado</h3>
              <span className="text-3xl">✓</span>
            </div>
            <div className="inline-block mt-3 px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold">
              Sistema Activo
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Estudiantes</h2>
          
          {students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-2">👥</p>
              <p className="text-gray-500 text-lg">No tienes estudiantes asignados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div key={student.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-300 transition transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{student.email}</p>
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Saldo Actual</p>
                    <p className="text-3xl font-bold text-purple-600">${student.balance.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(student)
                      setShowTransfer(true)
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
                  >
                    💳 Enviar Dinero
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transfer Form */}
        {showTransfer && selectedStudent && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-green-500">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Enviar Dinero a {selectedStudent.name}</h3>
            <form onSubmit={handleTransfer} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Monto a Transferir</label>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-lg"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Estudiante:</strong> {selectedStudent.name} • <strong>Saldo Actual:</strong> ${selectedStudent.balance.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
                >
                  ✓ Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTransfer(false)
                    setSelectedStudent(null)
                    setTransferAmount('')
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
                >
                  ✕ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tu Información</h2>
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
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-bold">
                👨‍👩‍👦 Padre/Tutor
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
