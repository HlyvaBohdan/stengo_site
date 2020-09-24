import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from "src/app/shared/interfaces/category.interface";

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(adminCategory: Array<ICategory>, nameCategory: string): unknown {
    if (!adminCategory) {
      return null;
    }
    if (!nameCategory) {
      return adminCategory;
    }
    return adminCategory.filter(elem => elem.nameEN.toLowerCase().includes(nameCategory.toLowerCase())
      || elem.nameUA.toLowerCase().includes(nameCategory.toLowerCase())
    )
  }
  
}
