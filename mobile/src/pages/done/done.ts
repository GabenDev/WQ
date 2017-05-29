import { Component } from '@angular/core';
import { MenuService } from "../../providers/MenuService";
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {PendingResponse} from "../pending/PendingResponse";
import {Order} from "../../domain/menu/Order";

@Component({
  selector: 'page-ready',
  templateUrl: 'done.html'
})
export class ReadyPage {

  selectedPlace : String;
  pendingItems : PendingResponse[] = [];

  myWebSocket = new WebSocket("ws://gaben.gleeze.com:9090");

  constructor(private menuService : MenuService, public events: Events, private storage: Storage) {
    this.refresh();
    this.myWebSocket.onmessage = function(item) {
      alert('Message arrived: ' + item.data);
      // let order : Order = JSON.parse(item.data);
      events.publish('order:done', item);
    };

    this.events.subscribe('order:done', (item) => {
      alert('Message arrived: ' + item.item.name);
      // this.pendingItems.unshift(new PendingResponse(order));
    });
  }

  private refresh() {
    this.storage.get('selectedPlace').then((response) => {
      this.selectedPlace = response;
      if(this.selectedPlace) {
        this.pendingItems = [];

        this.menuService.getReadyOrders(this.selectedPlace).subscribe(response => {
         for(var i = 0; i<response.length; i++) {
           let index : number = this.menuService.findByAttr(this.pendingItems, "sequence", response[i].sequence);
           console.log("pendingItems: " + JSON.stringify(response[i].sequence) + " ---- " + index);
               if(index == -1) {
                 this.pendingItems.push(new PendingResponse(response[i]));
           } else {
             this.pendingItems[index].items.push(response[i]);
           }
         }
         console.log(JSON.stringify(this.pendingItems));
        });
      }
    });
  }

  // ionViewDidEnter() {
  //   this.refresh();
  // }

}
