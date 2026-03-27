import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-book-car-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './book-car-component.html',
  styleUrl: './book-car-component.scss',
})
export class BookCarComponent {

  @Output() bookingDone = new EventEmitter<any>();

  showPopup = false;
  currentStep = 1;

  fromLocation = '';
  toLocation = '';
  mobileNumber = '';
  selectedDate = '';
  selectedTime = '';
  paymentDone = false;

  todayDate = new Date().toISOString().split('T')[0];

  seatPrice = 500;

  constructor(private toastService: Toast) { }

  openBookingPopup() {
    this.resetForm();
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.currentStep = 1;
  }

 goToStep2() {

  if (!this.fromLocation || !this.toLocation) {
    this.toastService.show("Enter pickup & destination 📍", "warning");
    return;
  }

  if (!this.selectedDate) {
    this.toastService.show("Select travel date 📅", "warning");
    return;
  }

  if (!this.selectedTime) {
    this.toastService.show("Select time ⏰", "warning");
    return;
  }
if (!this.mobileNumber || this.mobileNumber.length < 10) {
  this.toastService.show("Enter valid mobile number 📱", "warning");
  return;
}
  this.currentStep = 2;
}

confirmBooking() {

  if (!this.paymentDone) {
    this.toastService.show("Complete payment to confirm booking 💳", "warning");
    return;
  }

  const booking = {
    name: localStorage.getItem('userName') || 'User',
    mobile: this.mobileNumber,
    from: this.fromLocation,
    to: this.toLocation,
    date: this.selectedDate,
    time: this.selectedTime,
    payment: 'Paid',
    price: this.seatPrice
  };

  this.bookingDone.emit(booking);

  this.toastService.show("Booking successful 🚗", "success");

  this.closePopup();
}

  resetForm() {
    this.fromLocation = '';
    this.toLocation = '';
    this.mobileNumber = '';
    this.selectedDate = '';
    this.selectedTime = '';
    this.paymentDone = false;
    this.currentStep = 1;
  }
}
