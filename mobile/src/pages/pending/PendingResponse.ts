import {Order} from "../../domain/menu/Order";

export class PendingResponse {
  sequence : number;
  items : Order[] = [];

  constructor(order : Order) {
    this.items.push(order);
    this.sequence = order.sequence;
  }
};
