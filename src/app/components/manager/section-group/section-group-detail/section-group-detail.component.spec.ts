import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionGroupDetailComponent } from './section-group-detail.component';

describe('SectionGroupDetailComponent', () => {
  let component: SectionGroupDetailComponent;
  let fixture: ComponentFixture<SectionGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionGroupDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
