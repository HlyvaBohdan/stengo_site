import { Injectable } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { Subject, Observable } from 'rxjs';
import { ICoupon } from '../interfaces/coupon.interface';
import { DocumentReference, AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { IQuickorder } from '../interfaces/quickorder.interface ';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  basket: Subject<any> = new Subject();
  constructor(private firestore: AngularFirestore,) { }

  addBasketService(product: IProduct) {
    let localProducts: Array<IProduct> = [];
    if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
      localProducts = JSON.parse(localStorage.getItem('myOrder'));
      if (localProducts.some(prod => prod.id === product.id)) {
        const index = localProducts.findIndex(prod => prod.id === product.id);
        localProducts[index].count += product.count;
      }
      else {
        localProducts.push(product);
      }
    }
    else {
      localProducts.push(product)
    }
    localStorage.setItem('myOrder', JSON.stringify(localProducts));
    this.basket.next('toBasket')
    product.count = 1;
  }

  getFirecloudCoupon(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('coupons').snapshotChanges()
  }

  postFirecloudCoupon(coupon: ICoupon): Promise<DocumentReference> {
    return this.firestore.collection('coupons').add(coupon);
  }

  deleteFirecloudCoupon(index: any): Promise<void> {
    return this.firestore.collection('coupons').doc(index).delete();
  }

  getFirecloudOrders(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('orders').snapshotChanges()
  }

  addFirecloudOrder(order: IOrder): Promise<DocumentReference> {
    return this.firestore.collection('orders').add(order);
  }

  deleteFirecloudOrder(id: number): Promise<void> {
    return this.firestore.collection('orders').doc(id.toString()).delete();
  }

  updateFirecloudOrder(order: IOrder) {
    return this.firestore.collection('orders').doc(order.id.toString()).update(order);
  }

  getFirecloudQuickOrder(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('quickorders').snapshotChanges()
  }

  addFirecloudQuickOrder(order: IQuickorder): Promise<DocumentReference> {
    return this.firestore.collection('quickorders').add(order);
  }

  deleteFirecloudQuickOrder(id: number): Promise<void> {
    return this.firestore.collection('quickorders').doc(id.toString()).delete();
  }

}
