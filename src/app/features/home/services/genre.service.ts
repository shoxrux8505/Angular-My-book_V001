import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../config/constants';
import { LoggerService } from '../../../core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  getAllGenres(): Observable<any> {
    this.logger.info('Fetching all genres');
    return this.http.get(API_URLS.GET_ALL_GENRES);
  }

  getGenreById(id: number): Observable<any> {
    this.logger.info(`Fetching genre with id: ${id}`);
    return this.http.get(`${API_URLS.GET_GENRE_BY_ID}?id=${id}`);
  }

  createGenre(genreData: any): Observable<any> {
    this.logger.info('Creating new genre');
    return this.http.post(API_URLS.CREATE_GENRE, genreData);
  }

  updateGenre(genreData: any): Observable<any> {
    this.logger.info('Updating genre');
    return this.http.put(API_URLS.UPDATE_GENRE, genreData);
  }

  deleteGenre(id: number): Observable<any> {
    this.logger.info(`Deleting genre with id: ${id}`);
    return this.http.delete(`${API_URLS.DELETE_GENRE}?id=${id}`);
  }
}