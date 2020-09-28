import { IFilter } from "../interfaces/filter.interface";

export class Filter implements IFilter {
  constructor(
    public filterBy: string,
    public filterDetails: string
  ) { }
}