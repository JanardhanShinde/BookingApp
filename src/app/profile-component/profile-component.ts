import { Component } from '@angular/core';
import { Toast } from '../../services/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss',
})
export class ProfileComponent {

  user: any;
  // editMode: boolean = false;
  bookingHistory: any[] = [];
  editMode: boolean = false;
   activeTab: string = 'profile';
    bookedSeats = 0;
 constructor(private toastService: Toast) { }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.bookingHistory = JSON.parse(localStorage.getItem('bookings') || '[]');
  }

  saveProfile() {
  localStorage.setItem('user', JSON.stringify(this.user));
  this.editMode = false;
  this.toastService.show("Profile updated successfully ✅", "success");
}

 getTotalSpent() {
  return this.bookingHistory
    .filter(b => b.payment === 'Paid')
    .reduce((sum, b) => sum + b.price, 0);
}
}
