import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionGroupComponent } from './section-group.component';

describe('SectionGroupComponent', () => {
  let component: SectionGroupComponent;
  let fixture: ComponentFixture<SectionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
