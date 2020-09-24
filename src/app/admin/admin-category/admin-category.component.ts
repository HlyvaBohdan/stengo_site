import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ICategory } from "src/app/shared/interfaces/category.interface";
import { Category } from "src/app/shared/models/category.model";
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  adminCategory: Array<ICategory> = [];
  modalRef: BsModalRef;
  nameCategory: string;
  reverse: boolean = false;
  category: string = 'nameUA';
  nameEN = '';
  nameUA = '';
  categoryImage = '';
  categoryID = 1;
  checkInput: boolean;
  currentIndexDelete: number;
  imageStatus: boolean;
  uploadProgress: Observable<number>;

  constructor(private modalService: BsModalService,
    private catService: CategoryService, private afStorage: AngularFireStorage) { }
    

  ngOnInit(): void {
    this.adminFirebaseCategories()
  }
  private adminFirebaseCategories(): void{
    this.catService.getFirecloudCategory().subscribe(
      collection => {
        this.adminCategory = collection.map(category => {
          const data = category.payload.doc.data() as ICategory;
          const id = category.payload.doc.id;
          return { id, ...data };
        })
      }
    )
  }

  addCategory():void {
    const newCategory = new Category(this.categoryID, this.nameEN, this.nameUA,this.categoryImage);
    delete newCategory.id;
    this.catService.postFirecloudCategory(Object.assign({},newCategory));
    this.resetModel();
  }

  deleteCategory(): void {
    if (confirm('Are you sure?')) {
      this.catService.deleteFirecloudCategory(this.currentIndexDelete)
      this.modalService.hide(1);
    }
  }

  checkInputs(): void {
    if (this.nameEN == '' || this.nameUA == '') {
      this.checkInput = false
    }
    else {
      this.checkInput = true
    }
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  openModal2(template: TemplateRef<any>, index: number) {
    this.modalRef = this.modalService.show(template);
    this.currentIndexDelete = index;
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
        this.categoryImage = url;
        this.imageStatus = true;
      })
    })
  }
  setCategory(value: string) {
    if (this.category === value) {
      this.reverse = !this.reverse;
    }
    this.category = value;
  }
  resetModel(): void {
    this.modalService.hide(1);
    this.nameEN = '';
    this.nameUA = '';
    this.categoryID = 1;
    this.checkInput = false;
    this.imageStatus=false;
  }

}
