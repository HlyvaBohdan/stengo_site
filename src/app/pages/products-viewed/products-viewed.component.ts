import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-products-viewed',
  templateUrl: './products-viewed.component.html',
  styleUrls: ['./products-viewed.component.scss']
})
export class ProductsViewedComponent implements OnInit {
  productsViewed: Array<IProduct> = [];
  addBasketComplete: boolean;

  constructor(private productService: ProductService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.getViewedProducts();
  }

  private getViewedProducts() {
    this.productService.productView.subscribe((product) => {
      if (localStorage.length > 0 && localStorage.getItem('myProductViewed')) {
        this.productsViewed = JSON.parse(localStorage.getItem('myProductViewed'));
        if (this.productsViewed.some(prod => prod.id === product.id)) {
          const index = this.productsViewed.findIndex(prod => prod.id === product.id);
          this.productsViewed.splice(index, 1);
          this.productsViewed.push(product);
        }
        else {
          this.productsViewed.push(product);
        }
      }
      else {
        this.productsViewed = [];
        this.productsViewed.push(product)
      }
      localStorage.setItem('myProductViewed', JSON.stringify(this.productsViewed));
    })
  }

  addBasket(product: IProduct): void {
    this.orderService.addBasketService(product);
    if (window.innerWidth > 767) {
      this.addBasketComplete = true;
      setTimeout(() => {
        this.addBasketComplete = false;
      }, 1200)
    }
  }

}
