import { describe, it, expect } from 'vitest'
import { cartReducer } from '../contexts/cartReducer'
import type { Product, CartState } from '../types'


const mockProduct: Product = {
  id: 'prod-123',
  name: 'Remera Deportiva',
  description: 'Remera ideal para entrenar',
  price: 15000,
  category: 'indumentaria',
  imageUrl: 'remera.jpg', // 👈 Limpiada la "i" que estaba colgada acá
  stock: 5,
  createdAt: new Date()
}

describe('Pruebas unitarias sobre cartReducer', () => {

  it('Debería agregar un producto nuevo al carrito (ADD_ITEM)', () => {
    // 👈 Agregamos total: 0 para cumplir con CartState
    const initialState: CartState = { items: [], total: 0 } 
    const action = { type: 'ADD_ITEM' as const, payload: mockProduct }

    const newState = cartReducer(initialState, action)

    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].product.id).toBe('prod-123')
    expect(newState.items[0].quantity).toBe(1)
    expect(newState.total).toBe(15000) // Si querés testear que sume bien
  })

  it('Debería incrementar la cantidad si el producto ya existe en el carrito', () => {
    // 👈 Agregamos total: 15000 reflejando el producto que ya está adentro
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
    // 👈 Agregamos total: 45000 reflejando los 3 productos
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
