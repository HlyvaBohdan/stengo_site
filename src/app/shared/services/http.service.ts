import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url: string;
  constructor(private http: HttpClient) {
    this.url = 'https://api.novaposhta.ua/v2.0/json/'
  }
  postData(city: string, department?: string) {
    let data;
    if (!department) {
      data = {
        "apiKey": "fa035845708397d222eb1525f510c2f3",
        "modelName": "Address",
        "calledMethod": "searchSettlements",
        "methodProperties": {
          "CityName": city,
          "Limit": 5
        }
      }
    }
    else {
      data = {
        "modelName": "AddressGeneral",
        "calledMethod": "getWarehouses",
        "methodProperties": {
          "SettlementRef": department
        },
        "apiKey": "fa035845708397d222eb1525f510c2f3"
      }
    }
    return this.http.post(this.url, data)
  }
}
