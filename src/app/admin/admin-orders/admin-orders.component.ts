import { Component, OnInit, TemplateRef } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { Order } from 'src/app/shared/models/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  adminOrders: Array<IOrder> = [];
  orderDetails: Array<IProduct>;
  nameOrder: string;
  reverse: boolean = false;
  order: string = 'status';
  modalRef: BsModalRef;
  orderId: number;
  orderUserName: string;
  orderUserLastName: string;
  orderEmail: string;
  orderPhone: string;
  orderMethodOfDelivery: string;
  orderPayment: number
  orderData: string;
  orderStatus: string;
  orderComplete: IOrder;
  orderView: boolean;
  editStatus: boolean;


  constructor(
    private modalService: BsModalService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.getOrders()
  }
  private getOrders(): void {
    this.orderService.getFirecloudOrders().subscribe(collection => {
      this.adminOrders = collection.map(order => {
        const data = order.payload.doc.data() as IOrder;
        const id = order.payload.doc.id;
        return { id, ...data };
      });
    }
    );
  }
  openDetailsModal(order: IOrder, template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      { class: 'modal-dialog-centered modal-order' });
    this.orderId = order.id;
    this.orderUserName = order.userName;
    this.orderUserLastName = order.userLastName;
    this.orderPhone = order.userPhone;
    this.orderEmail = order.userEmail;
    this.orderMethodOfDelivery = order.userMethodOfDelivery;
    this.orderDetails = order.ordersDetails;
    this.orderPayment = order.totalPayment;
    this.orderData = order.dateOrder;
    this.orderStatus = order.status;
    this.editStatus = true;
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  changeOrderStatus(status: boolean): void {
    status == true ? this.orderStatus = 'Прийнято' : this.orderStatus = 'Відхилено';
    this.editOrder()
    this.modalService.hide(1);
    this.editStatus = false;
  }
  completeOrder(order: IOrder): void {
    order.status = 'Завершено';
    this.orderComplete = order;
    this.editOrder()
  }

  deleteOrder(order: IOrder): void {
    this.orderService.deleteFirecloudOrder(order.id);
  }

  deleteProductOrder(product: IProduct): void {
    if (confirm('Are you sure?')) {
      const index = this.orderDetails.findIndex(ord => ord.id === product.id)
      this.orderDetails.splice(index, 1);
      this.getTotal()
      this.editOrder()
    }
  }

  private editOrder(comment?: string) {
    let order: IOrder;
    if (this.editStatus) {
      order = new Order(this.orderId,
        this.orderUserName,
        this.orderUserLastName,
        this.orderPhone,
        this.orderEmail,
        this.orderMethodOfDelivery,
        this.orderDetails,
        this.orderPayment,
        this.orderData,
        this.orderStatus,
        this.orderView);
    }
    else {
      order = this.orderComplete;
    }
    this.orderService.updateFirecloudOrder(Object.assign({}, order));
    if (this.orderPayment == 0) {
      alert('Замовлення пусте і буде автоматично видалено!')
      this.deleteOrder(order)
      this.modalService.hide(1);
    }
    if (comment == 'hideModal') {
      this.modalService.hide(1);
    }
  }
  productCount(product: IProduct, status: boolean): void {
    if (status) {
      product.count++;
    }
    else {
      if (product.count > 1) {
        product.count--;
      }
    }
    this.getTotal();

  }
  private getTotal(): void {
    this.orderPayment = this.orderDetails.reduce((total, elem) => {
      return total + (elem.price * elem.count);
    }, 0)
  }
}
