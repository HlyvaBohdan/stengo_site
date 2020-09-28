import { Component, OnInit, TemplateRef } from '@angular/core';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { Category } from 'src/app/shared/models/category.model';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../shared/interfaces/product.interface';
import { Product } from 'src/app/shared/models/product.model';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {
  modalRef: BsModalRef;
  nameProduct: string;
  adminProduct: Array<IProduct>
  categories: Array<ICategory> = [];
  subcategories: Array<ISubcategory> = []
  productID = 1;
  // productCategory: ICategory = { id: 1, nameEN: 'pizza', nameUA: 'піца' };
  categoryName: string;
  subcategoryName: string;
  subcategoryNameEN: string
  productCategory: ICategory;
  productSubcategory: ISubcategory;
  productNameEN = '';
  productNameUA = '';
  productDescription = '';
  productCompability = '';
  productColor = '';
  productColorSecond = '';
  productMaterial = '';
  productAdditional = '';
  productOldPrice: number;
  productPrice: number;
  productTop = false;
  productSale = false;
  productImage: string = '';
  productImageAdd: string = '';
  subcategory: ISubcategory;


  uploadProgress: Observable<number>;
  uploadProgressAdd: Observable<number>;

  imageStatus: boolean;
  currentIndexDelete: number;
  checkInput: boolean = false;
  reverse: boolean = false;
  product: string = 'category';
  sortedCollection: Array<ICategory>;
  editStatus: boolean;

  constructor(private catService: CategoryService,
    private modalService: BsModalService,
    private prodService: ProductService,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.adminFirebaseProducts();
    this.adminFirebaseCategories();
    this.adminFirebaseSubcategories();
  }
  private adminFirebaseCategories(): void {
    this.catService.getFirecloudCategory().subscribe(
      collection => {
        this.categories = collection.map(category => {
          const data = category.payload.doc.data() as ICategory;
          const id = category.payload.doc.id;
          return { id, ...data };
        });
      }
    );
  }
  private adminFirebaseSubcategories(): void {
    this.catService.getFirecloudSubcategory().subscribe(
      collection => {
        this.subcategories = collection.map(subcategory => {
          const data = subcategory.payload.doc.data() as ISubcategory;
          const id = subcategory.payload.doc.id;
          return { id, ...data };
        });
      }
    );
  }

  private adminFirebaseProducts(): void {
    this.prodService.getFirecloudProduct().subscribe(
      collection => {
        this.adminProduct = collection.map(product => {
          const data = product.payload.doc.data() as IProduct;
          const id = product.payload.doc.id;
          return { id, ...data };
        });
      }
    );
  }


  setProduct(value: string) {
    if (this.product === value) {
      this.reverse = !this.reverse;
    }
    this.product = value;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.categoryName = this.categories[3].nameUA;
    this.subcategoryName = this.categories[3].subcategory[0].nameUA;
    this.setCategory();
  }
  openModal1(template: TemplateRef<any>, product: IProduct) {
    this.modalRef = this.modalService.show(template);
    this.productID = product.id;
    this.categoryName = product.category;
    this.subcategoryName = product.subcategory;
    this.subcategoryNameEN = product.subcategoryEN;
    this.productNameEN = product.nameEN;
    this.productNameUA = product.nameUA;
    this.productDescription = product.description;
    this.productCompability = product.compability;
    this.productColor = product.color;
    this.productColorSecond = product.secondColor;
    this.productMaterial = product.material;
    this.productAdditional = product.additional;
    this.productOldPrice = product.oldPrice;
    this.productPrice = product.price;
    this.productTop = product.top;
    this.productSale = product.sale;
    this.productImage = product.image;
    this.productImageAdd = product.imageAdd;

    this.editStatus = true;
    this.setCategory();
    this.setSubcategory();
    this.setAttrEdit();

  }

  openModal2(template: TemplateRef<any>, index: number) {
    this.modalRef = this.modalService.show(template);
    this.currentIndexDelete = index;
  }

  deleteProduct(template: TemplateRef<any>): void {
    console.log(this.currentIndexDelete)
    if (confirm('Are you sure?')) {
      this.prodService.deleteFirecloudProduct(this.currentIndexDelete)
      this.modalService.hide(1);
    }
  }

  setCategory(): void {
    this.productCategory = this.categories.filter(cat => cat.nameUA === this.categoryName)[0];
    this.subcategories = this.productCategory.subcategory;
    this.subcategoryName = this.subcategories[0].nameUA;
    this.subcategoryNameEN = this.subcategories[0].nameEN;
    console.log(this.subcategoryNameEN)
  }
  setSubcategory(): void {
    this.productSubcategory = this.subcategories.filter(cat => cat.nameUA === this.subcategoryName)[0];
    this.subcategoryNameEN = this.productSubcategory.nameEN
    console.log(this.productSubcategory, this.subcategoryNameEN)
  }
  setAttr() {
    let top = <HTMLInputElement>document.getElementById('productTop');
    top.checked
      ? this.productTop = true
      : this.productTop = false
    console.log(this.productTop)
    let sale = <HTMLInputElement>document.getElementById('productSale');
    sale.checked
      ? this.productSale = true
      : this.productSale = false
    console.log(this.productSale)
  }
  setAttrEdit() {
    let top = <HTMLInputElement>document.getElementById('productTop');
    this.productTop == true
      ? top.checked
      : console.log('false')
    let sale = <HTMLInputElement>document.getElementById('productSale');
    this.productSale == true
      ? sale.checked
      : console.log('false')
    console.log(this.productTop, this.productSale)
  }
  setMaterial() {
    console.log(this.productMaterial)
  }
  uploadFile(event): void {
    const file = event.target.files[0];
    const type = file.type.slice(file.type.indexOf('/') + 1);
    const name = file.name.slice(0, file.name.lastIndexOf('.')).toLowerCase()
    const filePath = `images/${name}.${type}`;
    const task = this.afStorage.upload(filePath, file);
    this.productImage == ''
      ? this.uploadProgress = task.percentageChanges()
      : this.uploadProgressAdd = task.percentageChanges();

    task.then(image => {
      this.afStorage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.productImage == ''
          ? this.productImage = url
          : this.productImageAdd = url;

        this.imageStatus = true;
        console.log(this.subcategoryNameEN)

      })
    })
  }
  addProduct(): void {
    this.checkInputs()
    const product: IProduct = new Product(this.productID,
      this.categoryName,
      this.subcategoryName,
      this.subcategoryNameEN,
      this.productNameEN,
      this.productNameUA,
      this.productDescription,
      this.productCompability,
      this.productColor,
      this.productColorSecond,
      this.productMaterial,
      this.productAdditional,
      this.productOldPrice,
      this.productPrice,
      this.productTop,
      this.productSale,
      this.productImage,
      this.productImageAdd);


    if (this.checkInput == false) {
      if (!this.editStatus) {
        delete product.id;

        // this.prodService.postJSONProduct(product).subscribe(() => {
        //   // this.getProducts();
        // });
        this.prodService.postFirecloudProduct(Object.assign({}, product))
        // .then(() => {
        //   this.updateSubcategory(product)
        // })
        console.log(product)
      }
      else {
        // this.prodService.updateJSONProduct(product).subscribe(() => {
        //   // this.getProducts();
        // });
        this.prodService.updateFirecloudProduct(Object.assign({}, product))
        // .then(() => {
        //   this.updateSubcategory(product)
        // })
        this.editStatus = false
      }
      this.resetModel()
    }
  }
  // updateSubcategory(product:IProduct) {
  //   this.subcategory = this.subcategories.filter(cat => cat.nameUA == this.subcategoryName)[0];
  //   console.log(this.subcategory,this.subcategoryName)
  //   this.subcategory.products.push(Object.assign({}, product))
  //   this.firestore.collection('subcategories').doc(this.subcategory.id.toString()).update(Object.assign({}, this.subcategory));
  // }
  checkInputs(): void {
    // if (this.productNameEN == '' || this.productNameUA == ''
    //   || this.productDescription == '' || this.productCompability == '' ||
    //   this.productColor == '' ||this.productMaterial == '' ||this.productAdditional == '' ||
    //   this.productPrice == undefined || this.editStatus == false || this.productImage == '') {
    //   this.checkInput = false
    //   alert("Заповніть усі поля!")
    // }
    // else {
    //   this.checkInput = true
    // }
  }
  resetModel(): void {
    this.modalService.hide(1);
    // this.productCategory = { id: 1, nameEN: 'pizza', nameUA: 'піца' };
    this.productNameEN = '';
    this.productNameUA = '';
    this.productDescription = '';
    this.productCompability = '';
    this.productColor = '';
    this.productColorSecond = '';
    this.productMaterial = '';
    this.productAdditional = '';
    this.productPrice = undefined;
    this.productImage = '';
    this.productImageAdd = '';

    this.productID = 1;
    this.checkInput = false;
    this.imageStatus = false;
    this.editStatus = false;


  }
}
