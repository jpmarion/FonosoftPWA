import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarEstadoObraSocialComponent } from './CambiarEstadoObraSocialComponent';

describe('CambiarEstadoObraSocialComponent', () => {
  let component: CambiarEstadoObraSocialComponent;
  let fixture: ComponentFixture<CambiarEstadoObraSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarEstadoObraSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarEstadoObraSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
