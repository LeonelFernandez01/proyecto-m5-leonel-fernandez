import { createContext, useReducer, useEffect } from 'react'
import { cartReducer, initialCartState } from './cartReducer'
import type { Product, CartItem } from '../types'

interface CartContextType {
  items: CartItem[]
  total: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

// Lo exportamos para que lo lea el custom hook desde su nueva carpeta
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