import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slideIndex = 0;
  topProducts: Array<IProduct> = []
  p: number = 1;
  mySlider;
  addBasketComplete: boolean;
  constructor(
    private afStorage: AngularFirestore,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.slider();
    this.getTopProducts()
  }

  private getTopProducts() {
    this.afStorage.collection('products').ref.where('top', '==', true).onSnapshot(
      collection => {
        this.topProducts = [];
        collection.forEach(document => {
          const data = document.data() as IProduct;
          const id = document.id;
          this.topProducts.push({ id, ...data })
        })
      }
    )
  }

  private slider(): any {
    let i: number;
    let slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    this.slideIndex++;
    if (this.slideIndex > slides.length) { this.slideIndex = 1 }
    slides[this.slideIndex - 1].style.display = "block";
    this.mySlider = setTimeout(() => { this.slider() }, 4000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.mySlider);
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
  scrollTo(target:HTMLElement): void{
    target.scrollIntoView()
}
}
