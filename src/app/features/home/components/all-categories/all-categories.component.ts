import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { Book } from '../book-detail/book-detail.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../../config/constants';

/**
 * Interface representing a category item
 */
interface Category {
  id: number;
  bookCategoryId: number;
  name: string;
  is_institute_literature?: boolean;
  books?: any[];
  type?: string; // Added type property for category sorting
  [key: string]: any; // Allow for additional properties
}

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit{

  constructor(
    private logger: LoggerService,
    private router: Router,
    private route: ActivatedRoute,
    private categoriesService: CategoryService,
    private notification: NzNotificationService,
    private httpClient: HttpClient
  ) { }

  categories: Category[] = [];
  filterCategories: Category[] = [];

  /**
   * Filters an array by a specific property value
   * @param array The array to filter
   * @param property The property to filter by
   * @param value The value or array of values to match
   * @returns Filtered array containing only items with matching property value(s)
   */
  private filterByProperty<T>(array: T[], property: keyof T, value: any | any[]): T[] {
    if (Array.isArray(value)) {
      return array.filter(item => value.includes(item[property]));
    }
    return array.filter(item => item[property] === value);
  }
  
  /**
   * Groups an array of objects by a specified property
   * @param array The array to group
   * @param property The property to group by
   * @returns An object with keys representing unique property values and values as arrays of matching items
   */
  private groupByProperty<T>(array: T[], property: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const key = String(item[property]);
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  /**
   * Target bookCategoryId to filter by
   * Can be modified to filter by different values or multiple values
   */
  private targetBookCategoryId: number | number[] = 14; // Default to 14 based on user example

  ngOnInit(): void {
    // Check for categoryId in query parameters
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        const categoryId = Number(params['categoryId']);
        if (!isNaN(categoryId)) {
          this.targetBookCategoryId = categoryId;
          this.logger.info(`Using categoryId from query parameters: ${categoryId}`);
        } else {
          this.logger.warn(`Invalid categoryId in query parameters: ${params['categoryId']}`);
        }
      } else {
        this.logger.info(`No categoryId in query parameters, using default: ${this.targetBookCategoryId}`);
      }
      
      // Fetch categories after determining the target categoryId
      this.loadCategories();
    });
  }
  
  /**
   * Load categories from the service and apply filtering
   */
  private loadCategories(): void {
    this.categoriesService.getBookMiddleCategories().subscribe(
      (categories) => {
        // Assign types to categories based on their properties
        this.categories = categories.map((category: Category) => {
          // Determine category type based on properties or ID ranges
          let type = 'General';
          
          // Assign types based on bookCategoryId or other properties
          if (category.bookCategoryId === 14) {
            type = 'Academic';
          } else if (category.bookCategoryId === 10) {
            type = 'Children';
          } else if (category.is_institute_literature) {
            type = 'Institute';
          } else if (category.id >= 1 && category.id <= 10) {
            type = 'Fiction';
          } else if (category.id >= 11 && category.id <= 20) {
            type = 'Non-Fiction';
          }
          
          return { ...category, type };
        });
        
        // Filter categories by bookCategoryId
        this.filterCategories = this.filterByProperty(this.categories, 'bookCategoryId', this.targetBookCategoryId);
        
        // Sort categories by type
        this.filterCategories.sort((a, b) => {
          if (a.type && b.type) {
            return a.type.localeCompare(b.type);
          }
          return 0;
        });
        
        // Log the filtered categories and their grouping
        const groups = this.groupByProperty(this.categories, 'bookCategoryId');
        const typeGroups = this.groupByProperty(this.filterCategories, 'type');
        this.logger.info(`Filtered categories loaded successfully: ${this.filterCategories.length} items`);
        this.logger.info(`Available bookCategoryId groups: ${Object.keys(groups).join(', ')}`);
        this.logger.info(`Categories grouped by type: ${Object.keys(typeGroups).join(', ')}`);
        
        // Automatically prefetch books for all filtered categories
        this.prefetchBooksForCategories();
      },
      (error) => {
        this.logger.error('Error fetching categories: ' + error);
      }
    );
  }

  /**
   * Prefetches books for all filtered categories to improve user experience
   * This eliminates the need to fetch data when a category is clicked
   */
  private prefetchBooksForCategories(): void {
    this.logger.info('Starting automatic prefetch of books for all categories');
    
    // Create an array to track prefetch operations
    const prefetchOperations: Promise<void>[] = [];
    
    // Process each category
    this.filterCategories.forEach(category => {
      // Skip if books are already cached
      if (category.books && category.books.length > 0) {
        this.logger.info(`Category ${category.name} already has cached books`);
        return;
      }
      
      // Create a promise for this category's prefetch operation
      const prefetchPromise = new Promise<void>((resolve) => {
        this.logger.info(`Prefetching books for category ${category.name} with ID ${category.id}`);
        
        this.categoriesService.getBooksByCategory(category.id).subscribe(
          (books) => {
            if (books && Array.isArray(books) && books.length > 0) {
              // Convert API response to Book[] type
              category.books = books.map((book: any) => {
                // Format dates if they exist
                const created_at = book.created_at ? new Date(book.created_at).toISOString() : new Date().toISOString();
                const updated_at = book.updated_at ? new Date(book.updated_at).toISOString() : new Date().toISOString();
                
                return {
                  id: book.id || 0,
                  name: book.name || book.title || '',
                  type: category.type || 'General', // Use category type
                  year: book.year || 0,
                  description: book.description || '',
                  length: book.length || book.offlineBookCount || 0,
                  created_at: created_at,
                  updated_at: updated_at,
                  picture_url: book.picture_url || book.imagePath || '',
                  pdf_url: book.pdf_url || book.filePath || '',
                  count: book.count || book.offlineBookCount || 0,
                  category_name: category.name, // Use the category name we know
                  author_name: book.author_name || 
                               (book.authors && book.authors.length > 0 ? 
                                `${book.authors[0].firstName} ${book.authors[0].lastName}` : ''),
                  user_ids: book.user_ids || []
                } as Book;
              });
              this.logger.info(`Prefetched ${category.books.length} books for category ${category.name}`);
            } else {
              // Try fallback method if no books found
              this.logger.warn(`No books found for category ${category.name}, trying fallback method`);
              this.prefetchWithFallback(category);
            }
            resolve();
          },
          (error) => {
            this.logger.error(`Error prefetching books for ${category.name}: ${JSON.stringify(error)}`);
            // Try fallback method
            this.prefetchWithFallback(category);
            resolve(); // Resolve even on error to continue with other categories
          }
        );
      });
      
      prefetchOperations.push(prefetchPromise);
    });
    
    // When all prefetch operations are complete
    Promise.all(prefetchOperations).then(() => {
      this.logger.info('Completed prefetching books for all categories');
    });
  }
  
  /**
   * Fallback method for prefetching when the primary method fails
   * @param category The category to fetch books for
   */
  private prefetchWithFallback(category: Category): void {
    this.httpClient.get(`${API_URLS.ALL_BOOKS}`).subscribe(
      (response: any) => {
        // Ensure we're working with an array
        const allBooks = response as any[];
        // Try to find books that might belong to this category based on various properties
        const filteredBooks = allBooks.filter(book => {
          const categoryNameLower = category.name.toLowerCase();
          const bookTitle = (book.title || '').toLowerCase();
          const bookDescription = (book.description || '').toLowerCase();
          const bookGenre = book.genreId; // Some books might be categorized by genre instead
          
          // Check if book title or description contains category name
          // or if book has a matching category ID or genre
          return bookTitle.includes(categoryNameLower) || 
                 bookDescription.includes(categoryNameLower) ||
                 book.bookCategoryId === category.bookCategoryId ||
                 (category.id === 10 && bookGenre === 18) || // Special case for "Bolalar adbiyoti"
                 (category.id === 16 && book.bookCategoryId === 14); // Special case for "Ilmiy adabiyotlar"
        });
        
        if (filteredBooks.length > 0) {
          category.books = filteredBooks.map((book: any) => {
            // Format dates if they exist or use current date
            const created_at = book.created_at ? new Date(book.created_at).toISOString() : new Date().toISOString();
            const updated_at = book.updated_at ? new Date(book.updated_at).toISOString() : new Date().toISOString();
            
            return {
              id: book.id || 0,
              name: book.title || '',
              type: category.type || 'General', // Use category type
              year: book.year || 0,
              description: book.description || '',
              length: book.offlineBookCount || 0,
              created_at: created_at,
              updated_at: updated_at,
              picture_url: book.imagePath || '',
              pdf_url: book.filePath || '',
              count: book.offlineBookCount || 0,
              category_name: category.name, // Use the category name we know
              author_name: book.authors && book.authors.length > 0 ? 
                          `${book.authors[0].firstName} ${book.authors[0].lastName}` : '',
              user_ids: []
            } as Book;
          });
          
          this.logger.info(`Fallback method prefetched ${category.books.length} books for category ${category.name}`);
        } else {
          category.books = [];
          this.logger.warn(`No books found for category ${category.name} even with fallback method`);
        }
      },
      (error) => {
        category.books = [];
        this.logger.error(`Error in fallback book fetch for category ${category.name}: ${JSON.stringify(error)}`);
      }
    );
  }

  selectedCategory: number | null = null;
  selectedData: Book[] = [];

  /**
   * Toggles the selected category and updates the selected data
   * @param category The category to toggle
   */
  toggleCategory(category: Category): void {
    this.selectedCategory = this.selectedCategory === category.id ? null : category.id;
    
    if (this.selectedCategory === null) {
      this.selectedData = [];
      return;
    }
    
    if (category && category.books && category.books.length > 0) {
      // Use books from category if available (should be prefetched)
      // Add category type to books for display
      this.selectedData = category.books.map(book => ({
        ...book,
        category_name: category.name,
        type: category.type || 'General'
      }));
      this.logger.info(`Using cached books for category ${category.name}: ${category.books.length} books`);
    } else {
      // If books aren't prefetched yet (unlikely but possible), show loading state
      this.logger.warn(`Books not prefetched for category ${category.name}, fetching now`);
      this.notification.info(
        'Loading',
        `Loading books for ${category.name}...`
      );
      
      // Try to fetch books for this category
      this.categoriesService.getBooksByCategory(category.id).subscribe(
        (books) => {
          if (books && Array.isArray(books) && books.length > 0) {
              // Convert API response to Book[] type
              this.selectedData = books.map((book: any) => {
                // Format dates if they exist or use current date
                const created_at = book.created_at ? new Date(book.created_at).toISOString() : new Date().toISOString();
                const updated_at = book.updated_at ? new Date(book.updated_at).toISOString() : new Date().toISOString();
                
                return {
                  id: book.id || 0,
                  name: book.name || book.title || '',
                  type: category.type || 'General', // Use category type
                  year: book.year || 0,
                  description: book.description || '',
                  length: book.length || book.offlineBookCount || 0,
                  created_at: created_at,
                  updated_at: updated_at,
                  picture_url: book.picture_url || book.imagePath || '',
                  pdf_url: book.pdf_url || book.filePath || '',
                  count: book.count || book.offlineBookCount || 0,
                  category_name: category.name, // Use the category name we know
                  author_name: book.author_name || 
                             (book.authors && book.authors.length > 0 ? 
                              `${book.authors[0].firstName} ${book.authors[0].lastName}` : ''),
                  user_ids: book.user_ids || []
                } as Book;
            });
            // Cache the books in the category object for future use
            category.books = this.selectedData;
            this.logger.info(`Fetched ${this.selectedData.length} books for category ${category.name}`);
          } else {
            // No books found for this category, try to get all books and filter by category name
            this.logger.warn(`No books found for category ${category.name} with ID ${category.id}, trying fallback method`);
            this.tryFallbackBookFetch(category);
          }
        },
        (error) => {
          this.selectedData = [];
          this.logger.error(`Error fetching books for category ${category.name}: ${JSON.stringify(error)}`);
          // Try fallback method when API endpoint fails
          this.logger.info(`Trying fallback method for category ${category.name}`);
          this.tryFallbackBookFetch(category);
          
          // Display user-friendly notification
          this.notification.error(
            'Xatolik',
            `Kitoblarni yuklashda xatolik yuz berdi: ${error.status ? error.status : 'Tarmoq xatosi'}. Alternativ usul bilan urinib ko'rilmoqda.`
          );
        }
      );
    }
  }
  
  /**
   * Fallback method to fetch books when the primary method fails
   * This tries to get all books and filter them by category name or other properties
   */
  private tryFallbackBookFetch(category: Category): void {
    this.httpClient.get(`${API_URLS.ALL_BOOKS}`).subscribe(
      (response: any) => {
        // Ensure we're working with an array
        const allBooks = response as any[];
        // Try to find books that might belong to this category based on various properties
        const filteredBooks = allBooks.filter(book => {
          const categoryNameLower = category.name.toLowerCase();
          const bookTitle = (book.title || '').toLowerCase();
          const bookDescription = (book.description || '').toLowerCase();
          const bookGenre = book.genreId; // Some books might be categorized by genre instead
          
          // Check if book title or description contains category name
          // or if book has a matching category ID or genre
          return bookTitle.includes(categoryNameLower) || 
                 bookDescription.includes(categoryNameLower) ||
                 book.bookCategoryId === category.bookCategoryId ||
                 (category.id === 10 && bookGenre === 18) || // Special case for "Bolalar adbiyoti"
                 (category.id === 16 && book.bookCategoryId === 14); // Special case for "Ilmiy adabiyotlar"
        });
        
        if (filteredBooks.length > 0) {
          this.selectedData = filteredBooks.map((book: any) => {
            // Format dates if they exist or use current date
            const created_at = book.created_at ? new Date(book.created_at).toISOString() : new Date().toISOString();
            const updated_at = book.updated_at ? new Date(book.updated_at).toISOString() : new Date().toISOString();
            
            return {
              id: book.id || 0,
              name: book.title || '',
              type: category.type || 'General', // Use category type
              year: book.year || 0,
              description: book.description || '',
              length: book.offlineBookCount || 0,
              created_at: created_at,
              updated_at: updated_at,
              picture_url: book.imagePath || '',
              pdf_url: book.filePath || '',
              count: book.offlineBookCount || 0,
              category_name: category.name, // Use the category name we know
              author_name: book.authors && book.authors.length > 0 ? 
                          `${book.authors[0].firstName} ${book.authors[0].lastName}` : '',
              user_ids: []
            } as Book;
          });
          
          // Cache the books in the category object for future use
          category.books = this.selectedData;
          this.logger.info(`Fallback method found ${this.selectedData.length} books for category ${category.name}`);
          this.notification.success(
            'Success',
            `Found ${this.selectedData.length} books for ${category.name} using alternative method`
          );
        } else {
          this.selectedData = [];
          this.logger.warn(`No books found for category ${category.name} even with fallback method`);
          this.notification.info(
            'No Books Found',
            `No books found for ${category.name}`
          );
        }
      },
      (error) => {
        this.selectedData = [];
        this.logger.error(`Error in fallback book fetch for category ${category.name}: ${JSON.stringify(error)}`);
        this.notification.error(
          'Error',
          `Failed to fetch books for ${category.name} using alternative method`
        );
      }
    );
  }
  
  /**
   * Updates the filter to show categories with the specified bookCategoryId
   * @param bookCategoryId The bookCategoryId value(s) to filter by
   */
  updateCategoryFilter(bookCategoryId: number | number[]): void {
    this.targetBookCategoryId = bookCategoryId;
    
    // Re-apply the filter with the new criteria
    if (this.categories.length > 0) {
      this.filterCategories = this.filterByProperty(this.categories, 'bookCategoryId', bookCategoryId);
      this.logger.info(`Filter updated: showing ${this.filterCategories.length} categories with bookCategoryId ${bookCategoryId}`);
    }
  }
}
