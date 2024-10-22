import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { Category } from 'src/app/shared/models/category.model';
import { ISubcategory } from '../../shared/interfaces/subcategory.interface';
import { Subcategory } from '../../shared/models/subcategory.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-subcategory',
  templateUrl: './admin-subcategory.component.html',
  styleUrls: ['./admin-subcategory.component.scss']
})
export class AdminSubcategoryComponent implements OnInit {

  subcategories: Array<ISubcategory> = [];
  modalRef: BsModalRef;
  reverse: boolean = false;
  subcategory: string = 'status';
  nameEN = '';
  nameUA = '';
  subcategoryImage = '';
  nameSubcategory: string;
  subcategoryCategory = 'Ipad';
  subcategoryID = 1;
  checkInput: boolean;
  currentIndexDelete: number;
  currentNameEnDelete: string
  imageStatus: boolean;
  uploadProgress: Observable<number>;
  categories: Array<ICategory> = [];
  categoryName: string;
  category: ICategory;
  constructor(private modalService: BsModalService,
    private catService: CategoryService, private afStorage: AngularFireStorage, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.adminFirebaseSubcategories();
    this.adminFirebaseCategories();
  }

  private adminFirebaseSubcategories(): void {
    this.catService.getFirecloudSubcategory().subscribe(
      collection => {
        this.subcategories = collection.map(subcategory => {
          const data = subcategory.payload.doc.data() as ISubcategory;
          const id = subcategory.payload.doc.id;
          return { id, ...data };
        })
      }
    )
  }

  private adminFirebaseCategories(): void {
    this.catService.getFirecloudCategory().subscribe(
      collection => {
        this.categories = collection.map(category => {
          const data = category.payload.doc.data() as ICategory;
          const id = category.payload.doc.id;
          return { id, ...data };
        })
      }
    )
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.categoryName = this.categories[0].nameUA
  }

  setSubcategory(): void {
    this.subcategoryCategory = this.categories.filter(cat => cat.nameUA === this.categoryName)[0].nameUA;
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const type = file.type.slice(file.type.indexOf('/') + 1);
    const name = file.name.slice(0, file.name.lastIndexOf('.')).toLowerCase()
    const filePath = `images/${name}.${type}`;
    const task = this.afStorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then(image => {
      this.afStorage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.subcategoryImage = url;
        this.imageStatus = true;
    this.checkInputs()

      })
    })
  }

  checkInputs(): void {
    if (this.nameEN == '' || this.nameUA == '' || this.subcategoryImage== '') {
      this.checkInput = false
    }
    else {
      this.checkInput = true
    }
  }

  addSubcategory(): void {
    const newSubcategory = new Subcategory(this.subcategoryID, this.nameEN, this.nameUA, this.subcategoryCategory, this.subcategoryImage);
    delete newSubcategory.id;
    this.catService.postFirecloudSubcategory(Object.assign({}, newSubcategory))
      .then(() => {
        this.updateCategory('add', newSubcategory)
        this.resetModel()
      })
  }

  updateCategory(message: string, newSubcategory?: ISubcategory): void {
    this.category = this.categories.filter(cat => cat.nameUA === this.categoryName)[0];
    if (message == 'add') {
      this.category.subcategory.push(Object.assign({}, newSubcategory))
    }
    else {
      this.currentIndexDelete = this.category.subcategory.findIndex(elem => elem.nameEN == this.currentNameEnDelete)
      if (this.currentIndexDelete != -1) {
        this.category.subcategory.splice(this.currentIndexDelete, 1)
      }
    }
    this.firestore.collection('categories').doc(this.category.id.toString()).update(Object.assign({}, this.category));
  }

  deleteSubcategory(): void {
    if (confirm('Are you sure?')) {
      this.catService.deleteFirecloudSubcategory(this.currentIndexDelete);
      this.modalService.hide(1);
      this.updateCategory('delete')
    }
  }

  openModal2(template: TemplateRef<any>, subcategory: ISubcategory) {
    this.modalRef = this.modalService.show(template);
    this.currentIndexDelete = subcategory.id;
    this.currentNameEnDelete = subcategory.nameEN
  }

  setSubcategoryS(value: string) {
    if (this.subcategory === value) {
      this.reverse = !this.reverse;
    }
    this.subcategory = value;
  }

  resetModel(): void {
    this.modalService.hide(1);
    this.nameEN = '';
    this.nameUA = '';
    this.subcategoryImage = '';
    this.subcategoryID = 1;
    this.checkInput = false;
    this.imageStatus = false;
  }

}
