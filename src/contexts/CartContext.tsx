import { createContext, useContext, useReducer, useEffect } from 'react'
import { cartReducer, initialCartState } from './cartReducer'
import type { Product, CartItem } from '../types'

interface CartContextType {
  items: CartItem[]
  total: number // 👈 Ahora tus componentes pueden leer el total directo de acá
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos leyendo el localStorage mapeando el estado completo
  const [state, dispatch] = useReducer(cartReducer, initialCartState, () => {
    const localData = localStorage.getItem('cart')
    if (localData) {
      const parsedItems = JSON.parse(localData) as CartItem[]
      // Re-calculamos el total por seguridad al iniciar la app
      const total = parsedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: parsedItems, total }
    }
    return initialCartState
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: productId })
  const updateQuantity = (productId: string, quantity: number) => 
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider value={{ items: state.items, total: state.total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}