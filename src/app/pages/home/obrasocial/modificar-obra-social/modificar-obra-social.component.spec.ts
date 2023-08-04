import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarObraSocialComponent } from './modificar-obra-social.component';

describe('ModificarObraSocialComponent', () => {
  let component: ModificarObraSocialComponent;
  let fixture: ComponentFixture<ModificarObraSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarObraSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarObraSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
