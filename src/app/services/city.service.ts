import { Injectable } from '@angular/core';
import {City} from "../models/city_model";
import {HttpClient} from "@angular/common/http";
import {count, Observable, of} from "rxjs";
import {CityServiceResponse} from "../models/api_response";

@Injectable({
  providedIn: 'root'
})
export class CityService {
  url: string = 'http://localhost:3000/api';

  getCities(countryIds: string, minPopulation: number): Observable<CityServiceResponse | undefined>{
    return this.http.post<CityServiceResponse>(this.url, {countryIds:countryIds, minPopulation:minPopulation });
  }
  constructor(private http: HttpClient) { }
}
