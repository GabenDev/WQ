import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Place} from "../domain/Place";

@Injectable()
export class PlaceService {
  baseUrl = "http://gaben.gleeze.com:8100/api/place"

  constructor(public http: Http) {
    console.log('PlaceService initialized');
  }

  public getPlaces() : Observable<Place[]> {
    return this.http.get(this.baseUrl, this.jwt())
      .map(res => res.json())
      .catch(this.handleError);
  }

  handleError(error) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  public jwt() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return new RequestOptions({ headers: headers });
  }
}
