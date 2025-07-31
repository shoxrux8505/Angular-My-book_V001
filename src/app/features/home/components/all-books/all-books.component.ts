import {Component, OnInit} from '@angular/core';
import { BookService } from '../../services/book.service';
import { environment } from '../../../../../environments/environment';
import { UserService } from '../../../../core/services/user.service';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {ActivatedRoute} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";
import { LoggerService } from '../../../../core/services/logger.service';
import { ImageFallbackService } from '../../../../shared/services/image-fallback.service';

interface MyJwtPayload extends JwtPayload {
  UserId: number | null;
}

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.scss'],
})

export class AllBooksComponent implements OnInit {
  books: any = [];
  baseUrl = environment.baseUrl

  userId: number | null = null

  constructor(
    private bookService: BookService,
    private userService: UserService,
    private toaster: NzNotificationService,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private imageFallbackService: ImageFallbackService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit(): void {
    try {
      // Get user ID from local storage
      this.getUserIdFromLocalStorage();
      
      // Check for query parameters
      this.handleQueryParams();
      
      // Load all books
      this.loadAllBooks();
    } catch (error) {
      this.logger.error(`Error in ngOnInit: ${JSON.stringify(error)}`);
      this.toaster.error('Xatolik', 'Ilovani yuklashda xatolik yuz berdi');
    }
  }
  
  /**
   * Extract user ID from JWT token in localStorage
   */
  private getUserIdFromLocalStorage(): void {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const decodedToken = jwtDecode(userData) as MyJwtPayload;
        if (decodedToken && decodedToken.UserId) {
          this.userId = decodedToken.UserId;
          this.logger.info(`User authenticated with ID: ${this.userId}`);
        } else {
          this.logger.warn('Invalid user data format in token');
        }
      } else {
        this.logger.warn('No user data found in localStorage');
      }
    } catch (error) {
      this.logger.error(`Error parsing user data: ${JSON.stringify(error)}`);
    }
  }
  
  /**
   * Handle route query parameters
   */
  private handleQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['bookId']) {
        this.logger.info(`Query parameter bookId: ${params['bookId']}`);
        // Commented code for future implementation
        // this.bookService.getBooksByCategory(params['category']).subscribe(res => {
        //   this.books = res.items
        // })
      }
    });
  }
  
  /**
   * Load all books from the service
   */
  private loadAllBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (res) => {
        this.books = res.items;
        this.logger.info(`Successfully loaded ${this.books.length} books`);
      },
      error: (error) => {
        this.logger.error(`Error fetching books: ${JSON.stringify(error)}`);
        const errorStatus = error?.status ? error.status : 'Tarmoq xatosi';
        this.toaster.error('Xatolik', `Kitoblarni yuklashda xatolik yuz berdi: ${errorStatus}`);
      }
    });
  }

  /**
   * Add a book to user's favorites
   * @param book The book to add to favorites
   */
  addToFavorites(book: any): void {
    if (!this.userId) {
      this.toaster.warning('Ogohlantirish', 'Iltimos, avval tizimga kiring');
      return;
    }
    
    const formData = new FormData();
    formData.append('UserId', this.userId.toString());
    formData.append('BookId', book.id.toString());

    this.userService.addBookToUser(formData).subscribe({
      next: (response) => {
        this.toaster.success('Muvaffaqiyat', 'Yoqgan kitoblarga muvaffaqiyatli qo\'shildi.');
        if (!book.user_ids) {
          book.user_ids = [];
        }
        book.user_ids.push(this.userId); // Kitobning user_ids qatoriga qo'shish
        this.logger.info(`Book ${book.id} added to favorites for user ${this.userId}`);
      },
      error: (error) => {
        this.logger.error(`Error adding book to favorites: ${JSON.stringify(error)}`);
        
        // Provide more specific error messages based on status code
        if (error?.status === 404) {
          this.toaster.error('Xatolik', 'Kitob topilmadi');
        } else if (error?.status >= 500) {
          this.toaster.error('Xatolik', 'Server xatosi');
        } else {
          this.toaster.error('Xatolik', 'Allaqachon yoqgan kitoblarga qo\'shilgan!');
        }
      }
    });
  }

  /**
   * Remove a book from user's favorites
   * @param book The book to remove from favorites
   */
  removeFromFavorites(book: any): void {
    if (!this.userId) {
      this.toaster.warning('Ogohlantirish', 'Iltimos, avval tizimga kiring');
      return;
    }
    
    const formData = new FormData();
    formData.append('UserId', this.userId.toString());
    formData.append('BookId', book.id.toString());

    this.userService.removeBookFromUser(formData).subscribe({
      next: (response) => {
        this.toaster.info('O\'chirildi', 'Kitob yoqqanlardan o\'chirildi.');
        book.user_ids = book.user_ids.filter((id: number) => id !== this.userId); // Foydalanuvchini user_ids qatoridan o'chirish
        this.logger.info(`Book ${book.id} removed from favorites for user ${this.userId}`);
      },
      error: (error) => {
        this.logger.error(`Error removing book from favorites: ${JSON.stringify(error)}`);
        
        // Provide more specific error messages based on status code
        if (error?.status === 404) {
          this.toaster.error('Xatolik', 'Kitob topilmadi');
        } else if (error?.status >= 500) {
          this.toaster.error('Xatolik', 'Server xatosi');
        } else {
          this.toaster.error('Xatolik', 'Xatolik yuz berdi!');
        }
      }
    });
  }

  /**
   * Toggle a book's favorite status
   * @param book The book to toggle favorite status
   */
  toggleFavorite(book: any): void {
    if (!this.userId) {
      this.toaster.warning('Ogohlantirish', 'Iltimos, avval tizimga kiring');
      return;
    }
    
    if (book.user_ids?.includes(this.userId)) {
      this.removeFromFavorites(book); // Yoqqanlardan o'chirish
    } else {
      this.addToFavorites(book); // Yoqqanlarga qo'shish
    }
  }

  /**
   * Get the appropriate bookmark icon based on favorite status
   * @param book The book to check
   * @returns CSS class for the bookmark icon
   */
  getBookmarkIcon(book: any): string {
    if (book.user_ids?.includes(this.userId)) {
      return 'fa-solid fa-bookmark'; // Saqlangan ikonka
    } else {
      return 'fa-regular fa-bookmark'; // Oddiy ikonka
    }
  }

  /**
   * Get book image URL with fallback support
   * @param book The book object
   * @returns A valid image URL
   */
  getBookImageUrl(book: any): string {
    if (!book) return this.imageFallbackService.getBookImageUrl(null);
    return this.imageFallbackService.getBookImageUrl(book.picture_url, book.type);
  }

}
