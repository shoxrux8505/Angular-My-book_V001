import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service'; // Logger service import
import { AuthService } from '../authentication/auth.service'; // Auth service import
// import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router, private logger: LoggerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.logger.info('HTTP request intercepted'); // Log HTTP request
    
    // Tokenni localStorage ichidan userData kalitidan olish
    const token = this.authService.getToken(); // Tokenni userData'dan chiqarib olish

    // Check if the request needs authentication (exclude public endpoints)
    const publicEndpoints = ['/api/Authors/', '/api/Books/', '/api/BookCategories', '/api/Genres/', '/api/GeneralCategories', '/api/GeneralGroups'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    // Agar token mavjud bo'lsa va endpoint authentication talab qilsa, so'rovga Authorization headerini qo'shish
    if (token && !isPublicEndpoint) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // Bearer prefix bilan tokenni qo'shish
        },
      });
    }

    // So'rovni jo'natishda log qilish va xatolarni boshqarish
    return next.handle(req).pipe(
      // Xatolarni boshqarish
      catchError((error: HttpErrorResponse) => {
        // Agar foydalanuvchi avtorizatsiya qilinmagan bo'lsa (401 yoki 403)
        if (error.status === 401 || error.status === 403) {
          this.logger.warn('Unauthorized or Forbidden - redirecting to login'); // Log qilish
          // this.router.navigate(['/auth/login']); // Login sahifasiga yo'naltirish
          // this.toaster.error('Foydalanuvchi email yoki parol noto`g`ri!', 'Xatolik'); // TODO: Uncomment when toastr is available
        }else if(error.status === 404){
          // this.toaster.error("Foydalanuvchi topilmadi!", "Xatolik"); // TODO: Uncomment when toastr is available
        }else{
          // this.toaster.error(error.message, "Xatolik"); // TODO: Uncomment when toastr is available
        }
        // this.logger.error(`HTTP Error: ${error}`); // Xatoni log qilish
        console.log(error);
        return throwError(error); // Xatoni qayta jo'natish
      }),
      finalize(() => {
        this.logger.info('HTTP request completed'); // HTTP so'rov tugaganini log qilish
      })
    );
  }
}
