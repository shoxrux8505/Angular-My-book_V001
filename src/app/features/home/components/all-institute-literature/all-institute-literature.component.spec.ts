import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInstituteLiteratureComponent } from './all-institute-literature.component';

describe('AllInstituteLiteratureComponent', () => {
  let component: AllInstituteLiteratureComponent;
  let fixture: ComponentFixture<AllInstituteLiteratureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllInstituteLiteratureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInstituteLiteratureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
