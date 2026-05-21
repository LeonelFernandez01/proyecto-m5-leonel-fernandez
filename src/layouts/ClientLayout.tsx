import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* La Navbar se muestra fija en todas las pantallas del cliente */}
      <Navbar />
      
      {/* El Outlet es el espacio donde se van a renderizar Home, Cart, etc. */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {/* Si llegás a tener un Footer mañana, lo clavás acá abajo de una */}
    </div>
  )
}