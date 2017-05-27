import { Component }      from '@angular/core';
import { NavController }  from 'ionic-angular';
import { UserService }    from '../../providers/UserService';
import { Http }           from '@angular/http';
import { Observable }     from "rxjs/Observable";
import { User }           from '../../domain/user'
import { TabsPage }       from "../tabs/tabs";
import { Storage }        from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  authenticatedUser : User = new User();

  constructor(private storage: Storage, public userService : UserService, public http: Http, public nav : NavController) {
    this.authenticatedUser.userName = 'gabor.fekete85@gmail.com';
    this.authenticatedUser.password = 'gD5Abb421';
  }

  public logout() {
    this.authenticatedUser = new User();
  }

  public login() {

    this.userService.authenticate(this.authenticatedUser).subscribe(response => {
        if(response) {
            this.userService.setIdToken(response.id_token);
            this.userService.setAccessToken(response.access_token);
            this.nav.push(TabsPage);
        } else {
          alert('Authentication failed !');
        }
    });

  }

  handleError(error) {
    console.error(error);
    alert("Error: " + error);
    return Observable.throw(error.json().error || 'Server error');
  }
};
