import { Component } from '@angular/core';
// import { NavController } from 'ionic-angular';
import { PlaceService } from '../../providers/PlaceService';
import { Observable } from "rxjs/Observable";
import {Place} from "../../domain/Place";
import {MenuService} from "../../providers/MenuService";
import {Category} from "../../domain/menu/Category";
import {Item} from "../../domain/menu/Item";
// import { Place } from "../../domain/Place";
import { Storage } from '@ionic/storage';
import {Basket} from "../../domain/basket/Basket";
import {BasketItem} from "../../domain/basket/BasketItem";

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  providers : [PlaceService, MenuService, Storage]
})
export class OrderPage {

  places : Place[];
  categories : Category[];
  items : Item[];

  selectedPlace : string;
  selectedCategory : string;
  basketItemsCount : number = 0;

  constructor(public placeService : PlaceService, private menuService : MenuService, private storage: Storage) {
    this.getPlaces();
    this.storage.set('basket', JSON.stringify(new Basket()));


  }

  public getMenu( placeId : string) {
    this.selectedPlace = placeId;
    this.menuService.getCategories(placeId).subscribe(response => {
      this.categories = response;
      console.log(JSON.stringify(response));
    });
  }

  public getItems( categoryId : string) {
    this.selectedCategory = categoryId;
    this.menuService.getItems(categoryId).subscribe(response => {
      this.items = response;
      console.log(JSON.stringify(response));
    });
  }

  public remove ( item : Item ) {
    this.storage.get('basket').then((response) => {
      let basket: Basket = JSON.parse(response);

      this.basketItemsCount = basket.items.length;
      this.storage.set('basket', JSON.stringify(basket));
    })
  }

  public order( item : Item) {
    this.storage.get('basket').then((response) => {
      let basket : Basket = JSON.parse(response);
      console.log(basket.items.length);
      basket.items.filter(x => x.item._id === item._id)
        .map(x => function(x) {
          console.log(x);
          // if(x.orders && x.orders > 1) {
          //   x.orders++;
          // } else {
          //   basket.items.push(new BasketItem(item, 1));
          // }
        });
      this.basketItemsCount = this.basketItemsCount++;
      this.storage.set('basket', JSON.stringify(basket));
    });
  }

  public getPlaces() {
    this.placeService.getPlaces().subscribe(response => {
      this.places = response;
      console.log(JSON.stringify(response));
    });
  }

  handleError(error) {
    console.error(error);
    alert("Error: " + error);
    return Observable.throw(error.json().error || 'Server error');
  }
};
