import { IUser } from '../interfaces/user.interface';
import { IProduct } from '../interfaces/product.interface';
export class User implements IUser {
    constructor(public idAuth: any,
    public firstName: string,
    public orders: any,
    public role: string,
    public email: string,
        public phone: string,
    public wishList:Array<IProduct>=[]) { }
}