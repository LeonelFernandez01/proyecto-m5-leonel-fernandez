import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type { User } from "../types";


export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const firebaseUser = credential.user;

  const newUser: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName,
    role: "customer",
    photoURL: null,
  };

  await setDoc(doc(db, "users", firebaseUser.uid), newUser);
  return newUser;
}


export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}


export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const firebaseUser = credential.user;

  const newUser: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: firebaseUser.displayName,
    role: "customer",
    photoURL: firebaseUser.photoURL,
  };

  await setDoc(doc(db, "users", firebaseUser.uid), newUser, { merge: true });
  return newUser;
}


export async function logout() {
  await signOut(auth);
}
