import { IProduct } from './product.interface';

export interface ISubcategory{
    id: number;
    nameEN: string;
    nameUA: string;
    categoryName: string;
    image: string;
    products?: Array<IProduct>;

}