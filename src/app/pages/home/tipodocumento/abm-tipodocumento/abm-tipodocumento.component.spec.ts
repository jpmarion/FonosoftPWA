import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmTipodocumentoComponent } from './abm-tipodocumento.component';

describe('AbmTipodocumentoComponent', () => {
  let component: AbmTipodocumentoComponent;
  let fixture: ComponentFixture<AbmTipodocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmTipodocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmTipodocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
