import { useState, useEffect } from 'react'
import { getProducts, getProductsByCategory } from '../services/productService'
import type { Product } from '../types'

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)
      try {
        const data = category
          ? await getProductsByCategory(category)
          : await getProducts()
        setProducts(data)
      } catch (err) {
        setError('Error al cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  return { products, loading, error }
}