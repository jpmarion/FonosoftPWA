import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObrasocialComponent } from './obrasocial.component';

describe('ObrasocialComponent', () => {
  let component: ObrasocialComponent;
  let fixture: ComponentFixture<ObrasocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObrasocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObrasocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
