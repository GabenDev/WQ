import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/user';

@Injectable()
export class UserService {
    baseUrl : String;

    constructor(private http: Http) {
        this.baseUrl = "http://localhost:8000";
    }

    getAll() {
        return this.http.get(this.baseUrl + '/api/user', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + '/api/user/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        var userString = JSON.stringify(user);
        let response = this.http.post(this.baseUrl + '/api/user', userString, this.jwt()).map((response: Response) => response.json());
        return response;
    }

    update(user: User) {
        return this.http.put(this.baseUrl + '/api/user/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + '/api/user/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    public jwt() {
        // create authorization header with jwt token
        // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // let headers = new Headers({ 'Access-Control-Allow-Origin' : '*' });
        // if (currentUser && currentUser.token) {
        //     let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            let headers = new Headers({ 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        // }
    }
}