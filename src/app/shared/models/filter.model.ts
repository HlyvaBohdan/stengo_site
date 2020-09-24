import { IFilter } from "../interfaces/filter.interface";

export class Filter implements IFilter{
    constructor(
        // public id: number,
        public filterBy: string,
      public  filterDetails: string
    ) {}
}