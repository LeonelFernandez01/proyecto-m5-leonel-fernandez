import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // 👈 Importamos desde su nueva carpeta hooks!

export function AdminGuard() {
  const { user } = useAuth()

  // Si existe el usuario y su rol en Firestore es 'admin', pasa al formulario.
  // Si es un cliente común o no está logueado, lo saca zumbando al /home.
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/home" replace />
}