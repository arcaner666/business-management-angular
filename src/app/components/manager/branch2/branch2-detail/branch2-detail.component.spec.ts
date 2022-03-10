import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Branch2DetailComponent } from './branch2-detail.component';

describe('Branch2DetailComponent', () => {
  let component: Branch2DetailComponent;
  let fixture: ComponentFixture<Branch2DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Branch2DetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Branch2DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
