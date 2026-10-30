import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, Location } from '../../services/auth';

interface PurchaseItem {
  itemName: string;
  batchCode: string;
  batchName: string;
  standardCost: number;
  standardPrice: number;
  quantity: number;
  discount: number;
  totalCost: number;
  totalSelling: number;
}

@Component({
  selector: 'app-purchase-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-bill.html',
  styleUrl: './purchase-bill.css'
})
export class PurchaseBill implements OnInit {
  private readonly auth = inject(Auth);

  readonly itemNames: string[] = [
    'Mango',
    'Apple',
    'Banana',
    'Orange',
    'Grapes',
    'Kiwi',
    'Strawberry'
  ];

  locations: Location[] = [];
  purchaseItems: PurchaseItem[] = [];

  itemName = '';
  batchCode = '';
  standardCost = 100;
  standardPrice = 150;
  quantity = 1;
  discount = 20;

  isLoadingLocations = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.isLoadingLocations = true;
    this.errorMessage = '';

    this.auth.getLocations().subscribe({
      next: locations => {
        this.locations = locations;
        this.isLoadingLocations = false;
      },
      error: error => {
        this.isLoadingLocations = false;

        if (error.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          this.auth.logout();
        } else {
          this.errorMessage = 'Unable to load locations. Please try again.';
        }
      }
    });
  }

  get totalCost(): number {
    const grossCost = this.standardCost * this.quantity;
    const discountAmount = grossCost * (this.discount / 100);

    return grossCost - discountAmount;
  }

  get totalSelling(): number {
    return this.standardPrice * this.quantity;
  }

  get totalItems(): number {
    return this.purchaseItems.length;
  }

  get totalQuantity(): number {
    return this.purchaseItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  addItem(): void {
    const selectedItem = this.itemName.trim();
    const selectedLocation = this.locations.find(
      location => location.location_Code === this.batchCode
    );

    if (!this.itemNames.includes(selectedItem)) {
      this.errorMessage = 'Please select a valid item.';
      return;
    }

    if (!selectedLocation) {
      this.errorMessage = 'Please select a batch.';
      return;
    }

    if (
      this.standardCost < 0 ||
      this.standardPrice < 0 ||
      this.quantity <= 0 ||
      this.discount < 0 ||
      this.discount > 100
    ) {
      this.errorMessage = 'Please enter valid cost, price, quantity and discount values.';
      return;
    }

    const purchaseItem: PurchaseItem = {
      itemName: selectedItem,
      batchCode: selectedLocation.location_Code,
      batchName: selectedLocation.location_Name,
      standardCost: this.standardCost,
      standardPrice: this.standardPrice,
      quantity: this.quantity,
      discount: this.discount,
      totalCost: this.totalCost,
      totalSelling: this.totalSelling
    };

    this.purchaseItems.push(purchaseItem);

    this.errorMessage = '';
    this.resetForm();
  }

  removeItem(index: number): void {
    this.purchaseItems.splice(index, 1);
  }

  resetForm(): void {
    this.itemName = '';
    this.batchCode = '';
    this.standardCost = 100;
    this.standardPrice = 150;
    this.quantity = 1;
    this.discount = 0;
  }

  logout(): void {
    this.auth.logout();
    window.location.href = '/login';
  }
}
