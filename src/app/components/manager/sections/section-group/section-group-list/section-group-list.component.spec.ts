import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionGroupListComponent } from './section-group-list.component';

describe('SectionGroupListComponent', () => {
  let component: SectionGroupListComponent;
  let fixture: ComponentFixture<SectionGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
