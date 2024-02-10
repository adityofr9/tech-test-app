import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  getListProduct(params: any): Observable<any> {
    return this.apiService.getWithParam('products', params).pipe();
  }

  getDetailProduct(id: string) {
    return this.apiService.get('products/' + id);
  }
}
