import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SaleComponent } from './pages/sale/sale.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { BasketComponent } from './pages/basket/basket.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductsComponent } from './pages/products/products.component';

import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminSubcategoryComponent } from './admin/admin-subcategory/admin-subcategory.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminCouponsComponent } from './admin/admin-coupons/admin-coupons.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminQuickOrderComponent } from './admin/admin-quick-order/admin-quick-order.component';

import { AuthGuard } from './shared/guards/auth.guard';
import { ProfileGuard } from './shared/guards/profile.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'menu/:category', component: CategoryComponent },
  { path: 'menu/:category/:subcategory', component: ProductsComponent },
  { path: 'menu/:category/:subcategory/:name', component: ProductDetailsComponent },
  { path: 'sale', component: SaleComponent },
  { path: 'details', component: ProductDetailsComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard] },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'category', pathMatch: 'full' },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'subcategory', component: AdminSubcategoryComponent },
      { path: 'product', component: AdminProductComponent },
      { path: 'coupon', component: AdminCouponsComponent },
      { path: 'order', component: AdminOrdersComponent },
      { path: 'quickorder', component: AdminQuickOrderComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
