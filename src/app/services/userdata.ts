import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Userdata {

  constructor (
    private http: HttpClient
  ) { }

  getUserData(){
    return this.http.get('https://dummyjson.com/todos/random/5')
    // return this.http.get('https://fakerestapi.azurewebsites.net/api/v1/Activities')
  }
}
