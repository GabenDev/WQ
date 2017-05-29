import { Component } from '@angular/core';
import { PlaceService } from '../../providers/PlaceService';
import {MenuService} from "../../providers/MenuService";
import { Storage } from '@ionic/storage';
import {Basket} from "../../domain/basket/Basket";
import {Events} from "ionic-angular";
import {Item} from "../../domain/menu/Item";

@Component({
  selector: 'page-basket',
  templateUrl: 'basket.html',
  providers : [PlaceService, MenuService, Storage]
})
export class BasketPage {

  basket : Basket = new Basket();

  constructor(private storage: Storage, public events: Events) {

    // this.events.subscribe('order:created', (item) => {
    //   // alert('Event triggered');
    //   this.refresh();
    // });
  }

  public remove ( item : Item ) {
    this.storage.get('basket').then((response) => {
      let basket: Basket = JSON.parse(response);
      let index = this.findWithAttr(basket.items, '_id', item._id);
      let orders = basket.items[index]["orders"];
      if( orders == 1) {
        basket.items.splice(index, 1);
      } else {
        basket.items[index]["orders"] = basket.items[index]["orders"] - 1;
      }
      this.events.publish('basket:refreshCount', item);
      this.storage.set('basket', JSON.stringify(basket));
      this.basket = basket;
    })
  }

  private findWithAttr(array, attr, value) {
    if(array) {
     for(var i = 0; i < array.length; i += 1) {
       if(array[i]["item"][attr] === value) {
         return i;
       }
     }
    }
    return -1;
  }

  submit() {

  }

  ionViewDidEnter() {
    this.refresh();
  }

  // ionViewDidLoad() {
  //
  // }

  public refresh() {
    this.storage.get('basket').then((response) => {
      this.basket = JSON.parse(response);
      console.log(JSON.stringify(this.basket));
    });
  }

};
