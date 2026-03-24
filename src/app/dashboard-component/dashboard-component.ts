import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { FilterPipe } from '../filter-pipe';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-dashboard-component',
  imports: [FormsModule, CommonModule, FilterPipe],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent {

  totalCars = 2;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  filterPayment: string = '';
  searchText: string = '';
  mobileNumber: string = '';
  activeTab: string = 'dashboard';
  user: any;
  bookingHistory: any[] = [];
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
    // NEW
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.bookingHistory = JSON.parse(localStorage.getItem('bookings') || '[]');
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

      this.bookingHistory.push({
        name: this.user?.name || 'Guest',
        mobile: this.mobileNumber || 'N/A',
        from: this.fromLocation,
        to: this.toLocation,
        date: this.selectedDate,
        time: this.selectedTime,
        payment: this.paymentDone ? 'Paid' : 'Pending',
        price: this.seatPrice
      });

      localStorage.setItem('bookings', JSON.stringify(this.bookingHistory));

      this.showPopup = false;
      this.showSuccess = true;
    } else {
      alert("No seats available ❌");
    }

  }
  setTab(tab: string) {
    this.activeTab = tab;
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
    this.mobileNumber = '';   // ✅ NEW
    this.paymentDone = false;
    this.currentStep = 1;
  }
  cancelBookingByIndex(index: number) {
    this.bookingHistory.splice(index, 1);
    this.bookedSeats--;

    localStorage.setItem('bookings', JSON.stringify(this.bookingHistory));

    alert('Booking cancelled successfully ❌');
  }
  downloadInvoice(booking: any) {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('🚗 Car Booking Invoice', 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${booking.name}`, 20, 40);
    doc.text(`Mobile: ${booking.mobile}`, 20, 50);
    doc.text(`Route: ${booking.from} → ${booking.to}`, 20, 60);
    doc.text(`Date: ${booking.date}`, 20, 70);
    doc.text(`Time: ${booking.time}`, 20, 80);
    doc.text(`Payment: ${booking.payment}`, 20, 90);
    doc.text(`Amount: ₹${booking.price}`, 20, 100);

    doc.save('invoice.pdf');
  }
  get paginatedBookings() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.bookingHistory.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.bookingHistory.length / this.itemsPerPage);
  }
  ngAfterViewInit() {
    this.loadCharts();
  }
  loadCharts() {
    const bookingsCount = this.bookingHistory.length;

    const paid = this.bookingHistory.filter(b => b.payment === 'Paid').length;
    const pending = this.bookingHistory.filter(b => b.payment === 'Pending').length;

    const totalRevenue = this.bookingHistory
      .filter(b => b.payment === 'Paid')
      .reduce((sum, b) => sum + b.price, 0);

    // Pie Chart (Payment Status)
    new Chart("paymentChart", {
      type: 'pie',
      data: {
        labels: ['Paid', 'Pending'],
        datasets: [{
          data: [paid, pending]
        }]
      }
    });

    // Bar Chart (Revenue)
    new Chart("revenueChart", {
      type: 'bar',
      data: {
        labels: ['Revenue'],
        datasets: [{
          label: 'Total ₹',
          data: [totalRevenue]
        }]
      }
    });
  }
}
