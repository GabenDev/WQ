import { Component } from '@angular/core';
// import { NavController } from 'ionic-angular';
import { UserService } from '../../providers/UserService';
// import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
// import { LoginPage } from '../login/login';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  providers : [UserService]
})
export class OrderPage {
  userName : string = 'Gabor Fekete';
  
  constructor() {
  }

  public loggedInUser() {
    alert('OK');
    // alert(this.loginPage.authenticatedUser.firstName);
    // return this.loginPage.authenticatedUser;
  }

  handleError(error) {
    console.error(error);
    alert("Error: " + error);
    return Observable.throw(error.json().error || 'Server error');
  }
};
