import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  message: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  locations: {
    location_Code: string;
    location_Name: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:7199/api/Auth/login';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, {
      email,
      password
    }).pipe(
      tap(response => {
        sessionStorage.setItem('accessToken', response.accessToken);
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
  }
}
