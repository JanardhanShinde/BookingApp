import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

@Component({
  selector: 'app-signupcomponent',
  imports: [CommonModule, FormsModule],
  templateUrl: './signupcomponent.html',
  styleUrl: './signupcomponent.scss',
})
export class SignupComponent {

  name = '';
  mobile = '';
  email = '';
  password = '';
  confirmPassword = '';
  generatedOtp = '';

  // auth = getAuth();
  recaptchaVerifier: any;
  confirmationResult: any;

  otpSent = false;
  enteredOtp = '';

  loading = false;
  resendDisabled = false;
  timer = 30;

  showPopup = false;

  constructor(private router: Router, private ngZone: NgZone) {}

  // sendOtp(form: NgForm) {

  //   if (form.invalid) {
  //     alert("Fill all details correctly ❌");
  //     return;
  //   }

  //   if (this.password !== this.confirmPassword) {
  //     alert("Passwords do not match ❌");
  //     return;
  //   }

  //   this.loading = true;
  //    // 🔥 Fake OTP (no Firebase)
  // this.generatedOtp = "123456";
  
  //   if (!this.recaptchaVerifier) {
  //     this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container',
  //       { size: 'invisible' }
  //     );
  //   }

  //   signInWithPhoneNumber(this.auth, '+91' + this.mobile, this.recaptchaVerifier)
  //     .then(result => {
  //       this.confirmationResult = result;
  //       this.otpSent = true;
  //       this.startTimer();
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       alert(error.message);
  //     })
  //     .finally(() => {
  //       this.loading = false;
  //     });
  // }

  // verifyOtp() {
  //   this.confirmationResult.confirm(this.enteredOtp)
  //     .then(() => {
  //       localStorage.setItem('user', JSON.stringify({
  //         name: this.name,
  //         mobile: this.mobile,
  //         email: this.email
  //       }));

  //       this.showPopup = true;
  //     })
  //     .catch(() => {
  //       alert("Invalid OTP ❌");
  //     });
  // }
  sendOtp(form: any) {
    if (form.invalid) {
      alert("Fill all details correctly ❌");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    this.loading = true;

    // 🔥 Fake OTP (no Firebase)
    this.generatedOtp = "123456";

    console.log("OTP:", this.generatedOtp); // for testing

    setTimeout(() => {
      this.ngZone.run(() => {
        this.otpSent = true;
        this.loading = false;
        this.startTimer();
        alert("OTP sent (use 123456)");
      });
    }, 1000);
  }
  verifyOtp() {
    if (this.enteredOtp === this.generatedOtp) {
      localStorage.setItem('user', JSON.stringify({
        name: this.name,
        mobile: this.mobile,
        email: this.email
      }));

      this.ngZone.run(() => {
        this.showPopup = true;
      });
    } else {
      alert("Invalid OTP ❌");
    }
  }
  startTimer() {
    this.resendDisabled = true;
    this.timer = 30;

    const interval = setInterval(() => {
      this.timer--;

      if (this.timer === 0) {
        this.resendDisabled = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}