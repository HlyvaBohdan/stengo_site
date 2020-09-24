import { ICoupon } from "../interfaces/coupon.interface";

export class Coupon implements ICoupon {
    constructor(
        public id: number,
        public code: string,
        public percent: number,
    ) {}
}