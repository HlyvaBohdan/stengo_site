import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { BasketService } from '../../shared/services/basket.service';
import { ICoupon } from '../../shared/interfaces/coupon.interface';
import { NgForm } from '@angular/forms';
import { Order } from 'src/app/shared/models/order.model';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { User } from 'src/app/shared/models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket: Array<IProduct> = [];
  adminCoupon: Array<ICoupon> = [];
  totalPrice: any;
  orderID: number = 1;
  nameCoupon = '';
  useCoupon = undefined;
  valueRadio = 'Курєром по Львову (80грн)';
  currentOrder: Array<IProduct>;
  currentTotalPrice: number;
  orderComplete: boolean;
  localItemMyProduct: boolean;
  currentDate: Date;
  myUser: any;
  salePrice: number;

  constructor(private orderService: OrderService,
    private basketService: BasketService,
    private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.adminFirebaseCoupons();
    this.getData();
    this.checkBasket();
    this.addNewProduct();
    this.checkCoupon();
    this.radioValue();
    this.getUserData();
  }

  private adminFirebaseCoupons(): void {
    this.orderService.getFirecloudCoupon().subscribe(
      collection => {
        this.adminCoupon = collection.map(category => {
          const data = category.payload.doc.data() as ICoupon;
          const id = category.payload.doc.id;
          return { id, ...data };
        })
      }
    )
  }

  addNewProduct(): void {
    this.orderService.basket.subscribe(() => {
      this.getData();
    })
  }

  checkBasket() {
    this.basketService.allBasket.subscribe(() => {
      this.basket = this.basketService.getBasket()
      this.totalPrice = this.basketService.getTotal()
    })
  }

  getData() {
    this.basket = this.basketService.setBasket()
    this.totalPrice = this.basketService.setTotal()
  }

  productCount(product: IProduct, status: boolean): void {
    this.basketService.productCount(product, status)
    this.orderService.basket.next('');
  }

  deleteProductBasket(product: IProduct): void {
    this.basketService.deleteProductBasketS(product)
  }

  checkCoupon() {
    if (this.nameCoupon != '') {
      this.useCoupon = this.adminCoupon.filter(coupon => coupon.code == this.nameCoupon)[0].percent;
      if (this.useCoupon != undefined) {
        this.salePrice = this.totalPrice - this.basketService.setTotal(this.useCoupon)
      }
      else {
        alert('Купон не найден!')
      }
    }
  }

  radioValue() {
    let radios = document.getElementsByName("radio") as any
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        this.valueRadio = radios[i].value;
      }
    }
  }

  addOrder(form: NgForm): void {
    const order = new Order(this.orderID,
      form.controls.userName.value,
      form.controls.userLastName.value,
      form.controls.userPhone.value,
      form.controls.userEmail.value,
      this.valueRadio,
      this.basket,
      this.totalPrice,
      new Date().toString())
    this.orderComplete = true;
    delete order.id;
    this.orderService.addFirecloudOrder(Object.assign({}, order))
      .then(() => {
        this.currentOrder = order.ordersDetails;
        this.currentTotalPrice = order.totalPayment;
        this.currentDate = new Date();
        this.updateUser(this.myUser, order);
        localStorage.removeItem('myOrder');
        this.basketService.removeBasket();
        this.basketService.allBasket.next('');
        this.orderService.basket.next();
      })
    this.orderComplete = true;
    this.basket = [];
    form.reset
  }

  private getUserData(): void {
    if (localStorage.length > 0 && localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user'));
      this.firestore.collection('users').ref.where('idAuth', '==', user.idAuth).onSnapshot(
        collection => {
          collection.forEach(document => {
            const data = document.data() as IUser;
            const id = document.id;
            this.myUser = ({ id, ...data })
          })
        }
      )
    }
  }

  updateUser(user: any, order: IOrder) {
    if (localStorage.length > 0 && localStorage.getItem('user')) {
      user.orders.push(Object.assign({}, order));
      const userUpd = new User(
        user.idAuth,
        user.firstName,
        user.orders,
        user.role,
        user.email,
        user.phone
      )
      localStorage.setItem('user', JSON.stringify(userUpd))
      this.firestore.collection('users').doc(user.id).update(Object.assign({}, userUpd));
    }
  }

  goHome(): void {
    this.orderComplete = false;
  }

}
