import { Component } from '@angular/core';

import { OrderPage } from '../order/order';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab2Root: any = LoginPage;
  tab1Root: any = OrderPage;
  constructor() {

  }
}
