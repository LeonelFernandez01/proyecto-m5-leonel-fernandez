import { collection, addDoc, getDocs, query, where, doc, updateDoc, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import type { Order, CartItem } from '../types'

// Crear una orden
export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number
): Promise<string> {
  const order = {
    userId,
    items,
    total,
    status: 'pending',
    createdAt: new Date()
  }
  const docRef = await addDoc(collection(db, 'orders'), order)
  return docRef.id
}

// Traer órdenes de un usuario
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[]
}

// Traer todas las órdenes (admin)
export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[]
}

// Actualizar estado de una orden (admin)
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), { status })
}