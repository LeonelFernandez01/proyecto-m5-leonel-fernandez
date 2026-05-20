import { describe, it, expect } from 'vitest'
import { cartReducer } from './CartContext'
import type { Product } from '../types'

const mockProduct: Product = {
  id: 'prod-123',
  name: 'Remera Deportiva',
  description: 'Remera ideal para entrenar',
  price: 15000,
  category: 'indumentaria',
  imageUrl: 'remera.jpg',
  stock: 5,
  createdAt: new Date()
}

describe('Pruebas unitarias sobre cartReducer', () => {

  it('Debería agregar un producto nuevo al carrito (ADD_ITEM)', () => {
    const initialState = { items: [] }
    const action = { type: 'ADD_ITEM' as const, payload: mockProduct }

    const newState = cartReducer(initialState, action)

    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].product.id).toBe('prod-123')
    expect(newState.items[0].quantity).toBe(1)
  })

  it('Debería incrementar la cantidad si el producto ya existe en el carrito', () => {
    const initialState = { 
      items: [{ product: mockProduct, quantity: 1 }] 
    }
    const action = { type: 'ADD_ITEM' as const, payload: mockProduct }

    const newState = cartReducer(initialState, action)

    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].quantity).toBe(2)
  })

  it('Debería vaciar el carrito por completo (CLEAR_CART)', () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 3 }]
    }
    const action = { type: 'CLEAR_CART' as const }

    const newState = cartReducer(initialState, action)

    expect(newState.items).toHaveLength(0)
  })
})