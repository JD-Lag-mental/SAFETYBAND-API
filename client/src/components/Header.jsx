export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">SafetyBand</h1>
          <p className="text-gray-600 text-sm">Sistema de Pago Digital NFC</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Bienvenido</p>
            <p className="font-medium text-gray-800">{user?.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  )
}
