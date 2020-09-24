import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuickOrderComponent } from './admin-quick-order.component';

describe('AdminQuickOrderComponent', () => {
  let component: AdminQuickOrderComponent;
  let fixture: ComponentFixture<AdminQuickOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuickOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuickOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
