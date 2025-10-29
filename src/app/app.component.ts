import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoggedIn } from './store/auth/auth.selectors';
import { AuthActions } from './store/auth/auth.action';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'jira-clone';

  private readonly store = inject(Store);

  isLoggedIn$ : Observable<boolean> = this.store.select(selectIsLoggedIn);

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
