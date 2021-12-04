import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  currentUser$: Observable<User>;

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  setLocalStorageUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(username: string, password: string) {
    const url = environment.apiEndpoint + 'auth/signIn';
    return this.http.post(url, { username, password }, httpOptions)
      .pipe(map(user => {
        this.setLocalStorageUser(<User>user);
        return user;
      }))
      .toPromise();
  }

  register(username: string, password: string) {
    const url = environment.apiEndpoint + 'auth/signUp';
    return this.http.post(url, { username, password }, httpOptions)
      .toPromise();
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
