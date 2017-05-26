import { Component } from '@angular/core';
import { MenuService } from "../../providers/MenuService";

@Component({
  selector: 'page-pending',
  templateUrl: 'pending.html',
  providers : [MenuService]
})
export class PendingPage {



  constructor(private menuService : MenuService) {

  }



}
