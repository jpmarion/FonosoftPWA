import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiNoDialogComponent } from './si-no-dialog.component';

describe('SiNoDialogComponent', () => {
  let component: SiNoDialogComponent;
  let fixture: ComponentFixture<SiNoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiNoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiNoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
