import { Component } from '@angular/core';

import { OrderPage } from '../order/order';
// import { LoginPage } from '../login/login';
// import { BasketPage } from '../basket/basket';
import {PendingPage} from "../pending/pending";
import {ReadyPage} from "../done/done";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // tab1Root : any = LoginPage;
  tab1Root : any = OrderPage;
  tab2Root : any = PendingPage;
  tab3Root : any = ReadyPage;

  constructor() {

  }
}
