import { Injectable } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { OrderService } from './order.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  basket: Array<IProduct>
  allBasket: Subject<any> = new Subject();
  productItem:Subject<any> = new Subject();
  totalPrice: any;
  constructor(private orderService:OrderService) { }

 setBasket(): any {
    if (localStorage.length > 0 && localStorage.getItem("myOrder")) {
      this.basket = JSON.parse(localStorage.getItem("myOrder"));
      return this.basket

    }
 }

  setTotal(coupon?){
    if (coupon) {
      this.totalPrice = this.basket.reduce((total, elem) => {
        return (total + (elem.price * elem.count)) * (100-coupon)/100
      }, 0)
    }
      else {
        this.totalPrice = this.basket.reduce((total, elem) => {
          return total + (elem.price * elem.count)
        }, 0)
      }
      this.allBasket.next('')
    return this.totalPrice
    
  }

  productCount(product: IProduct, status: boolean): void {
    if (status) {
      product.count++;
    }
    else {
      if (product.count > 1) {
        product.count--;
      }
    }
    this.setTotal();
    this.updateBasket();
 

  }
 updateBasket(): void {
    localStorage.setItem('myOrder', JSON.stringify(this.basket))
  }
  removeBasket(): void{
    this.basket = [];
  }
  deleteProductBasketS(product:IProduct): void{
    const index = this.basket.findIndex(prod => prod.id == product.id);
    this.basket.splice(index, 1);
    // this.orderService.basket.next('next')
    this.setTotal();
    this.updateBasket();
  }
getBasket(){
  return this.basket
}
getTotal(){
  return this.totalPrice
}

}
