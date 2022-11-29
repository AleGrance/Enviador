import { HttpClient } from '@angular/common/http'; //se importa el servicio y se inyecta en la clase como una dependencia a travez del constructor 
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Local
  url: string = 'http://localhost:3001';

  constructor(public http: HttpClient) { }

  // get(path: any) {
  //   return this.http.get(this.url + '/' + path);
  // };

  post(path: string, body: any) {
    return this.http.post(this.url + '/' + path, body);
  };

  // put(path: string, body: any) {
  //   return this.http.put(this.url + '/' + path, body);
  // };

  // delete(path: string) {
  //   return this.http.delete(this.url + '/' + path);
  // };
}
