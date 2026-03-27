import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class Toast {

  private toastSubject = new Subject<any>();
  toastState$ = this.toastSubject.asObservable();

  show(message: string, type: string = 'success') {
    this.toastSubject.next({ message, type });
  }
}
