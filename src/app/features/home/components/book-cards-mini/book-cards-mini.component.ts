import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../../core/services/user.service";
import {jwtDecode} from "jwt-decode";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {environment} from "../../../../../environments/environment";
import {BookService} from "../../services/book.service";
import {Book} from "../book-detail/book-detail.model";
import { LoggerService } from '../../../../core/services/logger.service';
import { ImageFallbackService } from '../../../../shared/services/image-fallback.service';

@Component({
  selector: 'app-book-cards-mini',
  templateUrl: './book-cards-mini.component.html',
  styleUrl: './book-cards-mini.component.scss'
})
export class BookCardsMiniComponent implements OnInit {
  userId: number | null = null;
  baseUrl: string = "";
  @Input() books: Book[] = [];
  data: Book | null = null;
  @Input() bookId: number | null = null;

  constructor(
    private userService: UserService,
    private notification: NzNotificationService,
    private bookService: BookService,
    private message: NzNotificationService,
    private logger: LoggerService,
    private imageFallbackService: ImageFallbackService
  ) {
  }

  /**
   * Initialize component
   */
  ngOnInit(): void {
    try {
      // Set base URL from environment
      this.baseUrl = environment.baseUrl;
      
      // Get user ID from local storage
      this.getUserIdFromLocalStorage();
      
      // Initialize book data based on inputs
      this.initializeBookData();
    } catch (error) {
      this.logger.error(`Error in ngOnInit: ${JSON.stringify(error)}`);
      this.notification.error('Xatolik', 'Ilovani yuklashda xatolik yuz berdi');
    }
  }
  
  /**
   * Extract user ID from JWT token in localStorage
   */
  private getUserIdFromLocalStorage(): void {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user: any = jwtDecode(userData);
        if (user && user.UserId) {
          this.userId = user.UserId;
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
   * Initialize book data based on inputs
   */
  private initializeBookData(): void {
    if (this.bookId) {
      this.logger.info(`Fetching book with ID: ${this.bookId}`);
      this.getBook(this.bookId);
    } else if (this.books && this.books.length > 0) {
      this.logger.info(`Books array provided with ${this.books.length} items`);
    } else {
      this.logger.warn("No book data available");
    }
  }

  /**
   * Remove a book from user's favorites
   * @param event Optional event to stop propagation (for list view)
   * @param book The book to remove from favorites
   */
  removeFromFavorites(event: Event | null, book: Book): void {
    if (!this.userId) {
      this.notification.warning('Ogohlantirish', 'Iltimos, tizimga kiring');
      this.logger.warn('Cannot remove from favorites: User not logged in');
      return;
    }

    // Prevent event bubbling if event is provided (list view)
    if (event) {
      event.stopPropagation();
    }

    const formData = new FormData();
    formData.append('UserId', this.userId.toString());
    formData.append('BookId', book.id.toString());

    this.logger.info(`Removing book ${book.id} from favorites for user ${this.userId}`);
    this.userService.removeBookFromUser(formData).subscribe({
      next: () => {
        this.notification.info('O\'chirildi', 'Kitob yoqqanlardan o\'chirildi.');
        
        // Update UI based on context
        if (event && this.books && Array.isArray(this.books)) {
          // In list view, remove book from the books array
          this.books = this.books.filter((b: Book) => b.id !== book.id);
        } else if (book.user_ids) {
          // In detail view, update user_ids
          book.user_ids = book.user_ids.filter((id: number) => id !== this.userId);
        }
        
        this.logger.info(`Book ${book.id} successfully removed from favorites`);
      },
      error: (error: any) => {
        this.logger.error(`Error removing book from favorites: ${JSON.stringify(error)}`);
        
        let errorMessage = 'Xatolik yuz berdi!';
        if (error?.status === 404) {
          errorMessage = 'Kitob topilmadi';
        } else if (error?.status >= 500) {
          errorMessage = 'Server xatosi';
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.notification.error('Xatolik', errorMessage);
      }
    });
  }

  /**
   * Fetch book details by ID
   * @param id The book ID to fetch
   */
  getBook(id: number): void {
    this.bookService.getBookById(id).subscribe({
      next: (book: Book) => {
        if (book) {
          this.data = book;
          this.logger.info(`Book details loaded: ${book.name} (ID: ${book.id})`);
        } else {
          this.logger.warn(`Received empty book data for ID: ${id}`);
          this.message.warning('Ogohlantirish', 'Kitob ma\'lumotlari topilmadi');
        }
      },
      error: (error: any) => {
        this.logger.error(`Error fetching book with ID ${id}: ${JSON.stringify(error)}`);
        let errorMessage = 'Tarmoq xatosi';
        
        if (error?.status === 404) {
          errorMessage = 'Kitob topilmadi';
        } else if (error?.status >= 500) {
          errorMessage = 'Server xatosi';
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status) {
          errorMessage = `Xatolik kodi: ${error.status}`;
        }
        
        this.message.error('Xatolik', `Kitob ma'lumotlarini yuklashda xatolik yuz berdi: ${errorMessage}`);
      }
    });
  }

  /**
   * Get the appropriate icon class for the book
   * @param book The book to check
   * @returns Icon class string
   */
  getBookmarkIcon(book: Book): string {
    if (!book || !this.userId) return 'fa-regular fa-bookmark';
    return book.user_ids && book.user_ids.includes(this.userId) ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
  }
  
  /**
   * Get book image URL with fallback support
   * @param book The book object
   * @returns A valid image URL
   */
  getBookImageUrl(book: Book | null): string {
    if (!book) return this.imageFallbackService.getBookImageUrl(null);
    return this.imageFallbackService.getBookImageUrl(book.picture_url, book.type);
  }

  /**
   * Add a book to user's favorites
   * @param book The book to add to favorites
   */
  addToFavorites(book: Book): void {
    if (!this.userId) {
      this.message.warning('Ogohlantirish', 'Iltimos, tizimga kiring');
      this.logger.warn('Cannot add to favorites: User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('UserId', this.userId.toString());
    formData.append('BookId', book.id.toString());

    this.logger.info(`Adding book ${book.id} to favorites for user ${this.userId}`);
    this.userService.addBookToUser(formData).subscribe({
      next: () => {
        this.message.success('Muvaffaqiyat', 'Yoqgan kitoblarga muvaffaqiyatli qo\'shildi.');
        if (!book.user_ids) {
          book.user_ids = [];
        }
        if (this.userId !== null) {
          book.user_ids.push(this.userId);
        }
        this.logger.info(`Book ${book.id} successfully added to favorites`);
      },
      error: (error: any) => {
        this.logger.error(`Error adding book to favorites: ${JSON.stringify(error)}`);
        
        let errorMessage = 'Allaqachon yoqgan kitoblarga qo\'shilgan!';
        if (error?.status === 404) {
          errorMessage = 'Kitob topilmadi';
        } else if (error?.status >= 500) {
          errorMessage = 'Server xatosi';
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.message.error('Xatolik', errorMessage);
      }
    });
  }

  /**
   * Toggle a book's favorite status
   * @param book The book to toggle favorite status
   */
  toggleFavorite(book: Book): void {
    if (!book) {
      this.logger.warn('Cannot toggle favorite: Book is undefined');
      return;
    }

    if (!this.userId) {
      this.message.warning('Ogohlantirish', 'Iltimos, tizimga kiring');
      this.logger.warn('Cannot toggle favorite: User not logged in');
      return;
    }

    if (book.user_ids?.includes(this.userId)) {
      this.removeFromFavorites(null, book); // Remove from favorites
    } else {
      this.addToFavorites(book); // Add to favorites
    }
  }
}
