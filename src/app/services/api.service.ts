import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BASE_URL = environment.apiUrl;
  options = new HttpParams();

  constructor(
    private http: HttpClient
  ) { }

  private prepareFormData(data: any) {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] !== undefined) {

          if (typeof data[key] === 'object') {
            const dataObj = data[key];
            Object.keys(dataObj).forEach((kObjt) => {
              const field = `${key}_${kObjt}`;
              formData.append(field, dataObj[kObjt]);
            });
          }

          formData.append(key, data[key]);
        }
      }
    }

    return formData;
  }

  public setParams(options: any, params: any) {
    if (Object.keys(params).length !== 0) {
      Object.keys(params).forEach((key) => {
        options = options.append(key, params[key]);
      });
      return options
    }
  }

  public get(path: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}` + path);
  }

  public getWithParam(path: string, payload: any): Observable<any> {
    let newOption = new HttpParams();
    newOption = this.setParams(newOption, payload);
    const optionParams = { params: newOption };
    return this.http.get(`${this.BASE_URL}` + path, optionParams);
  }

  public getWithParam2(path: string, headers: any): Observable<any> {
    return this.http.get(`${this.BASE_URL}` + path, headers);
  }

  public post(path: string, body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}` + path, body);
  }

  public multipartPost(path: string, body: any): Observable<any> {
    const multipartBody = this.prepareFormData(body);
    return this.http.post(`${this.BASE_URL}` + path, multipartBody);
  }

  public put(path: string, body: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}` + path, body);
  }

  public delete(path: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}` + path);
  }
}
