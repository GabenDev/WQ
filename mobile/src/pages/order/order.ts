import { Component } from '@angular/core';
// import { NavController } from 'ionic-angular';
import { PlaceService } from '../../providers/PlaceService';
import { Observable } from "rxjs/Observable";
import {Place} from "../../domain/Place";
import {MenuService} from "../../providers/MenuService";
import {Category} from "../../domain/menu/Category";
import {Item} from "../../domain/menu/Item";
// import { Place } from "../../domain/Place";

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  providers : [PlaceService, MenuService]
})
export class OrderPage {

  places : Place[];
  categories : Category[];
  items : Item[];

  selectedPlace : string;
  selectedCategory : string;

  constructor(public placeService : PlaceService, private menuService : MenuService) {
    this.getPlaces();
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

  public order( itemId : string) {
    alert(itemId + ' added to the basket ');
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
