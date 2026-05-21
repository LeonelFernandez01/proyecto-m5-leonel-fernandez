import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // 👈 Importamos desde su nueva carpeta hooks!

export function UserGuard() {
  const { user } = useAuth()

  // Si no hay usuario de ningún tipo, al login de cabeza
  return user ? <Outlet /> : <Navigate to="/login" replace />
}