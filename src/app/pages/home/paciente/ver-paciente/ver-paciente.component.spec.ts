import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPacienteComponent } from './ver-paciente.component';

describe('VerPacienteComponent', () => {
  let component: VerPacienteComponent;
  let fixture: ComponentFixture<VerPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerPacienteComponent]
    });
    fixture = TestBed.createComponent(VerPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
