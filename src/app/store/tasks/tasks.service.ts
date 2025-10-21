import { inject, Injectable } from '@angular/core';
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
  private firestore: Firestore = inject(Firestore);
  private tasksCollection = collection(this.firestore, 'tasks');

  getTasks(): Observable<Task[]> {
    return collectionData(this.tasksCollection, {
      idField: 'id',
    }) as Observable<Task[]>;
  }

  addTasks(taskData: Omit<Task, 'id'>): Observable<DocumentReference> {
    return from(addDoc(this.tasksCollection, taskData));
  }

  updateTask(taskUpdate: Partial<Task> & { id: string }): Observable<void> {
    const taskDocRef = doc(this.firestore, `tasks/${taskUpdate.id}`);
    return from(updateDoc(taskDocRef, taskUpdate));
  }

  deleteTask(taskId: string): Observable<void> {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`)
    return from(deleteDoc(taskDocRef));
  }
}
