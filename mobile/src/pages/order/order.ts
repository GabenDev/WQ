import { Component } from '@angular/core';
import { PlaceService } from '../../providers/PlaceService';
import { Observable } from "rxjs/Observable";
import {Place} from "../../domain/Place";
import {MenuService} from "../../providers/MenuService";
import {Category} from "../../domain/menu/Category";
import {Item} from "../../domain/menu/Item";
import { Storage } from '@ionic/storage';
import {Basket} from "../../domain/basket/Basket";
import {BasketItem} from "../../domain/basket/BasketItem";
import { BasketPage } from "../basket/basket";
import {NavController} from "ionic-angular";
import { Events } from 'ionic-angular';

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

  basket : Basket = new Basket();

  constructor(public placeService : PlaceService, private menuService : MenuService, private storage: Storage, public nav : NavController, public events: Events) {
    this.init();

      this.events.subscribe('basket:refreshCount', (item) => {
        this.basketItemsCount = -1;
        this.storage.get('basket').then((response) => {
          let basket: Basket = JSON.parse(response);
          for (var i = 0; i < basket.items.length; i++) {
            this.basketItemsCount += basket.items[i].orders;
          }
      });
    });
  }

  public init() {
    this.selectedPlace = "";
    this.selectedCategory = "";
    this.getPlaces();
    this.storage.set('basket', JSON.stringify(new Basket()));
  }

  public getMenu( placeId : string) {
    this.selectedCategory = "";
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

  public submitOrder() {
    alert('Order submitted');
  }

  public toBasket() {
    this.nav.push(BasketPage);
  }

  public remove(item : Item) {
      item.orders -= 1;
      this.basketItemsCount = this.basketItemsCount-1;
  }

  public order( item : Item) {
    if(!item.orders) {
      item.orders = 1;
    } else {
      item.orders += 1;
    }


    this.basketItemsCount = this.basketItemsCount+1;
    // this.storage.get('basket').then((response) => {
    //   let basket : Basket = JSON.parse(response);
      let index = this.findWithAttr(this.basket.items, '_id', item._id);
      if( index == -1) {
        this.basket.items.push(new BasketItem(item, 1));
      } else {
        this.basket.items[index]["orders"] = this.basket.items[index]["orders"] + 1;
      }


    //   console.log(JSON.stringify(basket));
    //   this.storage.set('basket', JSON.stringify(basket));
    //   this.events.publish('order:created', item);
    // });
  }

  private findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i]["item"][attr] === value) {
        return i;
      }
    }
  return -1;
  }

  // private findObjectWithAttr(array, item, property, value) {
  //   for(var i = 0; i < array.length; i += 1) {
  //     if(array[i][item][property] === value) {
  //       return array[i];
  //     }
  //   }
  // return -1;
  // }


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


  // basket.items.filter(x => x.item._id === item._id)
  //   .map(x => function(x) {
  //     itemInArray = true;
  //     this.basketItemsCount = this.basketItemsCount+1;
  //     x.orders = x.orders + 1;
  //     this.storage.set('basket', JSON.stringify(basket));
  //   });

};
