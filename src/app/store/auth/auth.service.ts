import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  //login
  login(email: any, password: any) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  //register
  register(email: any, password: any) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  //logout
  logout() {
    return from(signOut(this.auth));
  }

  createUserDocument(uid: string, email: string, name: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userData = {uid, email, name};
    return from(setDoc(userDocRef, userData));
  }
}
