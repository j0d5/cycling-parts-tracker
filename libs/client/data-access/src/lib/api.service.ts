import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Bike, CreateBike, UpdateBike, UpsertBike } from '@cpt/shared/domain';
import { environment } from '@cpt/shared/util-env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAllBikeItems(): Observable<Bike[]> {
    return this.http.get<Bike[]>(`${this.baseUrl}/bikes`);
  }

  getBikeById(bikeId: string): Observable<Bike> {
    return this.http.get<Bike>(`${this.baseUrl}/bikes/${bikeId}`);
  }

  createBike(bikeData: CreateBike): Observable<Bike> {
    return this.http.post<Bike>(`${this.baseUrl}/bikes`, bikeData);
  }

  updateBike(bikeId: string, bikeData: UpdateBike): Observable<Bike> {
    return this.http.patch<Bike>(`${this.baseUrl}/bikes/${bikeId}`, bikeData);
  }

  createOrUpdateBike(bikeId: string, bikeData: UpsertBike): Observable<Bike> {
    return this.http.put<Bike>(`${this.baseUrl}/bikes/${bikeId}`, bikeData);
  }

  deleteBike(bikeId: string): Observable<null> {
    return this.http.delete<null>(`${this.baseUrl}/bikes/${bikeId}`);
  }
}
