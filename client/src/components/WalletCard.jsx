export default function WalletCard({ balance }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
      <div className="text-sm font-medium opacity-90 mb-2">Balance Actual</div>
      <div className="text-4xl font-bold mb-4">
        ${balance.toFixed(2)}
      </div>
      <div className="text-sm opacity-75">
        Fondos disponibles en tu pulsera NFC
      </div>
    </div>
  )
}
