import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Place } from "../domain/Place";
import { Storage }        from '@ionic/storage';
import { UserService } from "./UserService";

@Injectable()
export class PlaceService {
  // baseUrl = "http://gaben.gleeze.com:8100/api/place"
  baseUrl = "http://localhost:8001/api/place"

  constructor( private storage: Storage, public http: Http, public userService : UserService ) {
    console.log('PlaceService initialized');
  }

  public getPlaces() : Observable<Place[]> {
    return this.http.get(this.baseUrl, this.userService.jwt())
      .map(res => res.json())
      .catch(this.handleError);
  }

  handleError(error) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
