import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../config/constants';
import { LoggerService } from '../../../core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  getAllRatings(): Observable<any> {
    this.logger.info('Fetching all ratings');
    return this.http.get(API_URLS.GET_ALL_RATINGS);
  }

  getRatingById(id: number): Observable<any> {
    this.logger.info(`Fetching rating with id: ${id}`);
    return this.http.get(`${API_URLS.GET_RATING_BY_ID}?id=${id}`);
  }

  addRating(ratingData: any): Observable<any> {
    this.logger.info('Adding new rating');
    return this.http.post(API_URLS.ADD_RATING, ratingData);
  }

  updateRating(ratingData: any): Observable<any> {
    this.logger.info('Updating rating');
    return this.http.put(API_URLS.UPDATE_RATING, ratingData);
  }

  deleteRating(id: number): Observable<any> {
    this.logger.info(`Deleting rating with id: ${id}`);
    return this.http.delete(`${API_URLS.DELETE_RATING}?id=${id}`);
  }
}