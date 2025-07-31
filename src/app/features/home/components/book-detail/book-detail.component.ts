import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute} from "@angular/router";
import {BookService} from "../../services/book.service";
import {environment} from "../../../../../environments/environment";
import {Book} from "./book-detail.model";
import { LoggerService } from '../../../../core/services/logger.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ImageFallbackService } from '../../../../shared/services/image-fallback.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  // @Input() book: any;
  activeTab: string = 'info';
  showPdfViewer: boolean = false; // PDF viewer modal
  currentFile: string = ''; // Hozir ochilgan fayl
  book: Book | null = null;
  pdfUrl: string | null = null
  baseUrl = environment.baseUrl

  constructor(
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private bookService: BookService,
    private logger: LoggerService,
    private notification: NzNotificationService,
    private imageFallbackService: ImageFallbackService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit(): void {
    try {
      // Scroll to top of page
      window.scrollTo(0, 0);
      
      // Get book ID from route parameters and load book details
      this.loadBookFromRouteParams();
    } catch (error) {
      this.logger.error(`Error in ngOnInit: ${JSON.stringify(error)}`);
      this.notification.error('Xatolik', 'Ilovani yuklashda xatolik yuz berdi');
    }
  }
  
  /**
   * Extract book ID from route parameters and load book details
   */
  private loadBookFromRouteParams(): void {
    this.route.params.subscribe({
      next: (params) => {
        const bookId = params['bookId'];
        if (bookId) {
          this.logger.info(`Loading book with ID: ${bookId}`);
          this.loadBookDetails(bookId);
        } else {
          this.logger.warn('No book ID provided in route parameters');
          this.notification.warning('Ogohlantirish', 'Kitob identifikatori topilmadi');
        }
      },
      error: (error) => {
        this.logger.error(`Error getting route parameters: ${JSON.stringify(error)}`);
        this.notification.error('Xatolik', 'Sahifa parametrlarini olishda xatolik');
      }
    });
  }

  /**
   * Load book details from the service
   * @param bookId The ID of the book to load
   */
  private loadBookDetails(bookId: number): void {
    this.bookService.getBookById(bookId).subscribe({
      next: (book) => {
        this.book = book;
        this.logger.info(`Book details loaded successfully for book ID: ${bookId}`);
        
        // Set PDF URL if available
        if (book?.pdf_url) {
          const formattedPdfUrl = book.pdf_url?.startsWith('/') ? book.pdf_url.substring(1) : book.pdf_url;
          this.pdfUrl = `${this.baseUrl}/BookPdf/${formattedPdfUrl}`;
          this.logger.info(`PDF URL set: ${this.pdfUrl}`);
        }
      },
      error: (error) => {
        this.logger.error(`Error fetching book details: ${JSON.stringify(error)}`);
        
        // Provide more specific error messages based on status code
        if (error?.status === 404) {
          this.notification.error('Xatolik', 'Kitob topilmadi');
        } else if (error?.status >= 500) {
          this.notification.error('Xatolik', 'Server xatosi');
        } else {
          const errorStatus = error?.status ? error.status : 'Tarmoq xatosi';
          this.notification.error('Xatolik', `Kitob ma'lumotlarini yuklashda xatolik yuz berdi: ${errorStatus}`);
        }
      }
    });
  }

  /**
   * Close the PDF viewer modal
   */
  closePdfViewer(): void {
    try {
      this.showPdfViewer = false;
      this.currentFile = '';
      
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          this.logger.error(`Error exiting fullscreen: ${JSON.stringify(err)}`);
        });
      }
      
      this.logger.info('PDF viewer closed');
    } catch (error) {
      this.logger.error(`Error closing PDF viewer: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Enter fullscreen mode
   */
  openFullscreen(): void {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => {
          this.logger.info('Entered fullscreen mode');
        }).catch(err => {
          this.logger.error(`Error entering fullscreen: ${JSON.stringify(err)}`);
          this.notification.warning('Ogohlantirish', 'To\'liq ekran rejimiga o\'tishda xatolik');
        });
      } else {
        this.logger.warn('Fullscreen API not supported');
        this.notification.warning('Ogohlantirish', 'To\'liq ekran rejimi qo\'llab-quvvatlanmaydi');
      }
    } catch (error) {
      this.logger.error(`Error in openFullscreen: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Exit fullscreen mode
   */
  closeFullscreen(): void {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          this.logger.info('Exited fullscreen mode');
        }).catch(err => {
          this.logger.error(`Error exiting fullscreen: ${JSON.stringify(err)}`);
        });
      } else {
        this.logger.info('Not in fullscreen mode or API not supported');
      }
    } catch (error) {
      this.logger.error(`Error in closeFullscreen: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Open the PDF viewer modal
   * @param fileUrl Optional URL of the PDF file to display
   */
  openPdfViewer(fileUrl: string): void {
    try {
      // If fileUrl is provided, use it; otherwise use the book's PDF URL
      if (fileUrl) {
        this.currentFile = fileUrl;
      } else if (this.book?.pdf_url) {
        this.currentFile = this.getPdfUrl(this.book);
      } else {
        this.currentFile = '';
      }
      
      if (!this.currentFile && !this.book?.pdf_url) {
        this.logger.warn('No PDF URL available');
        this.notification.warning('Ogohlantirish', 'PDF fayl mavjud emas');
        return;
      }
      
      this.showPdfViewer = true;
      this.logger.info(`PDF viewer opened with file: ${this.currentFile || 'from book'}`);
    } catch (error) {
      this.logger.error(`Error opening PDF viewer: ${JSON.stringify(error)}`);
      this.notification.error('Xatolik', 'PDF faylni ochishda xatolik');
    }
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
   * Get book PDF URL with fallback support
   * @param book The book object
   * @returns A valid PDF URL
   */
  getPdfUrl(book: Book | null): string {
    if (!book) return '';
    return this.imageFallbackService.getPdfUrl(book.pdf_url);
  }

  /**
   * Select a tab in the tabset
   * @param tab The tab to select
   */
  selectTab(tab: string): void {
    this.activeTab = tab;
    this.logger.info(`Tab selected: ${tab}`);
  }
}
