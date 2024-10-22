import { IProduct } from '../interfaces/product.interface';
export interface IOrder{
    id: number;
    userName: string;
    userLastName: string;
    userPhone: string;
    userEmail?: string;
    userMethodOfDelivery: any;
    ordersDetails: Array<IProduct>;
    totalPayment: number;
    dateOrder: string;
    status?: string;
    view?:boolean;
}