import { auth, provider } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export const register = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  await signInWithPopup(auth, provider);
};
