import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { PurchaseBill } from './pages/purchase-bill/purchase-bill';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'purchase-bill', component: PurchaseBill },
  { path: '**', redirectTo: 'login' }
];
