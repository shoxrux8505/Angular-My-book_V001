import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URLS, ROLES } from '../../config/constants'; // constants.ts dan import qilish
// import { LoggerService } from '../services/logger.service';
import { RegisterDTO } from '../models/register.model';
import { jwtDecode } from 'jwt-decode';
// import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private rolesSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]); // Ro‘llarni kuzatish uchun BehaviorSubject
  // private currentUserSubject: BehaviorSubject<any>;
  // public currentUser: Observable<any>;
  constructor(
    private http: HttpClient,
    private router: Router,
    // private logger: LoggerService,
    // private toaster: ToastrService
  ) {
    // BehaviorSubject'dan foydalanuvchini olish
    // this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('userData') || '{}'));
    // this.currentUser = this.currentUserSubject.asObservable();

    // Ro‘llarni localStorage'dan yuklash, agar mavjud bo'lsa
    var role: any
    
    try{
      role = jwtDecode(localStorage.getItem('userData') as string);
      role = role.Role == 'Admin' ? ROLES.ADMIN : ROLES.USER;
    }catch(e){
      // this.logger.error('Error decoding JWT token: ' + JSON.stringify(e));
      console.log(e)
    }
    




    this.setUserRoles(role);
    
    const storedRoles = this.getStoredUserRoles();
    if (storedRoles) {
      this.rolesSubject.next(storedRoles); // Ro‘llarni yangilash
    }
  }

  // Foydalanuvchini login qilish
  login(data: any): Observable<any> {
    return this.http.post<any>(API_URLS.LOGIN_URL, data).pipe(  // constants.ts dan URL olindi
      tap(user => {
        if (user && user.token) {
          // this.logger.info('Login successful for user');
          console.log(user);
          // Foydalanuvchini localStorage va BehaviorSubject'da saqlash
          localStorage.setItem('userData', JSON.stringify(user)); // Ma'lumotlarni saqlash
          // const [roles, token] = this.getRolesFromUser(user.Role === "Admin" ? ROLES.ADMIN : ROLES.USER, user.token); // Ro‘llarni olish
          // this.rolesSubject.next([roles]); // Ro‘llarni yangilash
          // Logger is commented out, using console for now
          console.log(this.rolesSubject)
        }
      }),
      catchError(this.handleError) // Xatolarni boshqarish
    );
  }

  registerUser(data: RegisterDTO): Observable<any> {
    const formData = new FormData();
    formData.append('FullName', data.full_name);
    formData.append('PhoneNumer', data.phone_number);
    formData.append('Email', data.email);
    formData.append('Password', data.password);
    formData.append('CountryId', data.country_id.toString());

    if (data.picture) {
      formData.append('Picture', data.picture);
    }

    return this.http.post(`${API_URLS.REGISTER_URL}`, formData);
  }

  // Foydalanuvchini logout qilish
  logout(): void {
    // localStorage'dan foydalanuvchini o'chirish va BehaviorSubject'da ro‘llarni yangilash
    localStorage.removeItem('userData'); // Ma'lumotlarni o'chirish
    this.rolesSubject.next([]); // Ro‘llarni bo'shatish
    this.router.navigate(['/auth/register']); // Login sahifasiga yo‘naltirish
  }

    // Avtorizatsiya tekshiruvini bu yerda amalga oshiramiz
    public isAuthenticated(): any {
      // const user = this.currentUserSubject.value;
      // this.logger.info(user);
      // if(!this.getStoredUserRoles()){
      //   return false;
      // }

      if(this.getStoredUserRoles().length == 0){
        return false;
      }
      
      // Logger is commented out, using console for now
      console.log(this.getStoredUserRoles())

      return this.getStoredUserRoles();
    }

  // Foydalanuvchining rollarini kuzatish (Observable orqali)
  getUserRoles(): Observable<any> {
    return this.rolesSubject.asObservable(); // Observable orqali ro‘llarni kuzatish
  }

  // Ro‘llarni o‘rnatish (kuzatish uchun)
  setUserRoles(roles: string[]): void {
    this.rolesSubject.next(roles); // Ro‘llarni BehaviorSubject orqali yangilash
  }

  // Foydalanuvchi rollarini localStorage'dan olish
  private getStoredUserRoles(): string[] {

    try {
      const userData = JSON.parse(localStorage.getItem('userData') as string);
      
      if(userData != null){
        var role: any = jwtDecode(userData.token);
        // Logger is commented out, using console for now
        console.log(userData.token)
        console.log(role)
        return this.getRolesFromUser(role.Role == 'Admin' ? ROLES.ADMIN : ROLES.USER, userData.token);
      }
      return new Array<string>();
    } catch (error) {
      // this.logger.error('Error parsing user data: ' + JSON.stringify(error));
      console.error('Error parsing user data:', error);
      // this.toaster.info('Foydalanuvchi oldin ro\'yhatdan o\'tgan bo\'lishi kerak!', 'Info');
      return new Array<string>();
    }
  }

  // Foydalanuvchi ob'ektidan ro‘llarni olish
  private getRolesFromUser(role: any, token: any): string[] {
    var data: any = { 
      roles: role, 
      token: token
    };
    return data; // constants.ts dan rollar
  }

  // Xatolarni boshqarish uchun umumiy funksiya
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Xato yuz berdi';
    if (error.error instanceof ErrorEvent) {
      // Client-side xatolar
      errorMessage = `Client xatosi: ${error.error.message}`;
    } else {
      // Server-side xatolar
      errorMessage = `Server xatosi: ${error.status}\nXabar: ${error.message}`;
    }
    return throwError(errorMessage); // Observable orqali xato qaytarish
  }

  getToken(): string | null {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData?.token || null;
  }
}
