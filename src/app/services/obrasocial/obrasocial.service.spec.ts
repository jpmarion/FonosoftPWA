import { TestBed } from '@angular/core/testing';

import { ObrasocialService } from './obrasocial.service';

describe('ObrasocialService', () => {
  let service: ObrasocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObrasocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
