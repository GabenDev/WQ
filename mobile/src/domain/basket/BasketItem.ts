import {Item} from "../menu/Item";
export class BasketItem {
  item : Item;
  orders : number;

  constructor(item : Item, orders : number) {
    this.item = item;
    this.orders = orders;
  }
}
