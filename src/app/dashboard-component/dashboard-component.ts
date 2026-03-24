import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-component',
 imports: [FormsModule, CommonModule], 
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent {

  totalCars = 2;
  seatsPerCar = 6;
  todayDate: string = '';
  showSuccess: boolean = false;
currentStep: number = 1;
fromLocation: string = '';
toLocation: string = '';
selectedDate: string = '';
  totalSeats = this.totalCars * this.seatsPerCar;
  bookedSeats = 0;

  showPopup = false;
  selectedRoute: string = '';
  selectedTime: string = '';
  paymentDone: boolean = false;
  seatPrice = 500;
  seats = [
    { number: 1, booked: false, selected: false },
    { number: 2, booked: false, selected: false },
    { number: 3, booked: true, selected: false },
    { number: 4, booked: false, selected: false },
    { number: 5, booked: false, selected: false },
    { number: 6, booked: true, selected: false }
  ];

  selectedSeatNumber: number | null = null;

  ngOnInit() {
  const today = new Date();
  this.todayDate = today.toISOString().split('T')[0]; // format: YYYY-MM-DD
}

  constructor(private router: Router) { }

  get availableSeats() {
    return this.totalSeats - this.bookedSeats;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  selectSeat(seat: any) {
    this.seats.forEach(s => s.selected = false);
    seat.selected = true;
    this.selectedSeatNumber = seat.number;
  }

 openBookingPopup() {
  this.resetBookingForm();   // ✅ clear old data
  this.showPopup = true;
}

  confirmBooking() {

   if (!this.fromLocation || !this.toLocation) {
  alert("Please enter From and To locations 📍");
  return;
}

if (!this.selectedDate) {
  alert("Please select travel date 📅");
  return;
}

    if (!this.selectedTime) {
      alert("Please select time 🌅🌇");
      return;
    }

    if (!this.paymentDone) {
      alert("Booking will be confirmed only after payment is completed 💳");
      return;
    }

   if (this.availableSeats > 0) {
  this.bookedSeats++;

  this.showPopup = false;     // close booking popup
  this.showSuccess = true;    // show success modal
} else {
  alert("No seats available ❌");
}

  }
  closeSuccess() {
  this.showSuccess = false;
}
  isSeatBooked(seatNumber: number) {
    return this.seats.find(s => s.number === seatNumber)?.booked;
  }

  cancelSeat() {
    if (!this.selectedSeatNumber) return;

    const seat = this.seats.find(s => s.number === this.selectedSeatNumber);

    if (seat && seat.booked) {
      seat.booked = false;
      this.bookedSeats--;

      alert(`Seat ${this.selectedSeatNumber} cancelled successfully!`);
    } else {
      alert('Please select a booked seat to cancel');
    }

    this.selectedSeatNumber = null;
  }
  cancelBooking() {
    if (this.bookedSeats > 0) {
      this.bookedSeats--;
      alert('Your booking has been cancelled successfully!');
    } else {
      alert('No booking found to cancel');
    }
  }
  goToStep2() {

  if (!this.fromLocation || !this.toLocation) {
    alert("Enter pickup & destination 📍");
    return;
  }

  if (!this.selectedDate) {
    alert("Select date 📅");
    return;
  }

  if (!this.selectedTime) {
    alert("Select time ⏰");
    return;
  }

  this.currentStep = 2;
}
closePopup() {
  this.showPopup = false;
  this.currentStep = 1;
  this.resetBookingForm();
}
resetBookingForm() {
  this.fromLocation = '';
  this.toLocation = '';
  this.selectedDate = '';
  this.selectedTime = '';
  this.paymentDone = false;
  this.currentStep = 1;
}
}
