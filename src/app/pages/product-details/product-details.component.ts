import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from '../../shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { IQuickorder } from '../../shared/interfaces/quickorder.interface ';
import { Quickorder } from '../../shared/models/quickorder.model copy';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  color = false;
  userProduct: IProduct;
  smallBlock: Array<IProduct> = [];
  smallBlockFinal: Array<IProduct> = [];
  titleImage: string;
  productsViewed: Array<IProduct> = [];
  quickOrderId = 1;
  phoneQuick: string;
  checkPhone = /^\d{10}$/;
  statusWish: boolean;
  wishProducts: Array<IProduct>
  myModal = document.getElementsByClassName('modal1') as HTMLCollectionOf<HTMLElement>;
  productsWish: Array<IProduct>
  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private afStorage: AngularFirestore,
    private orderService: OrderService,
    private productService: ProductService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const productName = this.actRoute.snapshot.paramMap.get('name');
        this.getProductDetails(productName)
      }
    })
  }

  ngOnInit(): void {
    this.checkWishStatus();
  }

  getProductDetails(productName: string) {
    this.afStorage.collection('products').ref.where('nameEN', '==', productName).onSnapshot(
      collection => {
        collection.forEach(document => {
          const data = document.data() as IProduct;
          const id = document.id;
          this.userProduct = ({ id, ...data })
        })
        this.titleImage = this.userProduct?.image
        this.productService.productView.next(this.userProduct)
        this.productService.productWishUser.next(this.userProduct);
        this.checkColor()
      }
    )
  }

  private getSmallBlock(): void {
    this.smallBlock = [];
    this.afStorage.collection('products').ref.where('compability', '==', this.userProduct.compability).onSnapshot(
      collection => {
        this.smallBlock = [];
        collection.forEach(document => {
          const data = document.data() as IProduct;
          const id = document.id;
          this.smallBlock.push({ id, ...data })
        })
        this.smallBlockFinal = this.smallBlock.filter((elem) => elem.material == this.userProduct.material && elem.additional == this.userProduct.additional && elem.category == this.userProduct.category)
      }
    )
  }

  addBasket(product: IProduct): void {
    this.orderService.addBasketService(product)
  }

  checkImage(image?: string) {
    if (image == 'main') {
      this.titleImage = this.userProduct?.image
    }
    else {
      this.titleImage = this.userProduct?.imageAdd
    }
  }

  addQuickOrder(product): void {
    if (this.checkPhone.test(this.phoneQuick)) {
      const quickOrder: IQuickorder = new Quickorder(
        this.quickOrderId,
        this.phoneQuick,
        product,
        new Date().toString(),
      )
      delete quickOrder.id
      this.orderService.addFirecloudQuickOrder(Object.assign({}, quickOrder));
      this.openModal()
    }
    else {
      alert('Не коректный номер телефона!')
    }
  }

  openModal(): void {
    this.myModal[0].style.display = 'flex';
  }

  closeModal(): void {
    this.myModal[0].style.display = 'none';
    this.phoneQuick = '';
  }

  goHome(): void {
    this.myModal[0].style.display = 'none';
    this.phoneQuick = '';
  }

  addToWish(product): void {
    this.productService.productWish.next([product, 'add']);
    this.productService.productWishUser.next('');
  }

  checkWishStatus() {
    this.productService.productWishUser.subscribe(() => {
      if (this.userProduct && localStorage.getItem('myProductWishes')) {
        this.wishProducts = JSON.parse(localStorage.getItem('myProductWishes'));
        if (this.wishProducts.some(prod => prod.id === this.userProduct.id)) {
          this.statusWish = true;
        }
        else {
          this.statusWish = false;
        }
      }
    })
  }

  checkColor() {
    if (this.userProduct.color != '') {
      this.color = true;
      this.getSmallBlock()
    }
    else {
      this.color = false;
    }
  }

}