import { Component } from '@angular/core';
import { MenuService } from "../../providers/MenuService";
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {PendingResponse} from "./PendingResponse";

@Component({
  selector: 'page-pending',
  templateUrl: 'pending.html'
})
export class PendingPage {

  selectedPlace : String;
  pendingItems : PendingResponse[] = [];

  private myWebSocket = new WebSocket("ws://localhost:9090");

  constructor(private menuService : MenuService, public events: Events, private storage: Storage) {
    this.refresh();
    this.myWebSocket.onmessage = function(evt) {
      events.publish('order:new', evt);
    };

    this.events.subscribe('order:new', (item) => {
      this.refresh();
    });
  }

  public done(sequence : number) {
    this.menuService.orderDone(this.selectedPlace, sequence).subscribe(response => {
      let index : number = this.menuService.findByAttr(this.pendingItems, "sequence", sequence);
      this.pendingItems.splice(index, 1);
    });
  }

  private refresh() {
    this.storage.get('selectedPlace').then((response) => {
      this.selectedPlace = response;
      if(this.selectedPlace) {
        this.pendingItems = [];

        //this.menuService.getPendingOrders(this.selectedPlace).subscribe(response => {
        //  for(var i = 0; i<response.length; i++) {
        //    let index : number = this.menuService.findByAttr(this.pendingItems, "sequence", response[i].sequence);
        //    if(index == -1) {
        //          this.pendingItems.push(new PendingResponse(response[i]));
        //    } else {
        //      this.pendingItems[index].items.push(response[i]);
        //    }
        //  }
        //  console.log(JSON.stringify(this.pendingItems));
        //});
      }
    });
  }
}
