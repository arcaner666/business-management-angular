import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarStaticComponent } from './sidebar-static.component';

describe('SidebarStaticComponent', () => {
  let component: SidebarStaticComponent;
  let fixture: ComponentFixture<SidebarStaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarStaticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
