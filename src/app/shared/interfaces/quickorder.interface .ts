import { IProduct } from '../interfaces/product.interface';
export interface IQuickorder{
    id: number;
    phone: string;
    product: IProduct;
    dateOrder:string,
}