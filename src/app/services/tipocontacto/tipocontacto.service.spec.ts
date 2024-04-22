import { TestBed } from '@angular/core/testing';

import { TipocontactoService } from './tipocontacto.service';

describe('TipocontactoService', () => {
  let service: TipocontactoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipocontactoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
