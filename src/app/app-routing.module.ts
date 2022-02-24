import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  // for the default url (url with no path)
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home',
    component: AppComponent
    // children: [
    //   { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
    //   { path: 'order', loadChildren: () => import('./order/order.module').then(m => m.OrderModule) },
    //   { path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
    // ],
    // canActivate: [AuthService]
  },

  // for signin and signup
  { path: 'login', component: LoginComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
