import type { CartState, CartAction, CartItem } from '../types'

export const initialCartState: CartState = {
  items: [],
  total: 0
}

// Función pura auxiliar para calcular el precio total del carrito
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.product.id === action.payload.id)
      const maxStock = action.payload.stock ?? 0
      let newItems: CartItem[]

      if (exists) {
        // Enforce stock limit
        if (exists.quantity >= maxStock) {
          return state
        }
        newItems = state.items.map(i =>
          i.product.id === action.payload.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
        if (maxStock <= 0) {
          return state
        }
        newItems = [...state.items, { product: action.payload, quantity: 1 }]
      }

      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(i => i.product.id !== action.payload)
      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(i => {
        if (i.product.id === action.payload.productId) {
          const maxStock = i.product.stock ?? 0
          const validQuantity = Math.min(action.payload.quantity, maxStock)
          return { ...i, quantity: validQuantity }
        }
        return i
      })
      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    }

    case 'CLEAR_CART':
      return initialCartState

    default:
      return state
  }
}