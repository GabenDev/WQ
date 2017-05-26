import {Item} from "./Item";

export class Order {
  _id : string;
  item: Item;
  orders : Number;
  sequence : number;
  place : String;
  orderDate : Date;
  status : String;

  constructor() {
    this.orders = 0;
  }
};
