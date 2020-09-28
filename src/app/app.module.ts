import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { HomeComponent } from './pages/home/home.component';
import { SaleComponent } from './pages/sale/sale.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductsViewedComponent } from './pages/products-viewed/products-viewed.component';
import { BasketComponent } from './pages/basket/basket.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoryComponent } from './pages/category/category.component';

import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminSubcategoryComponent } from './admin/admin-subcategory/admin-subcategory.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminCouponsComponent } from './admin/admin-coupons/admin-coupons.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminQuickOrderComponent } from './admin/admin-quick-order/admin-quick-order.component';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

import { SearchPipe } from './shared/pipes/search.pipe';
import { SearchProductPipe } from './shared/pipes/search-product.pipe';
import { SearchOrderPipe } from './shared/pipes/search-order.pipe';

import { OrderModule } from 'ngx-order-pipe';
registerLocaleData(localeRu);

export let options: Partial<IConfig> | (() => Partial<IConfig>);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SaleComponent,
    ProductDetailsComponent,
    ProductsViewedComponent,
    BasketComponent,
    ProfileComponent,
    ProductsComponent,
    AdminComponent,
    AdminCategoryComponent,
    AdminSubcategoryComponent,
    AdminProductComponent,
    AdminCouponsComponent,
    AdminOrdersComponent,
    CategoryComponent,
    AdminQuickOrderComponent,
    SearchPipe,
    SearchProductPipe,
    SearchOrderPipe
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgxPaginationModule,
    NgxMaskModule.forRoot(),
    OrderModule
  ],

  providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
  bootstrap: [AppComponent]
})

export class AppModule {

}
