import {Component, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { AlertMessage } from '../../shared/alert-message/alert-message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AlertMessage
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';

  errorMessage = '';

  isLoading = false;
  showPassword = false;

  onLogin(): void {

    if (this.isLoading) {
      return;
    }

    const normalizedEmail = this.email.trim();

    // Validate required fields
    if (!normalizedEmail || !this.password) {
      this.errorMessage =
        'Please enter your email address and password.';
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      this.errorMessage =
        'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.cdr.detectChanges();

    // Authenticate using the backend API
    this.auth.login(normalizedEmail, this.password).subscribe({

      next: () => {

        this.isLoading = false;
        this.cdr.detectChanges();

        void this.router.navigate(['/purchase-bill']);
      },

      error: error => {

        console.error('Login error:', error);

        this.isLoading = false;

        if (error.status === 401) {

          this.errorMessage =
            error.error?.message ||
            'Invalid email or password. Please try again.';

        } else if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Please check your connection.';

        } else if (error.status >= 500) {

          this.errorMessage =
            'The server encountered an error. Please try again later.';

        } else {

          this.errorMessage =
            error.error?.message ||
            'Login failed. Please try again.';
        }

        // Update the UI after the API response
        this.cdr.detectChanges();
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
