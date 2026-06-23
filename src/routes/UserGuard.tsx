import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' 

export function UserGuard() {
  const { user } = useAuth()

  
  return user ? <Outlet /> : <Navigate to="/login" replace />
}