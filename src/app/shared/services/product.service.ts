import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productView: Subject<any> = new Subject();
  productWish: Subject<any> = new Subject();
  productWishUser: Subject<any> = new Subject();
  productDetails: Subject<any> = new Subject();

  constructor(private firestore:AngularFirestore) { }

  getFirecloudProduct(): Observable<DocumentChangeAction<unknown>[]>{
    return this.firestore.collection('products').snapshotChanges()
  }
  postFirecloudProduct(product:IProduct):Promise<DocumentReference>{
    return this.firestore.collection('products').add(product);
  }
  updateFirecloudProduct(product: IProduct): Promise<void> {
    return this.firestore.collection('products').doc(product.id.toString()).update(product);
  }
  deleteFirecloudProduct(id:number): Promise<void> {
    return this.firestore.collection('products').doc(id.toString()).delete();
  }
  productCountService(product: IProduct, status: boolean):number {
    if (status) {
      return product.count++;
    }
    else {
      if (product.count > 1) {
       return product.count--;
      }
    }
  }

  
}
