import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoggerService} from '../../../../core/services/logger.service';
import {CategoryService} from '../../services/category.service';
import {BookService} from '../../services/book.service';
import {List, shuffle} from 'lodash';
import {API_URLS} from '../../../../config/constants';
import {environment} from '../../../../../environments/environment';
import {AuthorService} from "../../services/author.service";
import {DataService} from "../../../../core/services/data.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ImageFallbackService} from "../../../../shared/services/image-fallback.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  baseUrl = environment.baseUrl
  randomBook: any
  randomCategories: Array<any> = []
  topBooks: Array<any> = []
  authors: any;
  lastExecuted = 0; // Oxirgi ishga tushirilgan vaqtni saqlaydi
  runCount = 0;
  testData: string | null = null

  carouselImages = [
    `${environment.baseUrl}/assets/images/slide1.jpg`,
    `${environment.baseUrl}/assets/images/slide2.jpg`,
    `${environment.baseUrl}/assets/images/slide3.jpg`,
  ];

  constructor(
    private router: Router,
    private logger: LoggerService,
    private categoryService: CategoryService,
    private bookService: BookService,
    private authorService: AuthorService,
    private dataService: DataService,
    private notification: NzNotificationService,
    private imageFallbackService: ImageFallbackService
  ) {
  }

  /**
   * Initialize the component and load all required data
   */
  ngOnInit(): void {
    try {
      this.logger.info('HomeComponent initialized');
      
      // Subscribe to data service messages
      this.subscribeToDataService();
      
      // Load all required data
      this.loadRandomBook();
      this.loadTopBooks();
      this.loadCategories();
      this.loadAuthors();
    } catch (error) {
      this.logger.error(`Error in ngOnInit: ${JSON.stringify(error)}`);
      this.notification.error('Xatolik', 'Bosh sahifani yuklashda xatolik yuz berdi');
    }
  }

  /**
   * Subscribe to data service messages
   */
  private subscribeToDataService(): void {
    this.dataService.currentMessage.subscribe({
      next: (message) => {
        this.testData = message;
        this.logger.info('Received message from data service');
      },
      error: (error) => {
        this.logger.error(`Error receiving message from data service: ${JSON.stringify(error)}`);
      }
    });
  }

  /**
   * Load a random book for display
   */
  private loadRandomBook(): void {
    this.bookService.getRandomBook().subscribe({
      next: (res) => {
        // Select a random book from the returned array since API returns all books
        if (res && res.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.length);
          this.randomBook = res[randomIndex];
          this.logger.info(`Random book loaded: ${this.randomBook.name}`);
        } else {
          this.logger.warn('No books returned for random selection');
        }
      },
      error: (error) => {
        if (error.status >= 500) {
          this.notification.error('Xatolik', 'Server xatosi. Iltimos keyinroq urinib ko\'ring');
          this.logger.error(`Server error fetching random book: ${error.status}`);
        } else {
          this.notification.error('Xatolik', 'Tasodifiy kitobni yuklashda xatolik');
          this.logger.error(`Error fetching random book: ${JSON.stringify(error)}`);
        }
      }
    });
  }

  /**
   * Load top books for display
   */
  private loadTopBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          // API returns array directly, not wrapped in 'items'
          this.topBooks = res.slice(0, 3);
          this.logger.info(`Successfully loaded ${this.topBooks.length} top books for homepage`);
        } else {
          this.logger.warn('No books returned from API');
        }
      },
      error: (error) => {
        if (error.status >= 500) {
          this.notification.error('Xatolik', 'Server xatosi. Iltimos keyinroq urinib ko\'ring');
          this.logger.error(`Server error fetching books: ${error.status}`);
        } else {
          const errorStatus = error?.status ? error.status : 'Tarmoq xatosi';
          this.notification.error('Xatolik', `Kitoblarni yuklashda xatolik yuz berdi: ${errorStatus}`);
          this.logger.error(`Error fetching books: ${JSON.stringify(error)}`);
        }
      }
    });
  }

  /**
   * Load categories for display
   */
  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.randomCategories = this.randomCategoryImage(res);
          this.logger.info(`Successfully loaded ${this.randomCategories.length} random categories`);
        } else {
          this.logger.warn('No categories returned from API');
        }
      },
      error: (error) => {
        if (error.status >= 500) {
          this.notification.error('Xatolik', 'Server xatosi. Iltimos keyinroq urinib ko\'ring');
          this.logger.error(`Server error fetching categories: ${error.status}`);
        } else {
          this.notification.error('Xatolik', 'Kategoriyalarni yuklashda xatolik');
          this.logger.error(`Error fetching categories: ${JSON.stringify(error)}`);
        }
      }
    });
  }

  /**
   * Select random categories from the provided array
   * @param imageArray Array of categories to select from
   * @returns Array of randomly selected categories
   */
  randomCategoryImage(imageArray: Array<any>): any {
    return shuffle(imageArray).slice(0, 3);
  }
  
  /**
   * Get book image URL with fallback support
   * @param book The book object
   * @returns A valid image URL
   */
  getBookImageUrl(book: any): string {
    if (!book) return this.imageFallbackService.getBookImageUrl(null);
    return this.imageFallbackService.getBookImageUrl(book.imagePath || book.picture_url, book.type);
  }

  /**
   * Load all authors for display
   */
  private loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        if (authors) {
          this.authors = authors;
          this.logger.info('Authors fetched successfully');
        } else {
          this.logger.warn('No authors returned from API');
        }
      },
      error: (error) => {
        if (error.status >= 500) {
          this.notification.error('Xatolik', 'Server xatosi. Iltimos keyinroq urinib ko\'ring');
          this.logger.error(`Server error fetching authors: ${error.status}`);
        } else {
          this.notification.error('Xatolik', 'Mualliflarni yuklashda xatolik');
          this.logger.error(`Error fetching authors: ${JSON.stringify(error)}`);
        }
      }
    });
  }
}
