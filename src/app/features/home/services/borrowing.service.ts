import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../config/constants';
import { LoggerService } from '../../../core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class BorrowingService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  // Borrowing operations
  borrowBook(borrowData: any): Observable<any> {
    this.logger.info('Borrowing a book');
    return this.http.post(API_URLS.BORROW_BOOK, borrowData);
  }

  returnBook(returnData: any): Observable<any> {
    this.logger.info('Returning a book');
    return this.http.post(API_URLS.RETURN_BOOK, returnData);
  }

  getMyBorrowings(userId: number): Observable<any> {
    this.logger.info(`Fetching borrowings for user: ${userId}`);
    return this.http.get(`${API_URLS.MY_BORROWINGS}?userId=${userId}`);
  }

  getAllBorrowings(): Observable<any> {
    this.logger.info('Fetching all borrowings');
    return this.http.get(API_URLS.ALL_BORROWINGS);
  }

  getActiveBorrowings(): Observable<any> {
    this.logger.info('Fetching active borrowings');
    return this.http.get(API_URLS.GET_ACTIVE_BORROWINGS);
  }

  getReturnedBooksCount(): Observable<any> {
    this.logger.info('Fetching returned books count');
    return this.http.get(API_URLS.GET_RETURNED_BOOKS_COUNT);
  }

  getLast7DaysBorrowStats(): Observable<any> {
    this.logger.info('Fetching last 7 days borrow statistics');
    return this.http.get(API_URLS.GET_LAST_7_DAYS_BORROW_STATS);
  }

  getBorrowSummary(): Observable<any> {
    this.logger.info('Fetching borrow summary');
    return this.http.get(API_URLS.GET_BORROW_SUMMARY);
  }

  // Borrow Records operations
  getBorrowRecords(): Observable<any> {
    this.logger.info('Fetching borrow records');
    return this.http.get(API_URLS.GET_BORROW_RECORDS);
  }

  getBorrowRecordById(id: number): Observable<any> {
    this.logger.info(`Fetching borrow record with id: ${id}`);
    return this.http.get(`${API_URLS.GET_BORROW_RECORD_BY_ID}?id=${id}`);
  }

  createBorrowRecord(recordData: any): Observable<any> {
    this.logger.info('Creating new borrow record');
    return this.http.post(API_URLS.CREATE_BORROW_RECORD, recordData);
  }
}