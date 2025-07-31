import { Component, OnInit } from '@angular/core';
import { RegisterDTO } from '../../../../core/models/register.model';
import { AuthService } from '../../../../core/authentication/auth.service';
import { Router } from '@angular/router';
import { CountryService } from '../../../../features/home/services/country.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isSignIn: boolean = false;
  countriesList: any[] = [];
  loginDTO: any = {};
  registerData: RegisterDTO = {
    full_name: '',
    phone_number: '',
    email: '',
    password: '',
    country_id: 0
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private countryService: CountryService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private logger: LoggerService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit(): void {
    try {
      this.logger.info('RegisterComponent initialized');
      this.loadCountriesList();
      
      // Set isSignIn to true after 3 seconds
      setTimeout(() => {
        this.isSignIn = true;
      }, 3000);
    } catch (error) {
      this.logger.error(`Error in ngOnInit: ${JSON.stringify(error)}`);
      this.message.error('Tizimni yuklashda xatolik');
    }
  }

  /**
   * Load countries list from the service
   */
  private loadCountriesList(): void {
    try {
      this.countryService.getAllCountries().subscribe({
        next: (response: any) => {
          this.countriesList = response;
          this.logger.info(`Loaded ${this.countriesList.length} countries`);
        },
        error: (error: any) => {
          this.logger.error(`Failed to load countries: ${JSON.stringify(error)}`);
          this.message.error('Davlatlar ro\'yxatini yuklashda xatolik');
        }
      });
    } catch (error) {
      this.logger.error(`Unexpected error loading countries: ${JSON.stringify(error)}`);
      this.message.error('Davlatlar ro\'yxatini yuklashda kutilmagan xatolik');
    }
  }

  /**
   * Toggle between sign in and sign up forms
   */
  toggle(): void {
    this.isSignIn = !this.isSignIn;
    this.logger.info(`Toggled to ${this.isSignIn ? 'sign in' : 'sign up'} form`);
  }

  /**
   * Handle file selection for profile picture
   */
  onFileSelected(event: any): void {
    try {
      const file = event.target.files[0];
      if (file) {
        this.registerData.picture = file;
        this.logger.info(`File selected: ${file.name}`);
      }
    } catch (error) {
      this.logger.error(`Error selecting file: ${JSON.stringify(error)}`);
      this.message.error('Faylni tanlashda xatolik');
    }
  }

  /**
   * Register a new user
   */
  register(): void {
    try {
      // Validate required fields
      if (!this.registerData.email || !this.registerData.password || !this.registerData.full_name) {
        this.message.warning('Barcha majburiy maydonlarni to\'ldiring');
        return;
      }

      this.logger.info('Attempting to register user');
      this.authService.registerUser(this.registerData).subscribe({
        next: (response: any) => {
          this.message.success('Ro\'yxatdan o\'tdingiz');
          this.logger.info('User registered successfully');
          this.updateCountryStatistics();
          this.isSignIn = true;
        },
        error: (error: any) => {
          this.handleRegistrationError(error);
        }
      });
    } catch (error) {
      this.logger.error(`Unexpected error during registration: ${JSON.stringify(error)}`);
      this.message.error('Ro\'yxatdan o\'tishda kutilmagan xatolik yuz berdi');
    }
  }

  /**
   * Update country statistics after successful registration
   */
  private updateCountryStatistics(): void {
    try {
      if (this.registerData.country_id) {
        this.countryService.addPersonCountry(this.registerData.country_id).subscribe({
          next: (response: any) => {
            this.logger.info(`Country statistics updated for country ID: ${this.registerData.country_id}`);
          },
          error: (error: any) => {
            this.logger.warn(`Failed to update country statistics: ${JSON.stringify(error)}`);
          }
        });
      }
    } catch (error) {
      this.logger.error(`Error updating country statistics: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Handle registration errors
   */
  private handleRegistrationError(error: any): void {
    if (error.status === 409) {
      this.message.warning('Bu email allaqachon ro\'yxatdan o\'tgan');
      this.logger.warn('Registration failed: Email already exists');
    } else if (error.status >= 500) {
      this.message.error('Server xatosi. Iltimos keyinroq urinib ko\'ring');
      this.errorMessage = "Server xatosi";
    } else {
      this.message.error('Xatolik mavjud!');
      this.errorMessage = error.error?.title || 'Noma\'lum xatolik';
    }
    this.logger.error(`Registration failed: ${JSON.stringify(error)}`);
  }

  /**
   * Log in with the provided credentials
   */
  login(): void {
    try {
      // Validate required fields
      if (!this.loginDTO || !this.loginDTO.email || !this.loginDTO.password) {    
        this.message.warning('Email va parolni kiriting');
        return;
      }

      this.logger.info('Attempting to login');
      this.authService.login(this.loginDTO).subscribe({
        next: (response: any) => {
          this.message.success('Muvaffaqiyatli tizimga kirdingiz.');
          this.logger.info('User logged in successfully');
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          if (error.status === 401) {
            this.message.error('Email yoki parol xato!');
            this.logger.warn('Invalid login credentials');
          } else if (error.status >= 500) {
            this.message.error('Server xatosi. Iltimos keyinroq urinib ko\'ring');
            this.logger.error(`Server error during login: ${error.status}`);      
          } else {
            this.message.error('Tizimga kirishda xatolik yuz berdi');   
            this.logger.error(`Login failed: ${JSON.stringify(error)}`);
          }
        }
      });
    } catch (error) {
      this.logger.error(`Unexpected error during login: ${JSON.stringify(error)}`);
      this.message.error('Tizimga kirishda kutilmagan xatolik yuz berdi');
    }
  }
}
