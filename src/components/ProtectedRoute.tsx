import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '../services/firebase'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'

export function ProtectedRoute() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Escuchamos si el usuario está logueado en Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Validamos con tu mail exacto de administrador
        if (user.email === 'leonelfernandez@example.com' || user.email === 'leonelfernandez@email.com') {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#666' }}>
        <h3>Verificando permisos de administrador...</h3>
        <p>Acuñando credenciales, bancá un cachito.</p>
      </div>
    )
  }

  // Si sos admin te deja pasar al formulario (Outlet), si no, te saca al catálogo ("/")
  return isAdmin ? <Outlet /> : <Navigate to="/" />
}