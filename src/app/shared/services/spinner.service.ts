import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private count = 0;

  private readonly isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  get loading$(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  show(): void {
    this.count++;
    if (this.count === 1) {
      this.isLoading$.next(true);
    }
  }

  hide(): void {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) {
      this.isLoading$.next(false);
    }
  }

  reset(): void {
    this.count = 0;
    this.isLoading$.next(false);
  }
}
