import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './users.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly firestore: Firestore = inject(Firestore);

  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<
      User[]
    >;
  }
}
