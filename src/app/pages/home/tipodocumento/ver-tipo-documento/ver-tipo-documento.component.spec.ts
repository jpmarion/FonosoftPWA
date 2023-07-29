import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTipoDocumentoComponent } from './ver-tipo-documento.component';

describe('VerTipoDocumentoComponent', () => {
  let component: VerTipoDocumentoComponent;
  let fixture: ComponentFixture<VerTipoDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTipoDocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
