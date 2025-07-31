import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../../../environments/environment';
import { Book } from '../book-detail/book-detail.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ImageFallbackService } from '../../../../shared/services/image-fallback.service';

@Component({
  selector: 'app-all-institute-literature',
  templateUrl: '../all-categories/all-categories.component.html',
  styleUrl: '../all-categories/all-categories.component.scss'
})

export class AllInstituteLiteratureComponent implements OnInit, AfterViewChecked {
  ngAfterViewChecked(): void {
    // Implement required AfterViewChecked interface method
  }
  @ViewChild('book') book!: ElementRef;
  categoryHeight: any;

  constructor(
    private logger: LoggerService,
    private router: Router,
    private categoriesService: CategoryService,
    private notification: NzNotificationService,
    private imageFallbackService: ImageFallbackService
  ) { }

  categories: any[] = [];
  filterCategories: any[] = [];

  ngOnInit(): void {
    this.categoriesService.getBookMiddleCategories().subscribe(
      (categories) => {
        this.categories = categories;
        // Filter categories to only show those with bookCategoryId equal to 15
        this.filterCategories = this.categories.filter(category => category.bookCategoryId === 15);
        this.logger.info(`Filtered categories loaded successfully: ${this.filterCategories.length} items with bookCategoryId=15`);
      },
      (error) => {
        this.logger.error('Error fetching categories: ' + error);
      }
    );
  }


  selectedCategory: number | null = null;
  selectedData: Book[] | null = null;

  toggleCategory(category: any): void {
    this.selectedCategory = this.selectedCategory === category.id ? null : category.id;
    
    if (this.selectedCategory === null) {
      this.selectedData = [];
      return;
    }
    
    if (category && category.books && category.books.length > 0) {
      // Use books from category if available
      this.selectedData = category.books;
      this.logger.info(`Using cached books for category ${category.name}: ${category.books.length} books`);
    } else {
      // Fetch books for this category if not available
      this.logger.info(`Fetching books for category ${category.name} with ID ${category.id}`);
      this.categoriesService.getBooksByCategory(category.id).subscribe(
        (books) => {
          // Convert API response to Book[] type
          if (books && Array.isArray(books)) {
            this.selectedData = books.map((book: any) => {
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
          } else {
            this.selectedData = [];
          }
          
          // Cache the books in the category object for future use
          category.books = this.selectedData;
          this.logger.info(`Fetched ${this.selectedData.length} books for category ${category.name}`);
        },
        (error) => {
          this.selectedData = [];
          this.logger.error(`Error fetching books for category ${category.name}: ${JSON.stringify(error)}`);
          // Display user-friendly notification
          this.notification.error(
            'Xatolik',
            `Kitoblarni yuklashda xatolik yuz berdi: ${error.status ? error.status : 'Tarmoq xatosi'}`
          );
        }
      );
    }
  }

  getImageUrl(pictureUrl: string, bookType?: string): string {
    return this.imageFallbackService.getBookImageUrl(pictureUrl, bookType);
  }
}
