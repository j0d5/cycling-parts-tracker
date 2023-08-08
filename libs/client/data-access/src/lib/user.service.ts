import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUser, PublicUserData, UpdateUser } from '@cpt/shared/domain';
import { environment } from '@cpt/shared/util-env';
import { Observable } from 'rxjs';
import { handleApiError } from './handle-api-error-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getUser(id: string): Observable<PublicUserData> {
    return this.http
      .get<PublicUserData>(`${this.baseUrl}/${id}`)
      .pipe(handleApiError);
  }

  updateUser(id: string, data: UpdateUser): Observable<PublicUserData> {
    return this.http
      .patch<PublicUserData>(`${this.baseUrl}/${id}`, data)
      .pipe(handleApiError);
  }

  createUser(data: CreateUser): Observable<PublicUserData> {
    return this.http
      .post<PublicUserData>(this.baseUrl, data)
      .pipe(handleApiError);
  }
}
