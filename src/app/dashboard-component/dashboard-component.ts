import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { FilterPipe } from '../filter-pipe';
import { Chart } from 'chart.js/auto';
import { ProfileComponent } from '../profile-component/profile-component';
import { Toast } from '../../services/toast';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BookCarComponent } from '../book-car-component/book-car-component';


@Component({
  selector: 'app-dashboard-component',
  imports: [FormsModule, CommonModule, FilterPipe, ProfileComponent, HttpClientModule, BookCarComponent],
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
  bookingHistory: any[] = [];
  paymentChart: any;
revenueChart: any;
  seatsPerCar = 6;
  todayDate: string = '';
  showSuccess: boolean = false;
  currentStep: number = 1;

  fromLocation: string = '';
  toLocation: string = '';
  selectedDate: string = '';
  selectedTime: string = '';

  totalSeats = this.totalCars * this.seatsPerCar;
  bookedSeats = 0;

  greeting = '';
  currentTime = '';
  userName = '';

  temperature: any = '';
  weatherIcon: string = '';
  city = 'Washim';

  showPopup = false;
  paymentDone: boolean = false;
  seatPrice = 500;

  constructor(
    private router: Router,
    private toastService: Toast,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    // Retrieve username from localStorage
    this.userName = localStorage.getItem('userName') || '';

    this.bookingHistory = JSON.parse(localStorage.getItem('bookings') || '[]');

    this.setGreeting();
    this.updateTime();
    this.getWeather();

    setInterval(() => {
      this.updateTime();
    }, 1000);
  }
  get availableSeats() {
    return this.totalSeats - this.bookedSeats;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  openBookingPopup() {
    this.resetBookingForm();   // ✅ clear old data
    this.showPopup = true;
  }

  confirmBooking() {

    if (!this.fromLocation || !this.toLocation) {
      this.toastService.show("Please enter From and To locations 📍", "warning");
      return;
    }

    if (!this.selectedDate) {
      this.toastService.show("Please select travel date 📅", "warning");
      return;
    }

    if (!this.selectedTime) {
      this.toastService.show("Please select time 🌅🌇", "warning");
      return;
    }

    if (!this.paymentDone) {
      this.toastService.show("Complete payment to confirm booking 💳", "warning");
      return;
    }

    if (this.availableSeats > 0) {
      this.bookedSeats++;

      this.bookingHistory.push({
        name: this.userName || 'Guest',
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
      this.toastService.show("Booking successful 🚗", "success");
    } else {
      this.toastService.show("No seats available ❌", "error");
    }
    this.loadCharts(); // Refresh charts with new booking data
  }
  setTab(tab: string) {
    this.activeTab = tab;
    
    // Reload charts when switching back to dashboard tab
    if (tab === 'dashboard') {
      setTimeout(() => {
        this.loadCharts();
      }, 100);
    }
  }
  closeSuccess() {
    this.showSuccess = false;
  }
  goToStep2() {

    if (!this.fromLocation || !this.toLocation) {
      this.toastService.show("Enter pickup & destination 📍", "warning");
      return;
    }

    if (!this.selectedDate) {
      this.toastService.show("Select date 📅", "warning");
      return;
    }

    if (!this.selectedTime) {
      this.toastService.show("Select time ⏰", "warning");
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

    this.toastService.show('Booking cancelled successfully ❌', 'error');
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

  const paid = this.bookingHistory.filter(b => b.payment === 'Paid').length;
  const pending = this.bookingHistory.filter(b => b.payment === 'Pending').length;

  const totalRevenue = this.bookingHistory
    .filter(b => b.payment === 'Paid')
    .reduce((sum, b) => sum + b.price, 0);

  // ✅ Destroy old charts before creating new ones
  if (this.paymentChart) {
    this.paymentChart.destroy();
  }

  if (this.revenueChart) {
    this.revenueChart.destroy();
  }

  // ✅ Create Pie Chart
  this.paymentChart = new Chart("paymentChart", {
    type: 'pie',
    data: {
      labels: ['Paid', 'Pending'],
      datasets: [{
        data: [paid, pending]
      }]
    }
  });

  // ✅ Create Bar Chart
  this.revenueChart = new Chart("revenueChart", {
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
  // Greeting logic
  setGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      this.greeting = 'Good Morning ☀️';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon 🌤';
    } else {
      this.greeting = 'Good Evening 🌙';
    }
  }

  // Live Time
  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  getWeather() {
    const apiKey = '45d3d26882f71e1943e9434ef209e623'; // Replace with your OpenWeatherMap API key

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apiKey}&units=metric`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.temperature = Math.round(res.main.temp);
        this.weatherIcon = res.weather[0].icon;
        this.city = res.name;
      },
      error: (err) => {
        console.error('Weather API error:', err);
      }
    });
  }
  handleBooking(booking: any) {

  this.bookedSeats++;

  this.bookingHistory.push(booking);

  localStorage.setItem('bookings', JSON.stringify(this.bookingHistory));

  this.loadCharts();

  this.toastService.show("Booking successful 🚗", "success");
}
}
