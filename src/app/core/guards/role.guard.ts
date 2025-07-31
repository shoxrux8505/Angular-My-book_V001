import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router, 
    // private toastr: ToastrService, 
    private logger: LoggerService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const expectedRoles = route.data['roles'] as Array<string>;

    // Foydalanuvchi ro'llarini kuzatish
    return this.authService.getUserRoles().pipe(
      map((userRoles) => {
        // Foydalanuvchining rollarini tekshirish
        console.log(userRoles);
        console.log(expectedRoles);
        const hasRole = expectedRoles?.some((role) => userRoles.roles === role);

        this.logger.info(`User has role: ${expectedRoles}`);

        // Agar user roli topilmasa, xato va login sahifasiga yo'naltirish
        if (userRoles.roles === null) {
          // this.toastr.warning('Foydalanuvchi roli topilmadi!', 'Xatolik');
          console.log('Foydalanuvchi roli topilmadi!');
          this.router.navigate(['/auth/register']);
          return false;
        }

        // Agar userning ruxsati bo'lmasa, Access Denied sahifasiga yo'naltirish
        if (!hasRole) {
          this.router.navigate(['/error-pages/access-denied']);
          return false;
        }

        return true;
      }),
      tap((canActivate: boolean) => {
        if (!canActivate) {
          console.log('Access Denied');
          // this.toastr.error('Sahifaga kirish uchun ruxsat yo\'q!', 'Xatolik');
        }
      })
    );
  }
}
