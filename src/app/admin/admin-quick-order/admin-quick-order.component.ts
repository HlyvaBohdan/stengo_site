import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { IQuickorder } from '../../shared/interfaces/quickorder.interface ';

@Component({
  selector: 'app-admin-quick-order',
  templateUrl: './admin-quick-order.component.html',
  styleUrls: ['./admin-quick-order.component.scss']
})
export class AdminQuickOrderComponent implements OnInit {
  quickOrders: Array<IQuickorder>;
  reverse: boolean = false;
  quickorder: string = 'phone';
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.adminFirebaseQuickOrders()
  }
  private adminFirebaseQuickOrders(): void {
    this.orderService.getFirecloudQuickOrder().subscribe(
      collection => {
        this.quickOrders = collection.map(order => {
          const data = order.payload.doc.data() as IQuickorder;
          const id = order.payload.doc.id;
          return { id, ...data };
        });
      }
    );
  }
  deleteQuickOrder(index): void {
    if (confirm('Are you sure?')) {
      this.orderService.deleteFirecloudQuickOrder(index)
    }
  }
  setOrder(value: string) {
    if (this.quickorder === value) {
      this.reverse = !this.reverse;
    }
    this.quickorder = value;
  }

}
