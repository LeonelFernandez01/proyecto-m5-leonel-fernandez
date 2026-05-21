// Usuario
export interface User {
  uid: string
  email: string
  displayName: string | null
  role: 'customer' | 'admin'
  photoURL: string | null
}

// Producto
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  stock: number
  createdAt: Date
}

// Item del carrito
export interface CartItem {
  product: Product
  quantity: number
}

// Orden
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: Date
}

export interface CartState {
  items: CartItem[]
  total: number // 👈 Sumamos el total acá para que el estado sea predecible
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  // Estado del carrito
export interface CartState {
  items: CartItem[]
  total: number
}