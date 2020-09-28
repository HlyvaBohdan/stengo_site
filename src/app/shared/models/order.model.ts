import { IOrder } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';
export class Order implements IOrder {
    constructor(public id: number,
        public userName: string,
        public userLastName: string,
        public userPhone: string,
        public userEmail: string,
        public userMethodOfDelivery: string,
        public ordersDetails: Array<IProduct>,
        public totalPayment: number,
        public dateOrder: string,
        public status: string = 'В обробці') { }
}