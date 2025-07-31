import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../config/constants';
import { LoggerService } from '../../../core/services/logger.service';
import {Book} from "../components/book-detail/book-detail.model";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private httpClient: HttpClient,
    private logger: LoggerService
  ) { }


  getRandomBook(): Observable<any> {
    this.logger.info('Fetching random books (fallback to all books)');
    // Since random books endpoint is not available in new API, get all books and select random on client side
    return this.httpClient.get(`${API_URLS.ALL_BOOKS}`);
  }

  getBooks(): Observable<any> {
    this.logger.info('Fetching books with pagination');
    return this.httpClient.get(`${API_URLS.ALL_BOOKS}?page=1&limit=10`);
  }

  getBookById(bookId: number): Observable<Book> {
    this.logger.info(`Fetching book with id: ${bookId}`);
    return this.httpClient.get<Book>(`${API_URLS.BOOK}/${bookId}`);
  }

  getBooksCount(): Observable<any> {
    this.logger.info('Fetching books count');
    return this.httpClient.get(API_URLS.GET_COUNT_BOOKS);
  }

  createBook(bookData: any): Observable<any> {
    this.logger.info('Creating new book');
    return this.httpClient.post(API_URLS.CREATE_BOOK, bookData);
  }

  updateBook(bookId: number, bookData: any): Observable<any> {
    this.logger.info(`Updating book with id: ${bookId}`);
    return this.httpClient.put(`${API_URLS.UPDATE_BOOK}/${bookId}`, bookData);
  }

  deleteBook(bookId: number): Observable<any> {
    this.logger.info(`Deleting book with id: ${bookId}`);
    return this.httpClient.delete(`${API_URLS.DELETE_BOOK}/${bookId}`);
  }
}
