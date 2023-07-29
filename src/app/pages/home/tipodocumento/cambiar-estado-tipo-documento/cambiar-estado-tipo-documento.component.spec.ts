import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarEstadoTipoDocumentoComponent } from './cambiar-estado-tipo-documento.component';

describe('CambiarEstadoTipoDocumentoComponent', () => {
  let component: CambiarEstadoTipoDocumentoComponent;
  let fixture: ComponentFixture<CambiarEstadoTipoDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarEstadoTipoDocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarEstadoTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
