import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { walletAPI } from '../../utils/api'
import Header from '../../components/Header'

export default function StudentDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTransfer, setShowTransfer] = useState(false)
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
      const [balanceRes, transRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getTransactions()
      ])
      setBalance(balanceRes.data.balance || 0)
      setTransactions(transRes.data.transactions || [])
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
      await walletAPI.transfer({
        amount: parseFloat(transferAmount),
        type: 'DEBIT'
      })
      setTransferAmount('')
      setShowTransfer(false)
      await loadData()
    } catch (err) {
      setError('Error en la transferencia')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-blue-600">Cargando tu panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Bienvenido, {user?.name}</h1>
          <p className="text-blue-100">Panel de Estudiante • Sistema SafetyBand</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Tu Balance</h3>
              <span className="text-3xl">💳</span>
            </div>
            <div className="text-5xl font-bold text-blue-600 mb-2">${balance.toFixed(2)}</div>
            <p className="text-gray-500 text-sm">Fondos disponibles en tu pulsera NFC</p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 border border-blue-200">
              ✓ Tu pulsera está sincronizada y lista para usar
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-gray-700 font-bold mb-4 text-lg">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowTransfer(!showTransfer)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
              >
                💰 Realizar Pago
              </button>
              <button
                onClick={loadData}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
              >
                🔄 Actualizar Datos
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-gray-700 font-bold mb-4 text-lg">Tu Perfil</h3>
            <div className="space-y-3">
              <div className="pb-3 border-b border-gray-200">
                <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Nombre</p>
                <p className="text-gray-800 font-semibold">{user?.name}</p>
              </div>
              <div className="pb-3 border-b border-gray-200">
                <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Email</p>
                <p className="text-gray-800 font-semibold text-sm">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Rol</p>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                  👨‍🎓 Estudiante
                </span>
              </div>
            </div>
          </div>
        </div>

        {showTransfer && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-green-500">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Realizar Pago</h3>
            <form onSubmit={handleTransfer} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Monto a Pagar</label>
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
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
                >
                  ✓ Confirmar Pago
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransfer(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
                >
                  ✕ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Últimas Transacciones</h3>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-2">📊</p>
              <p className="text-gray-500 text-lg">No hay transacciones aún</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.slice(0, 10).map((tx, idx) => (
                <div key={tx.id} className="flex justify-between items-center p-4 hover:bg-gray-50 border border-gray-200 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tx.type === 'CREDIT' ? '🔵' : '🔴'}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{tx.type === 'CREDIT' ? 'Ingreso' : 'Gasto'}</p>
                      <p className="text-sm text-gray-500">Transacción #{idx + 1}</p>
                    </div>
                  </div>
                  <span className={`text-xl font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
