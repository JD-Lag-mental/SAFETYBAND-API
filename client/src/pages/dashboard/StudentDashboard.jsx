import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { walletAPI } from '../../utils/api'
import TransactionsList from '../../components/TransactionsList'
import WalletCard from '../../components/WalletCard'
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <WalletCard balance={balance} />
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowTransfer(!showTransfer)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Realizar Pago
              </button>
              <button
                onClick={loadData}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
              >
                Actualizar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-4">Info Perfil</h3>
            <div className="space-y-2">
              <p className="text-sm"><strong>Nombre:</strong> {user?.name}</p>
              <p className="text-sm"><strong>Email:</strong> {user?.email}</p>
              <p className="text-sm"><strong>Rol:</strong> {user?.role}</p>
            </div>
          </div>
        </div>

        {showTransfer && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Realizar Pago</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Confirmar Pago
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransfer(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <TransactionsList transactions={transactions} />
      </main>
    </div>
  )
}
