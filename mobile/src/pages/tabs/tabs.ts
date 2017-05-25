import { Component } from '@angular/core';

import { OrderPage } from '../order/order';
import { LoginPage } from '../login/login';
import { BasketPage } from '../basket/basket';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root : any = LoginPage;
  tab2Root : any = OrderPage;
  tab3Root : any = BasketPage;
  constructor() {

  }
}
