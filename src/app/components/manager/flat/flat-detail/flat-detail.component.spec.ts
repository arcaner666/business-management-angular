import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatDetailComponent } from './flat-detail.component';

describe('FlatDetailComponent', () => {
  let component: FlatDetailComponent;
  let fixture: ComponentFixture<FlatDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
