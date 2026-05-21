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
      let newItems: CartItem[]

      if (exists) {
        newItems = state.items.map(i =>
          i.product.id === action.payload.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
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
      const newItems = state.items.map(i =>
        i.product.id === action.payload.productId
          ? { ...i, quantity: action.payload.quantity }
          : i
      )
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