import {Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Auth, Location, PurchaseBillSubmissionItem} from '../../services/auth';
import { AlertMessage } from '../../shared/alert-message/alert-message';

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
  imports: [
    CommonModule,
    FormsModule,
    AlertMessage
  ],
  templateUrl: './purchase-bill.html',
  styleUrl: './purchase-bill.css'
})
export class PurchaseBill implements OnInit {

  private readonly auth = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);

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

  standardCost: number | null = null;
  standardPrice: number | null = null;
  quantity: number | null = null;
  discount = 0;

  isLoadingLocations = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadLocations();
  }

  // Load locations from the backend
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
          this.errorMessage =
            'Session expired. Please login again.';

          this.auth.logout();
        } else {
          this.errorMessage =
            'Unable to load locations. Please try again.';
        }
      }
    });
  }

  // Calculate total cost after discount
  get totalCost(): number {
    if (
      !Number.isFinite(this.standardCost) ||
      !Number.isFinite(this.quantity) ||
      !Number.isFinite(this.discount) ||
      this.standardCost === null ||
      this.quantity === null ||
      this.standardCost < 0 ||
      this.quantity <= 0 ||
      this.discount < 0 ||
      this.discount > 100
    ) {
      return 0;
    }

    return (
      this.standardCost *
      this.quantity *
      (1 - this.discount / 100)
    );
  }

  // Calculate total selling amount
  get totalSelling(): number {
    if (
      !Number.isFinite(this.standardPrice) ||
      !Number.isFinite(this.quantity) ||
      this.standardPrice === null ||
      this.quantity === null ||
      this.standardPrice < 0 ||
      this.quantity <= 0
    ) {
      return 0;
    }

    return this.standardPrice * this.quantity;
  }

  // Total number of purchase items
  get totalItems(): number {
    return this.purchaseItems.length;
  }

  // Sum of all item quantities
  get totalQuantity(): number {
    return this.purchaseItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  // Validate and add a purchase item
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
      this.standardCost === null ||
      this.standardPrice === null ||
      this.quantity === null ||
      !Number.isFinite(this.standardCost) ||
      !Number.isFinite(this.standardPrice) ||
      !Number.isFinite(this.quantity) ||
      !Number.isFinite(this.discount) ||
      this.standardCost < 0 ||
      this.standardPrice < 0 ||
      this.quantity <= 0 ||
      !Number.isInteger(this.quantity) ||
      this.discount < 0 ||
      this.discount > 100
    ) {
      this.errorMessage =
        'Please enter valid cost, price, quantity and discount values.';
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
    this.successMessage = '';

    this.resetForm();
  }

  // Remove an item from the purchase table
  removeItem(index: number): void {
    this.purchaseItems.splice(index, 1);
    this.successMessage = '';
  }

  // Save the purchase bill through the backend API
  saveBill(): void {

    if (this.purchaseItems.length === 0 || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const items: PurchaseBillSubmissionItem[] =
      this.purchaseItems.map(item => ({
        itemName: item.itemName,
        batchCode: item.batchCode,
        standardCost: item.standardCost,
        standardPrice: item.standardPrice,
        quantity: item.quantity,
        discount: item.discount
      }));

    this.auth.savePurchaseBill(items).subscribe({

      next: response => {

        this.isSaving = false;

        this.successMessage =
          `${response.message} Bill ID: ${response.purchaseBillId}`;

        this.purchaseItems = [];
        this.resetForm();

        this.cdr.detectChanges();

        // Automatically hide the success message
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 5000);
      },

      error: error => {

        console.error('Save purchase bill error:', error);

        this.isSaving = false;

        if (error.status === 401) {
          this.errorMessage =
            'Session expired. Please login again.';

          this.auth.logout();
        } else {
          this.errorMessage =
            error.error?.message ||
            'Unable to save purchase bill. Please try again.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  // Reset purchase item form
  resetForm(): void {
    this.itemName = '';
    this.batchCode = '';
    this.standardCost = null;
    this.standardPrice = null;
    this.quantity = null;
    this.discount = 0;
  }

  // Logout the current user
  logout(): void {
    this.auth.logout();
    window.location.href = '/login';
  }
}
