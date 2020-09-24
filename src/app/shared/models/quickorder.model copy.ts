import { IQuickorder } from "../interfaces/quickorder.interface ";
import { IProduct } from "../interfaces/product.interface";

export class Quickorder implements IQuickorder {
    constructor(
        public id: number,
        public phone: string,
        public product: IProduct,
        public dateOrder:string,
    ) {}
}