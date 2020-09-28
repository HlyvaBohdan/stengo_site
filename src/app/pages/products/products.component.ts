import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from '../../shared/services/order.service';
import { ProductService } from '../../shared/services/product.service';
import { Filter } from 'src/app/shared/models/filter.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  filterOpen: boolean;
  filterOpenT: boolean;
  filterOpenMobile: boolean;
  userProduct: Array<IProduct> = [];
  userFilterProduct: Array<IProduct> = [];
  userFilterProductFinal: Array<IProduct> = [];
  countProduct: number;
  p: number = 1;
  filterBy: string;
  filterByDetails: string;
  filterUser = [];
  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private afStorage: AngularFirestore,
    private orderService: OrderService,
    private productService: ProductService,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const subcategoryName = this.actRoute.snapshot.paramMap.get('subcategory');
        this.setSubcategory(subcategoryName)
      }
    })
  }

  ngOnInit(): void {
    this.userFilterProductFinal = []
  }

  setSubcategory(subcategoryName: string) {
    this.afStorage.collection('products').ref.where('subcategoryEN', '==', subcategoryName).onSnapshot(
      collection => {
        this.userProduct = [];
        collection.forEach(document => {
          const data = document.data() as IProduct;
          const id = document.id;
          this.userProduct.push({ id, ...data })
          this.userFilterProduct.push({ id, ...data })
          this.userFilterProductFinal.push({ id, ...data })
        })
        this.countProduct = this.userProduct.length
      }
    )
  }

  openfilter() {
    this.filterOpenT = !this.filterOpenT

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
      const index = this.filterUser.findIndex(elem => elem.filterBy == filter.filterBy)
      if (index != -1) {
        this.filterUser.splice(index, 1);
        this.userFilterProduct = this.userProduct
      }
      this.filterUser.push(filter)
    }
    this.filterUser.forEach((myFilter) => {
      this.userFilterProductFinal = []
      this.userFilterProduct.filter(elem => elem.compability.toLowerCase() == myFilter.filterDetails.toLowerCase()
        || elem.color.toString() == myFilter.filterDetails.toLowerCase()
        || elem.material.toString() == myFilter.filterDetails.toLowerCase()
        || elem.additional.toString() == myFilter.filterDetails.toLowerCase() ?
        this.userFilterProductFinal.push(elem) : elem,
        this.userFilterProduct = this.userFilterProductFinal
      )
    })
    this.countProduct = this.userFilterProductFinal.length;
    this.p = 1;
  }
  // filteredBy(){
  // let forAppleWatch=[
  //   {name:'Совместимость', value:[
  //     {nameIn:'compability'},
  //     {id:['38/40mm','42/44mm']},
  //     {valueAll:['Apple Watch 38mm/40mm','Apple Watch 42mm/44mm']}
  //   ]},
  //   {name:'Материал', value:[
  //     {nameIn:'material'},
  //     {id:['silicone','siliconeNike','metal','nylon','leather']},
  //     {valueAll:['Силиконовый','Силиконовый Nike','Металлический','Нейлоновий','Кожанний']}
  //   ]},
  // ]
  // this.filterUser=forAppleWatch;
  // console.log(this.filterUser.)
  // }
  resetfilter() {
    this.userFilterProductFinal = this.userProduct
    this.userFilterProduct = this.userProduct
    this.countProduct = this.userFilterProductFinal.length;
    this.filterUser = [];
    let radios = document.querySelectorAll("input[type=radio]:checked") as any
    console.log(this.filterUser)
    for (let i = 0; i < radios.length; i++) {
      radios[i].checked = false
    }
  }
}
