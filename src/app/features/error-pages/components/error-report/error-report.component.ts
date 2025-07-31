import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-report',
  templateUrl: './error-report.component.html',
  styleUrls: ['./error-report.component.scss']
})
export class ErrorReportComponent {
  @Input() errorMessage: string = '';
  @Output() onClose = new EventEmitter<void>();

  sendReport() {
    console.log('Xato haqida hisobot yuborildi:', this.errorMessage);
    this.closeModal();
  }

  closeModal() {
    this.onClose.emit();
  }
}
