import { createContext, useContext, useReducer } from 'react'
import type { CartItem, Product } from '../types'

// Estado del carrito
interface CartState {
  items: CartItem[]
}

// Acciones posibles
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

// Valor del contexto
interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.product.id === action.payload.id)
      if (exists) {
        return {
          items: state.items.map(i =>
            i.product.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
      }
      return { items: [...state.items, { product: action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.product.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(i =>
          i.product.id === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
      }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const total = state.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity, 0
  )

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
      removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId }),
      updateQuantity: (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      total
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}