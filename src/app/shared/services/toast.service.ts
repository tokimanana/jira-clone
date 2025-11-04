import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

interface ToastConfig {
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private readonly toasts$ = new BehaviorSubject<Toast[]>([]);

  private idCounter = 0;

  private readonly config: ToastConfig = {
    duration: 5000
  };

  getToasts(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success',duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  private show(message: string, type: Toast['type'], duration?: number) {
    const toast: Toast = {
      message,
      type,
      id: this.idCounter++,
    };

    const current = this.toasts$.value;
    this.toasts$.next([...current, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration ?? this.config.duration);
  }

  remove(id: number): void {
    const current = this.toasts$.value;
    this.toasts$.next(current.filter(t => t.id !== id))
  }

  clear(): void {
    this.toasts$.next([]);
  }
}
