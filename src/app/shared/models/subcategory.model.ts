import { ISubcategory } from "../interfaces/subcategory.interface";
import { IProduct } from '../interfaces/product.interface';

export class Subcategory implements ISubcategory {
    constructor(
        public id: number,
        public nameEN: string,
        public nameUA: string,
        public categoryName: string,
        public image: string,
        public products: Array<IProduct> = [],
    ) { }
}