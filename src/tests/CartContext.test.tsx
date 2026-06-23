import { describe, it, expect } from 'vitest'
import { cartReducer } from '../contexts/cartReducer'
import type { Product, CartState } from '../types'


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
    
    const initialState: CartState = { items: [], total: 0 } 
    const action = { type: 'ADD_ITEM' as const, payload: mockProduct }

    const newState = cartReducer(initialState, action)

    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].product.id).toBe('prod-123')
    expect(newState.items[0].quantity).toBe(1)
    expect(newState.total).toBe(15000) // Si querés testear que sume bien
  })

  it('Debería incrementar la cantidad si el producto ya existe en el carrito', () => {
    
    const initialState: CartState = { 
      items: [{ product: mockProduct, quantity: 1 }],
      total: 15000 
    }
    const action = { type: 'ADD_ITEM' as const, payload: mockProduct }

    const newState = cartReducer(initialState, action)

    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].quantity).toBe(2)
    expect(newState.total).toBe(30000)
  })

  it('Debería vaciar el carrito por completo (CLEAR_CART)', () => {
    
    const initialState: CartState = {
      items: [{ product: mockProduct, quantity: 3 }],
      total: 45000
    }
    const action = { type: 'CLEAR_CART' as const }

    const newState = cartReducer(initialState, action)

    expect(newState.items).toHaveLength(0)
    expect(newState.total).toBe(0)
  })
})
