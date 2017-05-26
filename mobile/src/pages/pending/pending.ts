import { Component } from '@angular/core';
import { PlaceService } from '../../providers/PlaceService';
import { MenuService } from "../../providers/MenuService";
import { Storage } from '@ionic/storage';
import { Events } from "ionic-angular";

@Component({
  selector: 'page-pending',
  templateUrl: 'pending.html',
  providers : [PlaceService, MenuService, Storage]
})
export class PendingPage {

  constructor(private storage: Storage, public events: Events) {

  }

};
