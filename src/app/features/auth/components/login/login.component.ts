import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../services/auth.service';
// import jwtDecode from 'jwt-decode';
import { AuthService } from '../../../../core/authentication/auth.service';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private logger: LoggerService,
    // private toaster: ToastrService,
    // private cookieService: CookieService,
  ) {
    localStorage.clear(); // Har safar login sahifasiga kelinganda localStorage tozalanadi
  }

  /**
   * Initialize the component and set up the login form with validation
   */
  ngOnInit(): void {
    try {
      this.logger.info('LoginComponent initialized');
      // Login formani validatsiya bilan yaratish
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    } catch (error) {
      this.logger.error(`Error initializing login form: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Handle form submission for login
   */
  onSubmit(): void {
    try {
      // Check internet connection
      if (!navigator.onLine) {
        alert('Siz internetga ulanmagansiz!');
        this.logger.warn('Login attempt without internet connection');
        return; // Internet yo'q bo'lsa, jarayonni to'xtatish
      }
      
      // Validate form
      if (!this.loginForm.valid) {
        this.logger.warn('Login form submitted with invalid data');
        return;
      }

      const formData = this.loginForm.value;
      this.logger.info('Attempting login');

      // AuthService orqali login qilish
      this.authService.login(formData).subscribe({
        next: (data) => {
          // Cookie yoki localStorage orqali foydalanuvchi ma'lumotlarini saqlash
          const userData = {
            token: data.access,
            is_designer: data.is_designer,
            is_director: data.is_director,
          };
          localStorage.setItem('userData', JSON.stringify(userData));

          // Navigate to home page
          this.router.navigate(['/']);
          this.logger.info('User authenticated successfully');
        },
        error: (err) => {
          // Handle specific error cases
          if (err.status === 401) {
            alert("Foydalanuvchi nomi yoki parol noto'g'ri.");
            this.logger.warn('Invalid username or password');
          } else if (err.status >= 500) {
            alert("Server xatosi. Iltimos keyinroq urinib ko'ring.");
            this.logger.error(`Server error during login: ${err.status}`);
          } else {
            alert("Tizimga kirishda xatolik yuz berdi.");
            this.logger.error(`Login error: ${JSON.stringify(err)}`);
          }
        },
      });
    } catch (error) {
      this.logger.error(`Unexpected error in login submission: ${JSON.stringify(error)}`);
      alert("Tizimga kirishda kutilmagan xatolik yuz berdi.");
    }
  }
}
