import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Category} from "../domain/menu/Category";
import {Item} from "../domain/menu/Item";
import {Basket} from "../domain/basket/Basket";
import {BasketItem} from "../domain/basket/BasketItem";
import {Order} from "../domain/menu/Order";

@Injectable()
export class MenuService {
  baseUrl = "http://gaben.gleeze.com:8100/api/menu"
  orderUrl = "http://gaben.gleeze.com:8100/api/order"
  basket : Basket = new Basket();

  selectedPlace : String;
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

  public setPlace(placeId : String) {
    this.selectedPlace = placeId;
    this.basket.place = this.selectedPlace;
  }

  public getPlace() {
    return this.selectedPlace;
  }

  public putIntoBasket( item : Item) {
    if(!item.orders) {
      item.orders = 1;
    } else {
      item.orders += 1;
    }
    let index = this.findWithAttr(this.basket.items, '_id', item._id);
    if( index == -1) {
      this.basket.items.push(new BasketItem(item, 1));
    } else {
      this.basket.items[index]["orders"] = this.basket.items[index]["orders"] + 1;
    }
  }

  public removeFromBasket(item : Item) {
    item.orders -= 1;
    let index = this.findWithAttr(this.basket.items, '_id', item._id);
    this.basket.items[index]["orders"] = this.basket.items[index]["orders"] - 1;

    if(item.orders == 0) {
      this.basket.items.splice(index, 1);
    }
  }

  public getBasketItemCount() {
    let count = 0;
    for(var i = 0; i < this.basket.items.length; i += 1) {
      count += this.basket.items[i].orders;
    }
    return count;
  }

  public findByAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  private findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i]["item"][attr] === value) {
        return i;
      }
    }
    return -1;
  }

// {
//   "place" : "59245f209791c610ca9111a8",
//   "orders" : [
//     { "_id" : "592535469c0a0b38b2de4df7", "orders" : 2},
//     { "_id" : "592535469c0a0b38b2de4df8", "orders" : 5}
//     ]
// }
  public order() {
    console.log(JSON.stringify(this.basket));
    let request = this.http.post(this.orderUrl, JSON.stringify(this.basket), this.jwt())
      .map(res => res.json())
      .catch(this.handleError);
    this.basket = new Basket();
    return request;
  }

  public orderDone(place : String, sequence : number) {
    return this.http.post(this.orderUrl + "/done", {
      "placeId" : place,
      "sequence" : sequence
    }, this.jwt())
      .map(res => res.json())
      .catch(this.handleError);
  }

  public getPendingOrders(placeId : String) : Observable<Order[]> {
    return this.http.get(this.orderUrl + "/" + placeId + "/status/pending", this.jwt())
      .map(res => res.json())
      .catch(this.handleError);
  }

  public getReadyOrders(placeId : String) : Observable<Order[]> {
    return this.http.get(this.orderUrl + "/" + placeId + "/status/done", this.jwt())
      .map(res => res.json())
      .catch(this.handleError);
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
