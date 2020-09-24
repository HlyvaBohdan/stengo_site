import { ICategory } from "../interfaces/category.interface";

export class Category implements ICategory {
    constructor(
        public id: number,
        public nameEN: string,
        public nameUA: string,
        public image: string,
        public subcategory:any= [],
    ) {}
}