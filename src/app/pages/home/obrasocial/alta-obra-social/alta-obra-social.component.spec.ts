import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaObraSocialComponent } from './alta-obra-social.component';

describe('AltaObraSocialComponent', () => {
  let component: AltaObraSocialComponent;
  let fixture: ComponentFixture<AltaObraSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaObraSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaObraSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
