import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../providers/UserService';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { User } from '../../domain/user'
import { OrderPage } from '../order/order';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers : [UserService]
})
export class LoginPage {

  authenticatedUser : User = new User();

  constructor(private userService : UserService, public http: Http, public nav : NavController) {
  }

  public logout() {
    this.authenticatedUser = new User();
  }

  public login() {
    this.userService.authenticate(this.authenticatedUser).subscribe(response => {
        if(response) {
            this.authenticatedUser = response;
            alert('Authentication succeded !');
        } else {
          alert('Authentication failed !');
        }
    });
    this.nav.push(OrderPage);
  }

  handleError(error) {
    console.error(error);
    alert("Error: " + error);
    return Observable.throw(error.json().error || 'Server error');
  }
};
