import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_models/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  search(search: string, page: number = 1, size: number = 10) {
    const url = environment.apiEndpoint + 'user/search';
    const param : { [key: string]: string } = {
      page: page.toString(),
      size: size.toString()
    }
    if (search) {
      param['search'] = search;
    }
    return this.http.get<User[]>(url, {params: param, ...httpOptions}).toPromise();
  }
}
