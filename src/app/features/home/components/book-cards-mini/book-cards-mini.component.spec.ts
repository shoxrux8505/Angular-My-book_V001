import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCardsMiniComponent } from './book-cards-mini.component';

describe('BookCardsMiniComponent', () => {
  let component: BookCardsMiniComponent;
  let fixture: ComponentFixture<BookCardsMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookCardsMiniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCardsMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
