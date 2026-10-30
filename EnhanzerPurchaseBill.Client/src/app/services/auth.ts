import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Location {
  location_Code: string;
  location_Name: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  locations: Location[];
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7199/api';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/Auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        sessionStorage.setItem('accessToken', response.accessToken);
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getLocations(): Observable<Location[]> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Location[]>(
      `${this.apiUrl}/Locations`,
      { headers }
    );
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
  }
}
