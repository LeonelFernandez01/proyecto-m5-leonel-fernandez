import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' 

export function AdminGuard() {
  const { user } = useAuth()

  
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/home" replace />
}