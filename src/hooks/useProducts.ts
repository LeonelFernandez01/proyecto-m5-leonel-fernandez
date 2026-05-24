import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Product } from '../types'

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const q = category
      ? query(collection(db, 'products'), where('category', '==', category))
      : query(collection(db, 'products'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]
        setProducts(data)
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setError('Error al cargar los productos')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [category])

  return { products, loading, error }
}