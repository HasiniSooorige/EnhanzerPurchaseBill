
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

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

export interface PurchaseBillSubmissionItem {
  itemName: string;
  batchCode: string;
  standardCost: number;
  standardPrice: number;
  quantity: number;
  discount: number;
}

export interface SavePurchaseBillResponse {
  message: string;
  purchaseBillId: number;
  totalItems: number;
  totalQuantity: number;
  totalCost: number;
  totalSelling: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7199/api';

  private locationsCache: Location[] = [];

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/Auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        sessionStorage.setItem(
          'accessToken',
          response.accessToken
        );

        // Cache locations received from login response.
        this.locationsCache = response.locations ?? [];
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getLocations(): Observable<Location[]> {
    // Return cached locations without another API request.
    if (this.locationsCache.length > 0) {
      return of(this.locationsCache);
    }

    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Location[]>(
      `${this.apiUrl}/Locations`,
      { headers }
    ).pipe(
      tap(locations => {
        this.locationsCache = locations;
      })
    );
  }

  savePurchaseBill(
    items: PurchaseBillSubmissionItem[]
  ): Observable<SavePurchaseBillResponse> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<SavePurchaseBillResponse>(
      `${this.apiUrl}/PurchaseBills`,
      { items },
      { headers }
    );
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    this.locationsCache = [];
  }
}
