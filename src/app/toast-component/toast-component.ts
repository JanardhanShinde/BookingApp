import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-toast-component',
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.scss',
})
export class ToastComponent {

  message: string = '';
  type: string = 'success';
  show: boolean = false;
  progressDuration: number = 3000;

  constructor(private toastService: Toast) { }

ngOnInit() {
  this.toastService.toastState$.subscribe((data: any) => {
    this.message = data.message;
    this.type = data.type;
    this.show = true;

    this.progressDuration = data.duration || 3000;

    setTimeout(() => {
      this.show = false;
    }, this.progressDuration);
  });
}
}
