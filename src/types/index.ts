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