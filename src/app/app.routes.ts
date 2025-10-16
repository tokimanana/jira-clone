import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'board',
    loadComponent: () => import('./kanban/kanban-board/kanban-board.component').then(m => m.KanbanBoardComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'board',
  }
];
