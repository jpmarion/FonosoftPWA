import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTipodocumentoComponent } from './add-tipodocumento.component';

describe('AddTipodocumentoComponent', () => {
  let component: AddTipodocumentoComponent;
  let fixture: ComponentFixture<AddTipodocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTipodocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTipodocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
