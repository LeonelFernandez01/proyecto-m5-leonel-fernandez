import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Activamos el loading apenas detectamos un cambio de estado para evitar parpadeos
      setLoading(true)

      try {
        if (firebaseUser) {
          const docRef = doc(db, 'users', firebaseUser.uid)
          const docSnap = await getDoc(docRef)
          
          if (docSnap.exists()) {
            // Seteamos el usuario completo con su rol (admin o customer)
            setUser(docSnap.data() as User)
          } else {
            // Si el usuario existe en Auth pero no tiene documento en Firestore (caso raro)
            setUser(null)
          }
        } else {
          // Si no hay sesión activa de Firebase
          setUser(null)
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario en Firestore:", error)
        setUser(null)
      } finally {
        // REGLA DE ORO: El loading se apaga SÓLO cuando terminó todo el proceso de arriba
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}