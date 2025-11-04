import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoggedIn } from './store/auth/auth.selectors';
import { AuthActions } from './store/auth/auth.action';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";
import { ToastComponent } from "./shared/components/toast/toast.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, AsyncPipe, SpinnerComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'jira-clone';

  private readonly store = inject(Store);

  isLoggedIn$ : Observable<boolean> = this.store.select(selectIsLoggedIn);

  protected onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
