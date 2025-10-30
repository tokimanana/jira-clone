import { addDoc, collection, DocumentReference, Firestore, onSnapshot, orderBy, query, serverTimestamp, QuerySnapshot } from '@angular/fire/firestore';
import { inject, Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { Comment } from './comments.model';


@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly firestore: Firestore = inject(Firestore);


  getComments(taskId: string): Observable<Comment[]> {
    const commentsCollection = collection(this.firestore, `tasks/${taskId}/comments`);
    const q = query(commentsCollection, orderBy('createdAt', 'asc'));

    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const comments : Comment[] = [];
        QuerySnapshot.forEach(doc => {
          comments.push({id: doc.id, ...doc.data()} as Comment)
        });
        subscriber.next(comments);
      }, (error) => {
        subscriber.error(error)
      })
      return () => unsubscribe()
    })
  }

  addComment(taskId: string, content: string, user: { uid: string; name: string; email: string}): Observable<DocumentReference> {
    const commentsCollection = collection(this.firestore, `tasks/${taskId}/comments`);
    return from(addDoc(commentsCollection, {
      taskId,
      content,
      authorId: user.uid,
      authorName: user.name,
      authorEmail: user.email,
      createdAt: serverTimestamp()
    }))
  }
}

