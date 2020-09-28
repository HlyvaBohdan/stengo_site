import { IProduct } from '../interfaces/product.interface';
import { ICategory } from '../interfaces/category.interface';
import { ISubcategory } from '../interfaces/subcategory.interface';

export class Product implements IProduct {
    constructor(
        public id: number,
        public category: string,
        public subcategory: string,
        public subcategoryEN: string,
        public nameEN: string,
        public nameUA: string,
        public description: string,
        public compability: string,
        public color: string,
        public secondColor: string,
        public material: string,
        public additional: string,
        public oldPrice: number = null,
        public price: number,
        public top: boolean,
        public sale: boolean,
        public image: string,
        public imageAdd: string,
        public statusWish: boolean = false,
        public count: number = 1,
    ) { }
}
