import {Component, OnInit} from '@angular/core';
import {AuthorService} from "../../services/author.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.scss'
})
export class AuthorDetailComponent implements OnInit {
  author: any;
  baseUrl = environment.baseUrl;
  constructor(
    private authorService: AuthorService,
    private message: NzMessageService,
    private router: ActivatedRoute,
    private logger: LoggerService
  ) {}

  /**
   * Initialize the component and load author details from route parameters
   */
  ngOnInit(): void {
    try {
      this.logger.info('AuthorDetailComponent initialized');
      this.loadAuthorFromRouteParams();
    } catch (error) {
      this.logger.error(`Error in ngOnInit: ${JSON.stringify(error)}`);
      this.message.error('Muallif ma\'lumotlarini yuklashda xatolik yuz berdi');
    }
  }

  /**
   * Subscribe to route parameters and load author details
   */
  private loadAuthorFromRouteParams(): void {
    this.router.params.subscribe({
      next: (params) => {
        if (params['authorId']) {
          const authorId = Number(params['authorId']);
          if (!isNaN(authorId)) {
            this.getAuthorDetail(authorId);
          } else {
            this.logger.warn(`Invalid authorId parameter: ${params['authorId']}`);
            this.message.error('Noto\'g\'ri muallif identifikatori');
          }
        } else {
          this.logger.warn('No authorId parameter found in route');
          this.message.error('Muallif identifikatori topilmadi');
        }
      },
      error: (error) => {
        this.logger.error(`Error getting route params: ${JSON.stringify(error)}`);
        this.message.error('Yo\'nalish parametrlarini olishda xatolik');
      }
    });
  }

  /**
   * Fetch author details by ID
   * @param authorId The ID of the author to fetch
   */
  getAuthorDetail(authorId: number): void {
    this.authorService.getAuthorById(authorId).subscribe({
      next: (response) => {
        if (response) {
          this.author = response;
          this.logger.info(`Author details loaded successfully for ID: ${authorId}`);
        } else {
          this.logger.warn(`No author data returned for ID: ${authorId}`);
          this.message.error('Muallif ma\'lumotlari topilmadi');
        }
      },
      error: (error) => {
        // Handle specific error cases
        if (error.status === 404) {
          this.message.error('Muallif topilmadi');
          this.logger.warn(`Author not found with ID: ${authorId}`);
        } else if (error.status >= 500) {
          this.message.error('Server xatosi. Iltimos keyinroq urinib ko\'ring');
          this.logger.error(`Server error while getting author: ${error.status}`);
        } else {
          this.message.error('Muallif ma\'lumotlarini olishda xatolik');
          this.logger.error(`Error getting author details: ${JSON.stringify(error)}`);
        }
      }
    });
  }
}
