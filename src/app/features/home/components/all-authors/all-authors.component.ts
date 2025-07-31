import { Component, OnInit } from '@angular/core';
import { AuthorService } from "../../services/author.service";
import { environment } from "../../../../../environments/environment";
import { LoggerService } from '../../../../core/services/logger.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-all-authors',
  templateUrl: './all-authors.component.html',
  styleUrls: ['./all-authors.component.scss'],
})
export class AllAuthorsComponent implements OnInit {
  authors: any[] = [];
  baseUrl = environment.baseUrl

  constructor(
    private authorService: AuthorService,
    private logger: LoggerService,
    private notification: NzNotificationService
  ) { }


  /**
   * Initialize the component and load all authors
   */
  ngOnInit(): void {
    try {
      this.logger.info('AllAuthorsComponent initialized');
      this.loadAllAuthors();
    } catch (error) {
      this.logger.error(`Error in ngOnInit: ${JSON.stringify(error)}`);
      this.notification.error('Xatolik', 'Mualliflar ro\'yxatini yuklashda xatolik');
    }
  }

  /**
   * Load all authors from the API
   */
  private loadAllAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (response) => {
        if (response && response.items) {
          this.authors = response.items;
          this.logger.info(`Successfully loaded ${this.authors.length} authors`);
        } else {
          this.logger.warn('No authors data returned from API');
          this.notification.warning('Ma\'lumot', 'Mualliflar ro\'yxati bo\'sh');
        }
      },
      error: (error) => {
        // Handle specific error cases
        if (error.status >= 500) {
          this.notification.error('Xatolik', 'Server xatosi. Iltimos keyinroq urinib ko\'ring');
          this.logger.error(`Server error while loading authors: ${error.status}`);
        } else {
          this.notification.error('Xatolik', 'Mualliflar ro\'yxatini yuklashda xatolik');
          this.logger.error(`Error loading authors: ${JSON.stringify(error)}`);
        }
      }
    });
  }
}
