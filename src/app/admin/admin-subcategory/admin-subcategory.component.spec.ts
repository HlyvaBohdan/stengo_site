import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubcategoryComponent } from './admin-subcategory.component';

describe('AdminSubcategoryComponent', () => {
  let component: AdminSubcategoryComponent;
  let fixture: ComponentFixture<AdminSubcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSubcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
