import { IProduct } from './product.interface';
export interface IUser{
    idAuth: string;
    firstName: string;
    orders: any;
    role: string;
    email: string;
    phone: string;
    wishList?: Array<IProduct>;
    
}