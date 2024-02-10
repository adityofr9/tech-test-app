import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from '@/helper/helper';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL = environment.apiUrl;
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private helper: Helpers,
    private router: Router
  ) { 
    const token = this.helper.encodeBase64('currentUserToken');
    if (localStorage.getItem(token)) {
      const currentUserToken = this.helper.decodeBase64(localStorage.getItem(token));
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(currentUserToken));
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  loginByAuth(payload: any): Observable<any> {
    return this.apiService.multipartPost('auth/login', payload);
  }

  getProfileAdmin(): Observable<any> {
    const userData = this.currentUserValue;
    const isLoggedIn = userData && userData.token
    let headers = {};
    if (isLoggedIn) {
      headers = new HttpHeaders({
        'Authorization': `Bearer ${userData.token}`
      });
    }
    
    return this.http.get(`${this.BASE_URL}` + 'auth/me', { headers });
  }

  logout() {
    const token = this.helper.encodeBase64('currentUserToken');
    const profile = this.helper.encodeBase64('profileData');
    localStorage.removeItem(token);
    localStorage.removeItem(profile);
    this.currentUserSubject.next(null);
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 200);
  }
}
