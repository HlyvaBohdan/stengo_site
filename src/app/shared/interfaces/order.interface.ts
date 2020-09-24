import { IProduct } from '../interfaces/product.interface';
export interface IOrder{
    id: number;
    userName: string;
    userLastName: string;
    userPhone: string;
    userEmail?: string;
    userMethodOfDelivery: string;
    ordersDetails: Array<IProduct>;
    totalPayment: number;
    dateOrder: string;
    status: string;
}