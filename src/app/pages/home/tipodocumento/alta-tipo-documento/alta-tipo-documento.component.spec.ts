import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaTipoDocumentoComponent } from './alta-tipo-documento.component';

describe('AltaTipoDocumentoComponent', () => {
  let component: AltaTipoDocumentoComponent;
  let fixture: ComponentFixture<AltaTipoDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaTipoDocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
