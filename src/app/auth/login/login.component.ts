import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectAuthState } from '../../store/auth/auth.selectors';
import { AuthActions } from '../../store/auth/auth.action';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private store = inject(Store);

  //form
  email = '';
  password = '';

  //error && isLoading
  isLoading$: Observable<boolean> = this.store
    .select(selectAuthState)
    .pipe(map((loadingState) => loadingState.isLoading));

  error$: Observable<string | null> = this.store
    .select(selectAuthState)
    .pipe(map((errorMessage) => errorMessage.error));

  onSubmit() {
    this.store.dispatch(
      AuthActions.login({
        email: this.email,
        password: this.password,
      })
    );
  }
}
