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
      // TODO: Implementar endpoint para obtener estudiantes
      // Por ahora mostramos datos de demostración
      setStudents([
        {
          id: '1',
          name: 'Juan Jr.',
          email: 'juan.jr@example.com',
          balance: 250.50
        },
        {
          id: '2',
          name: 'María',
          email: 'maria@example.com',
          balance: 150.00
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
      // TODO: Implementar endpoint de transferencia
      setTransferAmount('')
      setShowTransfer(false)
      setSelectedStudent(null)
      loadData()
    } catch (err) {
      setError('Error en la transferencia')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-blue-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Padre/Tutor</h1>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Estudiantes</h2>
          
          {students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No tienes estudiantes asignados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{student.email}</p>
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">Saldo Actual</p>
                    <p className="text-2xl font-bold text-blue-600">${student.balance.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(student)
                      setShowTransfer(true)
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    Enviar Dinero
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {showTransfer && selectedStudent && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Enviar Dinero a {selectedStudent.name}</h3>
            <form onSubmit={handleTransfer} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTransfer(false)
                    setSelectedStudent(null)
                    setTransferAmount('')
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Perfil</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Nombre</p>
              <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rol</p>
              <p className="text-lg font-semibold text-gray-800">{user?.role}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
