import { Component, OnInit, TemplateRef } from '@angular/core';
import { ICoupon } from '../../shared/interfaces/coupon.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Coupon } from '../../shared/models/coupon.model';
import { OrderService } from 'src/app/shared/services/order.service';


@Component({
  selector: 'app-admin-coupons',
  templateUrl: './admin-coupons.component.html',
  styleUrls: ['./admin-coupons.component.scss']
})
export class AdminCouponsComponent implements OnInit {
  adminCoupon: Array<ICoupon> = [];
  modalRef: BsModalRef;
  codeID = 1;
  code: string;
  percent: number;
  checkInput: boolean;
  reverse: boolean = false;
  coupon: string = 'percent';

  constructor(private modalService: BsModalService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.adminFirebaseCoupons()
  }
  private adminFirebaseCoupons(): void {
    this.orderService.getFirecloudCoupon().subscribe(
      collection => {
        this.adminCoupon = collection.map(category => {
          const data = category.payload.doc.data() as ICoupon;
          const id = category.payload.doc.id;
          return { id, ...data };
        })
      }
    )
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  addCoupon() {
    const newCoupon = new Coupon(this.codeID, this.code, this.percent);
    delete newCoupon.id;
    this.orderService.postFirecloudCoupon(Object.assign({}, newCoupon));
    this.resetModel();
  }
  deleteCoupon(index): void {
    if (confirm('Are you sure?')) {
      this.orderService.deleteFirecloudCoupon(index)
      this.modalService.hide(1);
    }
  }
  checkInputs(): void {
    if (this.code == '' || this.percent == undefined) {
      this.checkInput = false
    }
    else {
      this.checkInput = true
    }
  }
  setCoupon(value: string) {
    if (this.coupon === value) {
      this.reverse = !this.reverse;
    }
    this.coupon = value;
  }
  resetModel() {
    this.modalService.hide(1);
    this.code = '';
    this.percent = undefined;
    this.codeID = 1;
  }

}
