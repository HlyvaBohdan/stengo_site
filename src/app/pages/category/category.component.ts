import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  mainCategory: ICategory;
  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private afStorage: AngularFirestore
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const categoryName = this.actRoute.snapshot.paramMap.get('category')
        this.setCategory(categoryName)
      }
    })
  }

  ngOnInit(): void {
  }

  private setCategory(categoryName: string) {
    this.afStorage.collection('categories').ref.where('nameEN', '==', categoryName).onSnapshot(
      collection => {
        collection.forEach(document => {
          const data = document.data() as ICategory;
          const id = document.id;
          this.mainCategory = ({ id, ...data })
        });
      }
    )
  }
}
