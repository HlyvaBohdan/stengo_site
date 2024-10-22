import { Component, OnInit, Injectable } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { BasketService } from '../../shared/services/basket.service';
import { HttpService } from '../../shared/services/http.service';
import { ICoupon } from '../../shared/interfaces/coupon.interface';
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
  valueRadio: any = 'Курєром по Львову (80грн)';
  currentOrder: Array<IProduct>;
  currentTotalPrice: number;
  orderComplete: boolean;
  localItemMyProduct: boolean;
  currentDate: Date;
  myUser: any;
  salePrice: number;
  checkName = /[А-Яа-я]{2,20}/;
  checkEmail = /^[\w\.\-]{1,}@\w{1,}\.\w{2,7}$/;
  checkPhone = /^\d{10}$/;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cityArr: Array<any>;
  cityName: string = '';
  cityRef: string = '';
  showCityBlock: boolean;
  showCityList: boolean;
  departmentArr: Array<any>;
  departmentArrFilter: Array<any>;
  departmentName: string = '';
  showDepartmentBlock: boolean;
  showDepartmentList: boolean;


  constructor(private orderService: OrderService,
    private basketService: BasketService,
    private httpService: HttpService,

    private firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.adminFirebaseCoupons();
    this.getData();
    this.getUserData();
    this.checkBasket();
    this.addNewProduct();
    this.checkCoupon();
    this.radioValue();
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

  private checkBasket() {
    this.basketService.allBasket.subscribe(() => {
      this.basket = this.basketService.getBasket()
      this.totalPrice = this.basketService.getTotal()
    })
  }

  private getData() {
    this.basket = this.basketService.setBasket()
    this.totalPrice = this.basketService.setTotal()
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
          this.firstName = this.myUser.firstName;
          this.phone = this.myUser.phone;
          this.email = this.myUser.email;
        }
      )
    }
  }

  private addNewProduct(): void {
    this.orderService.basket.subscribe(() => {
      this.getData()
    })
  }

  productCount(product: IProduct, status: boolean): void {
    this.basketService.productCount(product, status)
    this.orderService.basket.next('');
  }

  deleteProductBasket(product: IProduct): void {
    this.basketService.deleteProductBasketS(product)
  }

  private checkCoupon() {
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

  private radioValue() {
    let radios = document.getElementsByName("radio") as any
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        this.valueRadio = radios[i].value;
      }
    }
    if (this.valueRadio == 'Доставка в отделения Новой Почты') {
      this.showCityBlock = true;
    }
    else {
      this.showCityBlock = false;
      this.showDepartmentBlock = false;
      this.cityName = '';
      this.cityRef = '';
      this.departmentName = '';
    }
  }
  changeCity(): void {
    this.httpService.postData(this.cityName).subscribe((info: any) => {
      this.cityArr = info.data[0].Addresses;
      this.showCityList = true;
    })

  }
  setCity(city: any): void {
    this.cityName = city.Present
    this.showCityList = false;
    this.showDepartmentBlock = true;
    this.cityRef = city.Ref;
    this.getDepartments();
  }

  resetCity():void{
    this.cityName = '';
    this.departmentName = '';
    this.showDepartmentList = false;
    this.showDepartmentBlock = false;
  }

  getDepartments() {
    this.httpService.postData(this.cityName, this.cityRef).subscribe((info: any) => {
      this.departmentArr = info.data;
      this.departmentArrFilter = info.data;
    })
  }

  changeDepartment(): void {
    this.departmentArrFilter = [];
    this.departmentArr.forEach((elem) => {
      elem.Description.toLowerCase().includes(this.departmentName.toLowerCase()) ? this.departmentArrFilter.push(elem) : elem
    })
    this.showDepartmentList = true;
  }

  setDepartment(department): void {
    this.departmentName = department.Description;
    this.showDepartmentList = false;
  }

  resetDepartment(): void{
    this.departmentName = '';
    this.showCityList = false;
  }

  checkInputs(): void {
    if (this.checkName.test(this.firstName)) {
      if (this.checkName.test(this.lastName)) {
        if (this.checkPhone.test(this.phone)) {
          if (this.checkEmail.test(this.email)) {
            if (this.showCityBlock == true) {
              if (this.cityName != '' && this.departmentName != '') {
                this.valueRadio = {
                  city: this.cityName,
                  department: this.departmentName
                }
                this.addOrder();
              }
              else {
                alert('Некорректно указан город или отделения получателя')
              }
            }
            else {
              this.addOrder();
            }
          }
          else {
            alert('Некорректно указан емайл')
          }
        }
        else {
          alert('Некорректно указан телефон')
        }
      }
      else {
        alert('Некорректно указана фамилия')
      }
    }
    else {
      alert('Некорректно указано имя')
    }
  }

  addOrder(): void {
    const order = new Order(this.orderID,
      this.firstName,
      this.lastName,
      this.phone,
      this.email,
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
    this.reset
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

  reset(): void {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.cityName = '';
    this.cityRef = '';
    this.departmentName = '';
  }

}
