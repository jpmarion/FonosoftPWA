import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTipodocumentoComponent } from './ver-tipodocumento.component';

describe('VerTipodocumentoComponent', () => {
  let component: VerTipodocumentoComponent;
  let fixture: ComponentFixture<VerTipodocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTipodocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerTipodocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
