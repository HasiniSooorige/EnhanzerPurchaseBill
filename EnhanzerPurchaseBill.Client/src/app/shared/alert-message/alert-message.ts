import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-message.html',
  styleUrl: './alert-message.css'
})
export class AlertMessage {
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'error';
}
