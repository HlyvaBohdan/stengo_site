import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { Filter } from 'src/app/shared/models/filter.model';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { ProductService } from '../../shared/services/product.service';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  saleProducts: Array<IProduct> = []
  filterOpen: boolean;
  filterOpenMobile: boolean;
  userFilterProduct: Array<IProduct> = [];
  userFilterProductFinal: Array<IProduct> = [];
  countProduct: number;
  p: number = 1;
  filterBy: string;
  filterByDetails: string;
  filterUser = [];
  constructor(
    private afStorage: AngularFirestore,
    private orderService: OrderService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.getSaleProducts();
    this.userFilterProductFinal = [];
  }

  getSaleProducts() {
    this.afStorage.collection('products').ref.where('sale', '==', true).onSnapshot(
      collection => {
        collection.forEach(document => {
          const data = document.data() as IProduct;
          const id = document.id;
          this.saleProducts.push({ id, ...data })
          this.userFilterProduct.push({ id, ...data })
          this.userFilterProductFinal.push({ id, ...data })
          console.log(this.saleProducts)
        })
        this.countProduct = this.saleProducts.length
      }
    )
  }

  openfilter() {
    if (window.innerWidth > 767) {
      this.filterOpen = !this.filterOpen
    }
    if (window.innerWidth < 767) {
      this.filterOpenMobile = !this.filterOpenMobile
    }
  }

  addBasket(product: IProduct): void {
    this.orderService.addBasketService(product)
  }

  addToWish(product): void {
    this.productService.productWish.next([product, 'add'])
  }

  changeInput($event) {
    this.filterBy = $event.target.name;
    this.filterByDetails = $event.target.id;
    const filter = new Filter(
      this.filterBy,
      this.filterByDetails
    )
    if (this.filterUser.length == 0) {
      this.filterUser.push(filter)
    }
    else {
      const index = this.filterUser.findIndex(elem => elem.filterBy == filter.filterBy
      )
      if (index != -1) {
        this.filterUser.splice(index, 1);
        this.userFilterProduct = this.saleProducts
      }
      this.filterUser.push(filter)
    }
    this.userFilterProductFinal = []
    this.userFilterProduct.filter(elem => elem.category.toLowerCase() == filter.filterDetails.toLowerCase()
      ?
      this.userFilterProductFinal.push(elem) : elem,
      this.userFilterProduct = this.userFilterProductFinal
    )
    this.countProduct = this.userFilterProductFinal.length;
  }

  resetfilter() {
    this.userFilterProductFinal = this.saleProducts
    this.countProduct = this.userFilterProductFinal.length;
    let radios = document.querySelectorAll("input[type=radio]:checked") as any
    console.log(radios)
    for (let i = 0; i < radios.length; i++) {
      radios[i].checked = false
    }
  }

}
