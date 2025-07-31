import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../../config/constants'; // Global o'zgaruvchilar
import { LoggerService } from './logger.service'; // Logger xizmati

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private logger: LoggerService) {}

  getUsers(): Observable<any> {
    this.logger.info('Fetching all users'); // Logger orqali loglash
    return this.http.get(API_URLS.GET_ALL_USERS);
  }

  getUserById(id: number): Observable<any> {
    this.logger.info(`Fetching user with id: ${id}`); // Logger orqali loglash
    return this.http.get(`${API_URLS.USER}?id=${id}`);
  }

  updateUser(id: number, userData: any): Observable<any> {
    this.logger.info(`Updating user with id: ${id}`); // Logger orqali loglash
    return this.http.put(API_URLS.UPDATE_USER, userData);
  }

  getUsersCount(): Observable<any> {
    this.logger.info('Fetching users count');
    return this.http.get(API_URLS.GET_COUNT_USERS);
  }

  createUser(userData: any): Observable<any> {
    this.logger.info('Creating new user');
    return this.http.post(API_URLS.CREATE_USER, userData);
  }

  deleteUser(id: number): Observable<any> {
    this.logger.info(`Deleting user with id: ${id}`);
    return this.http.delete(`${API_URLS.DELETE_USER}?id=${id}`);
  }

  /**
   * Add a book to user's favorites
   * @param formData FormData containing UserId and BookId
   */
  addBookToUser(formData: FormData): Observable<any> {
    const userId = formData.get('UserId');
    const bookId = formData.get('BookId');
    this.logger.info(`Adding book with id: ${bookId} to user with id: ${userId}`);
    return this.http.post(`${API_URLS.USER_ADD_BOOK}`, formData);
  }

  /**
   * Remove a book from user's favorites
   * @param formData FormData containing UserId and BookId
   */
  removeBookFromUser(formData: FormData): Observable<any> {
    const userId = formData.get('UserId');
    const bookId = formData.get('BookId');
    this.logger.info(`Removing book with id: ${bookId} from user with id: ${userId}`);
    return this.http.post(`${API_URLS.USER_REMOVE_BOOK}`, formData);
  }
}
