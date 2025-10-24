import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './users.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly usersCollection = collection(this.firestore, 'users');
  private readonly users$: Observable<User[]>;

  constructor() {
    this.users$ = collectionData(this.usersCollection, {
      idField: 'uid',
    }) as Observable<User[]>;
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }
}
