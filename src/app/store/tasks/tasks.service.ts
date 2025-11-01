import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from './tasks.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly injector: Injector = inject(Injector);
  private readonly tasksCollection = collection(this.firestore, 'tasks');
  private readonly tasks$: Observable<Task[]>;

  constructor() {
    this.tasks$ = collectionData(this.tasksCollection, {
      idField: 'id',
    }) as Observable<Task[]>;
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTasks(taskData: Omit<Task, 'id'>): Observable<DocumentReference> {
    return runInInjectionContext(this.injector, () => {
      return from(addDoc(this.tasksCollection, taskData));
    });
  }

  updateTask(taskUpdate: Partial<Task> & { id: string }): Observable<void> {
    return runInInjectionContext(this.injector, () => {
      const taskDocRef = doc(this.firestore, `tasks/${taskUpdate.id}`);
      return from(updateDoc(taskDocRef, taskUpdate));
    });
  }

  deleteTask(taskId: string): Observable<void> {
    return runInInjectionContext(this.injector, () => {
      const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
      return from(deleteDoc(taskDocRef));
    });
  }
}
