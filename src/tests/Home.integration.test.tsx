// @vitest-environment jsdom

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from '../features/products/pages/Home' 
import { CartProvider } from '../contexts/CartContext' 
import { AuthProvider } from '../contexts/AuthContext' 

// ================= 1. MOCKEAMOS FIREBASE COMPLETO =================
vi.mock('firebase/firestore', () => ({
  // Agregamos doc y getDoc para que AuthContext lea el rol del usuario sin romper
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({
    exists: () => true,
    data: () => ({ role: 'customer' }) // Le decimos que es un cliente común
  })),
  getDocs: vi.fn(() => Promise.resolve({
    docs: [
      {
        id: 'prod-123',
        data: () => ({
          name: 'Remera Deportiva',
          description: 'Remera ideal para entrenar',
          price: 15000,
          category: 'indumentaria',
          imageUrl: 'remera.jpg',
          stock: 5,
          createdAt: new Date()
        })
      }
    ]
  })),
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn()
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback({ uid: 'user-123', email: 'test@user.com', displayName: 'Leonel' })
    return () => {}
  })
}))

vi.mock('../config/firebase', () => ({
  db: {},
  auth: {}
}))

// =========================================================================

describe('Pruebas de Integración - Home', () => {
  
  it('Debería renderizar los productos y simular el click de agregar', async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <Home />
        </CartProvider>
      </AuthProvider>
    )

    // Buscamos que aparezca la remera deportiva usando .toBeTruthy() para evitar el error de Chai
    const productTitle = await screen.findByText('Remera Deportiva')
    expect(productTitle).toBeTruthy()

    // Buscamos el botón de agregar
    const addButton = screen.getByRole('button', { name: /agregar/i })
    expect(addButton).toBeTruthy()

    fireEvent.click(addButton)
  })
})