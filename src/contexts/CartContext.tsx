import { createContext, useReducer, useEffect, useState, useRef } from 'react'
import { cartReducer, initialCartState } from './cartReducer'
import type { Product, CartItem } from '../types'

export interface ToastMessage {
  message: string
  type: 'success' | 'warning' | 'error'
}

interface CartContextType {
  items: CartItem[]
  total: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toast: ToastMessage | null
  showToast: (message: string, type?: 'success' | 'warning' | 'error') => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, () => {
    const localData = localStorage.getItem('cart')
    if (localData) {
      const parsedItems = JSON.parse(localData) as CartItem[]
      const total = parsedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: parsedItems, total }
    }
    return initialCartState
  })

  const [toast, setToast] = useState<ToastMessage | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setToast({ message, type })
    timerRef.current = setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const addItem = (product: Product) => {
    const exists = state.items.find(i => i.product.id === product.id)
    const maxStock = product.stock ?? 0

    if (exists) {
      if (exists.quantity >= maxStock) {
        showToast(`No hay más stock disponible para ${product.name} (Límite: ${maxStock} u.)`, 'warning')
        return
      }
    } else {
      if (maxStock <= 0) {
        showToast(`El producto ${product.name} no cuenta con stock disponible.`, 'error')
        return
      }
    }

    dispatch({ type: 'ADD_ITEM', payload: product })
    showToast(`¡${product.name} agregado al carrito!`, 'success')
  }

  const removeItem = (productId: string) => {
    const item = state.items.find(i => i.product.id === productId)
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
    if (item) {
      showToast(`Se quitó ${item.product.name} del carrito.`, 'warning')
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = state.items.find(i => i.product.id === productId)
    if (item) {
      const maxStock = item.product.stock ?? 0
      if (quantity > maxStock) {
        showToast(`Solo quedan ${maxStock} unidades en stock de ${item.product.name}.`, 'warning')
        return
      }
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    showToast('Se vació el carrito de compras.', 'warning')
  }

  return (
    <CartContext.Provider value={{ 
      items: state.items, 
      total: state.total, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      toast,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  )
}