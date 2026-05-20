import { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product, CartItem } from '../types'

// 1. DEFINIMOS LOS TIPOS DE TS PARA EL ESTADO Y LAS ACCIONES
export interface CartState {
  items: CartItem[]
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

// 2. LA FUNCIÓN PURA DEL REDUCER (La que va a probar Vitest)
export function cartReducer(state: CartState, action: CartAction): CartState {
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

// 3. LA INTERFAZ PARA EL CONTEXTO DE REACT
interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// 4. EL COMPONENTE PROVIDER QUE ENVUELVE LA APP
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos el useReducer usando LocalStorage por si ya tenías persistencia
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    const localData = localStorage.getItem('cart')
    return localData ? { items: JSON.parse(localData) } : { items: [] }
  })

  // Guardamos en LocalStorage automáticamente cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  // Funciones puente que despachan (dispatch) las acciones al reducer
  const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: productId })
  const updateQuantity = (productId: string, quantity: number) => 
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// 5. EL CUSTOM HOOK REUTILIZABLE
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}