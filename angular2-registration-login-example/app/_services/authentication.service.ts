import { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    baseUrl : String;
    constructor(private http: Http) {
        this.baseUrl = "http://localhost:8000";
    }

    login(username: string, password: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + '/api/user/auth', JSON.stringify({ userName: username, password: password }), requestOptions)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}