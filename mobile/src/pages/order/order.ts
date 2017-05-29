import { Component } from '@angular/core';
import { PlaceService } from '../../providers/PlaceService';
import { Observable } from "rxjs/Observable";
import { Place } from "../../domain/Place";
import { MenuService } from "../../providers/MenuService";
import { Category } from "../../domain/menu/Category";
import { Item } from "../../domain/menu/Item";
import { Storage } from '@ionic/storage';
import { Basket } from "../../domain/basket/Basket";
import { BasketPage } from "../basket/basket";
import { NavController } from "ionic-angular";
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {UserService} from "../../providers/UserService";


@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  providers : [PlaceService, MenuService, Storage]
  // providers: [ MenuService ]
})
export class OrderPage {

  places : Place[];
  categories : Category[] = [];
  items : Item[];

  selectedPlace : string;
  selectedCategory : string;
  basketItemsCount : number = 0;

  constructor(public userService : UserService, public placeService : PlaceService, private menuService : MenuService, private storage: Storage, public nav : NavController, public events: Events, public toastCtrl: ToastController) {
      this.events.subscribe('basket:refreshCount', (item) => {
        this.basketItemsCount = -1;
        this.storage.get('basket').then((response) => {
          let basket: Basket = JSON.parse(response);
          for (var i = 0; i < basket.items.length; i++) {
           this.basketItemsCount += basket.items[i].orders;
          }
        });
      });

      this.init();
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
    this.menuService.setPlace(placeId);
    this.storage.set('selectedPlace', placeId);

    if(this.categories.length == 0) {
     this.menuService.getCategories(placeId).subscribe(response => {
       this.categories = response;
       console.log(JSON.stringify(response));
     });
    }
  }

  public getItems( categoryId : string) {
    this.selectedCategory = categoryId;
    this.menuService.getItems(categoryId).subscribe(response => {
      this.items = response;
      for(var i = 0; i< this.menuService.basket.items.length; i++) {
       let index = this.menuService.findByAttr(this.items, "_id", this.menuService.basket.items[i].item._id);
       if(index != -1) {
         this.items[index].orders = this.menuService.basket.items[i].item.orders;
       }
      }
    });
  }

  private printBasket() {
    for(var i = 0; i< this.menuService.basket.items.length; i++) {
     let item = this.menuService.basket.items[i].item;
     console.log(item._id + " - " + item.name + " - " + item.orders);
    }
  }

  public submitOrder() {
    this.menuService.order().subscribe(response => {
      this.getMenu( this.selectedPlace );
      this.basketItemsCount = 0;
      this.presentToast(response.orders);
    });
  };

  presentToast(order : Number) {
    let toast = this.toastCtrl.create({
      message: 'Order with number ' + order + ' has successfully created. ',
      duration: 3000
    });
    toast.present();
  }

  public toBasket() {
    this.nav.push(BasketPage);
  }

  public remove(item : Item) {
      this.menuService.removeFromBasket(item);
      this.basketItemsCount = this.menuService.getBasketItemCount();
      this.printBasket();
  }

  public order( item : Item) {
    this.menuService.putIntoBasket(item);
    this.basketItemsCount = this.menuService.getBasketItemCount();
    this.printBasket();
  }

  public getPlaces() {
    console.log("getPlaces access token: " + this.userService.getAccessToken());
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
