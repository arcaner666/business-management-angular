import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Branch2ListComponent } from './branch2-list.component';

describe('Branch2ListComponent', () => {
  let component: Branch2ListComponent;
  let fixture: ComponentFixture<Branch2ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Branch2ListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Branch2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
