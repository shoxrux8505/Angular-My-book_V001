import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carusel',
  templateUrl: './carusel.component.html',
  styleUrls: ['./carusel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
  @Input() images: string[] = []; // Rasm URL'lari uchun o'zgaruvchi
  @Input() interval: number = 5000; // Avtomatik aylanish vaqti (ms)
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  currentIndex = 0;
  autoPlayInterval: any;

  ngAfterViewInit(): void {
    // this.startAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextSlide(): void {
    if (this.carouselTrack) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.updateCarouselPosition();
    }
  }

  prevSlide(): void {
    if (this.carouselTrack) {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.updateCarouselPosition();
    }
  }

  updateCarouselPosition(): void {
    if (this.carouselTrack) {
      const offset = -this.currentIndex * 100;
      this.carouselTrack.nativeElement.style.transform = `translateX(${offset}%)`;
    }
  }
}
