import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TransactionsList({ transactions }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Historial de Transacciones</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay transacciones aún</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Monto</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tx.type === 'CREDIT' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.type === 'CREDIT' ? '✓ Ingreso' : '✗ Gasto'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {tx.createdAt ? 
                      formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true, locale: es })
                      : 'Hace poco'
                    }
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Completado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
