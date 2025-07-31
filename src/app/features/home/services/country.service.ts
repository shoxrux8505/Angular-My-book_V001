import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../../../core/services/logger.service';
// import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../config/constants';

@Injectable({
  providedIn: 'root'
})

export class CountryService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService,
    // private toaster: ToastrService
  ) { }

  getAllCountries(): Observable<any> {
    // Countries endpoint is not available in the current API
    // Return empty array or implement alternative solution
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  addPersonCountry(data: any): Observable<any> {
    // Countries endpoint is not available in the current API
    // Return success response or implement alternative solution
    return new Observable(observer => {
      observer.next({ success: false, message: 'Countries endpoint not available' });
      observer.complete();
    });
  }
}
