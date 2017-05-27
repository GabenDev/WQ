import { Component } from '@angular/core';
import { MenuService } from "../../providers/MenuService";
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {PendingResponse} from "../pending/PendingResponse";

@Component({
  selector: 'page-ready',
  templateUrl: 'done.html'
})
export class ReadyPage {

  selectedPlace : String;
  pendingItems : PendingResponse[] = [];

  constructor(private menuService : MenuService, public events: Events, private storage: Storage) {

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

  ionViewDidEnter() {
    this.refresh();
  }

}
