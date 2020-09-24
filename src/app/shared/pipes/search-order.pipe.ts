import { Pipe, PipeTransform } from '@angular/core';
import { IOrder } from '../interfaces/order.interface';

@Pipe({
  name: 'searchOrder'
})
export class SearchOrderPipe implements PipeTransform {

  transform(adminOrders: Array<IOrder>, nameOrder:string): unknown {
    if (!adminOrders) {
      return null;
    }
    if (!nameOrder) {
      return adminOrders;
    }
    return adminOrders.filter(elem => elem.userPhone.toString().includes(nameOrder.toLowerCase())
    || elem.id.toString().includes(nameOrder.toLowerCase())
      || elem.totalPayment.toString().includes(nameOrder.toLowerCase())
        || elem.status.toLowerCase().includes(nameOrder.toLowerCase())
          || elem.dateOrder.toString().includes(nameOrder.toLowerCase())
      )
  }

}
