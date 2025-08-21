import { useEffect, useState } from "react"

export default function RelojTiempoReal() {
  const [fechaHora, setFechaHora] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setFechaHora(new Date())
    }, 1000)

    return () => clearInterval(timer) // limpieza
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
      <p className="text-lg text-gray-700">
        {fechaHora.toLocaleDateString()} {fechaHora.toLocaleTimeString()}
      </p>
    </div>
  )
}
