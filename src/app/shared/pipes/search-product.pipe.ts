import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';

@Pipe({
  name: 'searchProduct'
})
export class SearchProductPipe implements PipeTransform {

  transform(adminProduct:Array<IProduct>, nameProduct:string): unknown {
    if (!adminProduct) {
      return null;
    }
    if (!nameProduct) {
      return adminProduct;
    }
    return adminProduct.filter(elem => elem.nameUA.toLowerCase().includes(nameProduct.toLowerCase())
    || elem.id.toString().includes(nameProduct.toLowerCase())
      || elem.subcategory.toLowerCase().includes(nameProduct.toLowerCase())
        || elem.category.toLowerCase().includes(nameProduct.toLowerCase())
          || elem.compability.toLowerCase().includes(nameProduct.toLowerCase())
          || elem.price.toString().includes(nameProduct.toLowerCase())
      )
  }

}
