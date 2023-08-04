import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerObraSocialComponent } from './ver-obra-social.component';

describe('VerObraSocialComponent', () => {
  let component: VerObraSocialComponent;
  let fixture: ComponentFixture<VerObraSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerObraSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerObraSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
