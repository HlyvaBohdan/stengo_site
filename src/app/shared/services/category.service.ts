import { Injectable } from '@angular/core';
import { ICategory } from '../interfaces/category.interface';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ISubcategory } from '../interfaces/subcategory.interface';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: AngularFirestore) { }

  getFirecloudCategory(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('categories').snapshotChanges()
  }
  getFirecloudSubcategory(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('subcategories').snapshotChanges()
  }

  postFirecloudCategory(category: ICategory): Promise<DocumentReference> {
    return this.firestore.collection('categories').add(category);
  }
  postFirecloudSubcategory(subcategory: ISubcategory): Promise<DocumentReference> {
    return this.firestore.collection('subcategories').add(subcategory);
  }
  deleteFirecloudCategory(index: any): Promise<void> {
    return this.firestore.collection('categories').doc(index).delete();
  }
  deleteFirecloudSubcategory(index: any): Promise<void> {
    return this.firestore.collection('subcategories').doc(index).delete();
  }

}
