import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Bike, CreateBike, UpdateBike, UpsertBike } from '@cpt/shared/domain';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  getAllBikeItems(): Observable<Bike[]> {
    return this.http.get<Bike[]>(`api/bikes`);
  }

  getBikeById(bikeId: string): Observable<Bike> {
    return this.http.get<Bike>(`api/bikes/${bikeId}`);
  }

  createBike(bikeData: CreateBike): Observable<Bike> {
    return this.http.post<Bike>(`/api/bikes`, bikeData);
  }

  updateBike(bikeId: string, bikeData: UpdateBike): Observable<Bike> {
    return this.http.patch<Bike>(`/api/bikes/${bikeId}`, bikeData);
  }

  createOrUpdateBike(bikeId: string, bikeData: UpsertBike): Observable<Bike> {
    return this.http.put<Bike>(`/api/bikes/${bikeId}`, bikeData);
  }

  deleteBike(bikeId: string): Observable<never> {
    return this.http.delete<never>(`/api/bikes/${bikeId}`);
  }
}
