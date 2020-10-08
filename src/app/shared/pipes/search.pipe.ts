import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from "src/app/shared/interfaces/category.interface";

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(subcategories: Array<ICategory>, nameCategory: string): unknown {
    if (!subcategories) {
      return null;
    }
    if (!nameCategory) {
      return subcategories;
    }
    return subcategories.filter(elem => elem.nameEN.toLowerCase().includes(nameCategory.toLowerCase())
      || elem.nameUA.toLowerCase().includes(nameCategory.toLowerCase())
    )
  }

}
