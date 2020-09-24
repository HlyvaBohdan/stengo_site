import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsViewedComponent } from './products-viewed.component';

describe('ProductsViewedComponent', () => {
  let component: ProductsViewedComponent;
  let fixture: ComponentFixture<ProductsViewedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsViewedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsViewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
