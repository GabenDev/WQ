import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Category} from "../domain/menu/Category";
import {Item} from "../domain/menu/Item";

@Injectable()
export class MenuService {
  baseUrl = "http://gaben.gleeze.com:8100/api/menu"

  constructor(public http: Http) {
    console.log('MenuService initialized');
  }

  // place/:placeId
  public getCategories(placeId : string) : Observable<Category[]> {
    return this.http.get(this.baseUrl + "/place/" + placeId, this.jwt())
      .map(res => res.json())
      .catch(this.handleError);
  }

  // category/:categoryId
  public getItems(categoryId : string) : Observable<Item[]> {
    return this.http.get(this.baseUrl + "/category/" + categoryId, this.jwt())
      .map(res => res.json())
      .catch(this.handleError);
  }


// {
//   "place" : "59245f209791c610ca9111a8",
//   "orders" : [
//     { "item" : "592535469c0a0b38b2de4df7", "orders" : 2},
//     { "item" : "592535469c0a0b38b2de4df8", "orders" : 5}
//     ]
// }

  public order() {
    
  }


  handleError(error) {
    console.error(error);
    alert("Error: " + error);
    return Observable.throw(error.json().error || 'Server error');
  }

  public jwt() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return new RequestOptions({ headers: headers });
  }
}
