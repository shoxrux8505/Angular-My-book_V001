import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageFallbackService {
  private baseUrl = environment.baseUrl;
  private fallbackImages = {
    // Default fallback images for any book
    default: [
      '/assets/imgs/book1.png',
      '/assets/imgs/book2.png',
      '/assets/imgs/book3.png'
    ],
    // Fallback images by book type (minimum 10 per type)
    Fiction: [
      '/assets/imgs/book1.png',
      '/assets/imgs/book2.png',
      '/assets/imgs/book3.png',
      '/assets/imgs/bobur.png',
      '/assets/imgs/1.jpg',
      '/assets/imgs/book1.png',
      '/assets/imgs/book2.png',
      '/assets/imgs/book3.png',
      '/assets/imgs/bobur.png',
      '/assets/imgs/1.jpg'
    ],
    Academic: [
      '/assets/imgs/book2.png',
      '/assets/imgs/book3.png',
      '/assets/imgs/book1.png',
      '/assets/imgs/bobur.png',
      '/assets/imgs/1.jpg',
      '/assets/imgs/book2.png',
      '/assets/imgs/book3.png',
      '/assets/imgs/book1.png',
      '/assets/imgs/bobur.png',
      '/assets/imgs/1.jpg'
    ],
    Children: [
      '/assets/imgs/book3.png',
      '/assets/imgs/book1.png',
      '/assets/imgs/book2.png',
      '/assets/imgs/bobur.png',
      '/assets/imgs/1.jpg',
      '/assets/imgs/book3.png',
      '/assets/imgs/book1.png',
      '/assets/imgs/book2.png',
      '/assets/imgs/bobur.png',
      '/assets/imgs/1.jpg'
    ],
    Institute: [
      '/assets/imgs/bobur.png',
      '/assets/imgs/book1.png',
      '/assets/imgs/book2.png',
      '/assets/imgs/book3.png',
      '/assets/imgs/1.jpg',
      '/assets/imgs/bobur.png',
      '/assets/imgs/book1.png',
      '/assets/imgs/book2.png',
      '/assets/imgs/book3.png',
      '/assets/imgs/1.jpg'
    ]
  };

  constructor() { }

  /**
   * Get a book image URL with fallback support
   * @param imagePath The original image path
   * @param bookType The type of book (optional)
   * @returns A valid image URL
   */
  getBookImageUrl(imagePath: string | undefined | null, bookType?: string): string {
    // If imagePath is valid, normalize it and return the full URL
    if (imagePath) {
      const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      // Check if the URL contains a 404 error indicator
      if (normalizedPath.includes('Not Found') || normalizedPath.includes('404')) {
        return this.getRandomFallbackImage(bookType);
      }
      // Try to fetch the image from the server
      return `${this.baseUrl}/BookImage/${normalizedPath}`;
    }

    // If no image path provided, return a random fallback image
    return this.getRandomFallbackImage(bookType);
  }

  /**
   * Get a random fallback image based on book type
   * @param bookType The type of book (optional)
   * @returns A random fallback image URL
   */
  private getRandomFallbackImage(bookType?: string): string {
    // Get the appropriate image array based on book type
    const imageArray = bookType && 
      this.fallbackImages[bookType as keyof typeof this.fallbackImages] ? 
      this.fallbackImages[bookType as keyof typeof this.fallbackImages] : 
      this.fallbackImages.default;
    
    // Select a random image from the array
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    return imageArray[randomIndex];
  }

  /**
   * Get a PDF URL with fallback support
   * @param pdfPath The original PDF path
   * @returns A valid PDF URL
   */
  getPdfUrl(pdfPath: string | undefined | null): string {
    // If pdfPath is valid, normalize it and return the full URL
    if (pdfPath) {
      const normalizedPath = pdfPath.startsWith('/') ? pdfPath.substring(1) : pdfPath;
      return `${this.baseUrl}/BookPdf/${normalizedPath}`;
    }

    // Return empty string if no PDF available
    return '';
  }
}