import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Ma'lumot oqimi
  private messageSource = new BehaviorSubject<string>('Boshlangich ma\'lumot');

  // Observable sifatida ochiq maydon (komponentlar foydalanishi uchun)
  currentMessage = this.messageSource.asObservable();

  constructor() {}

  // Xabarni o‘zgartirish uchun metod
  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}
