import {Component, OnInit} from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
import { LoggerService } from '../../../../core/services/logger.service';
import { UserService } from '../../../../core/services/user.service';
import { jwtDecode } from 'jwt-decode';
import { API_URLS } from '../../../../config/constants';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Book } from '../book-detail/book-detail.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  constructor(
    private profileService: UserService,
    private toaster: ToastrService,
    private logger: LoggerService,
    private userService: UserService
  ) { }

  favoriteBooks: Book[] = [];

  user: any;
  userPicture: string = "";
  baseUrl = environment.baseUrl
  date = new Date();
  createdAt: any
  userId: any

  /**
   * Initialize component
   */
  ngOnInit(): void {
    try {
      this.logger.info('ProfileComponent initialized');
      this.loadUserProfile();
    } catch (error) {
      this.logger.error(`Error in ngOnInit: ${JSON.stringify(error)}`);
      this.toaster.error('Xatolik', 'Profil ma\'lumotlarini yuklashda xatolik');
    }
  }

  /**
   * Load user profile data from the service
   */
  private loadUserProfile(): void {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        this.logger.warn('No user data found in localStorage');
        this.toaster.warning('Ogohlantirish', 'Foydalanuvchi ma\'lumotlari topilmadi');
        return;
      }

      const user: any = jwtDecode(userData);
      if (!user || !user.UserId) {
        this.logger.warn('Invalid user data format in token');
        this.toaster.warning('Ogohlantirish', 'Foydalanuvchi ma\'lumotlari noto\'g\'ri formatda');
        return;
      }

      this.userId = user.UserId;
      this.fetchUserData(this.userId);
    } catch (error) {
      this.logger.error(`Error parsing user data: ${JSON.stringify(error)}`);
      this.toaster.error('Xatolik', 'Foydalanuvchi ma\'lumotlarini o\'qishda xatolik');
    }
  }

  /**
   * Fetch user data from the API
   * @param userId The ID of the user to fetch
   */
  private fetchUserData(userId: number): void {
    this.profileService.getUserById(userId).subscribe({
      next: (response) => {
        this.user = response;
        this.date = new Date(this.user.created_at);
        this.logger.info(`User profile loaded successfully for user ID: ${userId}`);
        
        this.processFavoriteBooks();
        this.setUserPicture();
      },
      error: (error) => {
        this.logger.error(`Error fetching profile data: ${JSON.stringify(error)}`);
        
        // Provide more specific error messages based on status code
        if (error?.status === 404) {
          this.toaster.error('Xatolik', 'Foydalanuvchi topilmadi');
        } else if (error?.status >= 500) {
          this.toaster.error('Xatolik', 'Server xatosi');
        } else {
          this.toaster.error('Xatolik', 'Profil ma\'lumotlarini yuklashda xatolik');
        }
      }
    });
  }

  /**
   * Process user's favorite books
   */
  private processFavoriteBooks(): void {
    if (this.user?.user_books && Array.isArray(this.user.user_books)) {
      this.favoriteBooks = this.user.user_books.map((book: any) => {
        return {
          id: book.id || 0,
          name: book.name || book.title || '',
          type: book.type || '',
          year: book.year || 0,
          description: book.description || '',
          length: book.length || 0,
          created_at: book.created_at || '',
          updated_at: book.updated_at || '',
          picture_url: book.picture_url || '',
          pdf_url: book.pdf_url || '',
          count: book.count || 0,
          category_name: book.category_name || '',
          author_name: book.author_name || book.author || '',
          user_ids: book.user_ids || []
        } as Book;
      });
      this.logger.info(`Processed ${this.favoriteBooks.length} favorite books`);
    } else {
      this.logger.info('No favorite books found for user');
    }
  }

  /**
   * Set the user's profile picture
   */
  private setUserPicture(): void {
    if (this.user?.picture_url) {
      const formattedPictureUrl = this.user.picture_url?.startsWith('/') ? this.user.picture_url.substring(1) : this.user.picture_url;
      this.userPicture = `${this.baseUrl}/UserImage/${formattedPictureUrl}`;
      this.logger.info(`User picture set from API: ${this.userPicture}`);
    } else {
      this.userPicture = "../../../../../assets/imgs/avatar.png";
      this.logger.info('Using default avatar image');
    }
  }
}

// No commented-out code - clean implementation
