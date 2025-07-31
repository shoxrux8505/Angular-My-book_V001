import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { AuthService } from '../authentication/auth.service';
// import { LoggerService } from './logger.service'; // Logger xizmati import qilingan

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    @Inject(BROWSER_STORAGE) 
    private router: Router,
     private logger: LoggerService, 
     private authService: AuthService
  ) {}

  // Foydalanuvchini avtorizatsiyadan o'tganini tekshiradi
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    // Misol uchun bu yerda foydalanuvchini avtorizatsiya holatini tekshirish kerak
    const data = this.authService.isAuthenticated(); // Haqiqiy avtorizatsiya tekshiruvi bo'lishi kerak
    // this.logger.info(`Is user authenticated: ${data}`);
    if (data) {
      console.log(data);
      this.logger.info('User is authenticated'); // Logger xizmati orqali kuzatish
      return true;
    } else {
      this.logger.warn('User is not authenticated, redirecting to login'); // Logger orqali xato loglash
      window.location.href = '/auth/register';
      // this.router.navigate(['/auth/register']);
      return false;
    }
  }

  // Child marshrutlar uchun ham xuddi shu tekshiruvni amalga oshiramiz
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(route, state);
  }
}
