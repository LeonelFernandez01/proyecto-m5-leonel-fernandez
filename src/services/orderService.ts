import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  orderBy,
  runTransaction, 
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Order, CartItem } from "../types";
import type { DocumentReference } from 'firebase/firestore'


export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number,
): Promise<string> {
  
  
  return await runTransaction(db, async (transaction) => {
    const productUpdates: { docRef: DocumentReference; newStock: number }[] = [];

    
    for (const item of items) {
      const productRef = doc(db, "products", item.product.id);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error(`El producto ${item.product.name} no existe en la base de datos.`);
      }

      const productData = productSnap.data();
      const currentStock = productData.stock ?? 0; 

      
      if (currentStock < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.product.name}. Quedan ${currentStock} unidades.`);
      }

      
      productUpdates.push({
        docRef: productRef,
        newStock: currentStock - item.quantity,
      });
    }

    
    for (const update of productUpdates) {
      transaction.update(update.docRef, { stock: update.newStock });
    }

    
    const order = {
      userId,
      items,
      total,
      status: "pending",
      createdAt: new Date(),
    };
    
    const ordersRef = collection(db, "orders");
    const newOrderDocRef = doc(ordersRef); 
    transaction.set(newOrderDocRef, order);

    return newOrderDocRef.id; 
  });
}


export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}


export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}


export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), { status });
}