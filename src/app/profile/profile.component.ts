import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';
import { IUser } from '../shared/interfaces/user.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  viewDetails: boolean;
  userEmail: string;
  userName: string;
  userNameLast: string;
  userPhone: string;
  userOrder: any;
  userId: any;
  userRole: string;
  findUserID: any;
  checkOrderStatus: Array<IProduct> = [];
  constructor(private authService: AuthService,
    private firestore: AngularFirestore,
    private productService: ProductService,) { }

  ngOnInit(): void {
    localStorage.removeItem('myProduct');
    this.getUserData()
    this.updateOrderStatus()
  }

  private getUserData(): void {
    const user = JSON.parse(localStorage.getItem('user'))
    this.userEmail = user.email;
    this.userName = user.firstName;
    this.userPhone = user.phone;
    this.userId = user.idAuth
    this.userRole = user.role
    this.userOrder = user.orders;
  }

  signOut(): void {
    this.authService.signOut();
    this.productService.productWish.next('')
  }

  async updateUser() {
    localStorage.removeItem('user');
    let user: IUser;
    user = new User(
      this.userId,
      this.userName,
      this.userOrder,
      this.userRole,
      this.userEmail,
      this.userPhone);
    localStorage.setItem('user', JSON.stringify(user));
    this.firestore.collection('users').ref.where('idAuth', '==', this.userId).onSnapshot(
      collection => {
        collection.forEach(document => {
          const data = document.data() as IUser;
          const id = document.id;
          this.findUserID = ({ id, ...data })
        })
      },
    )
    if (await this.findUserID) {
      this.firestore.collection('users').doc(this.findUserID.id).update(Object.assign({}, user));
    }
  }

  updateOrderStatus(): void {
    for (let i = 0; i < this.userOrder.length; i++) {
      this.firestore.collection('orders').ref.where('dateOrder', '==', this.userOrder[i].dateOrder).onSnapshot(
        collection => {
          collection.forEach(document => {
            const data = document.data() as IProduct;
            const id = document.id;
            this.checkOrderStatus.push({ id, ...data })
          });
        })
    }
    this.userOrder = this.checkOrderStatus;
  }

  viewDetailsOrder() {
    this.viewDetails = !this.viewDetails
  }
  
}

