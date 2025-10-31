import { addDoc, collection, DocumentReference, Firestore, onSnapshot, orderBy, query, serverTimestamp, QuerySnapshot } from '@angular/fire/firestore';
import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
import { from, Observable } from "rxjs";
import { Comment } from './comments.model';


@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly injector: Injector = inject(Injector);


  getComments(taskId: string): Observable<Comment[]> {
  return new Observable(subscriber => {
    const unsubscribe = runInInjectionContext(this.injector, () => {
      const commentsCollection = collection(this.firestore, `tasks/${taskId}/comments`);
      const q = query(commentsCollection, orderBy('createdAt', 'asc'));

      return onSnapshot(q,
        (snapshot: QuerySnapshot) => {
          const comments: Comment[] = [];
          snapshot.forEach(doc => {
            comments.push({id: doc.id, ...doc.data()} as Comment);
          });
          subscriber.next(comments);
        },
        (error) => {
          subscriber.error(error);
        }
      );
    });

    return () => unsubscribe();
  });
}

  /**
 * Alternative implementation using collectionData (simpler)
 * Commented out in favor of onSnapshot for educational purposes
 */
// getCommentsSimple(taskId: string): Observable<Comment[]> {
//   const ref = collection(this.firestore, `tasks/${taskId}/comments`);
//   const q = query(ref, orderBy('createdAt', 'asc'));
//   return collectionData(q, { idField: 'id' }) as Observable<Comment[]>;
// }

  addComment(taskId: string, content: string, author: { uid: string; email: string }): Observable<DocumentReference> {
    const commentsCollection = collection(this.firestore, `tasks/${taskId}/comments`);
    return from(addDoc(commentsCollection, {
      taskId,
      content,
      authorId: author.uid,
      authorEmail: author.email,
      createdAt: serverTimestamp()
    }))
  }
}

