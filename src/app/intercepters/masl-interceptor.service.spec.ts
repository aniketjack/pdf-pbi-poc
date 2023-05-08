import { TestBed } from '@angular/core/testing';

import { MaslInterceptorService } from './masl-interceptor.service';

describe('MaslInterceptorService', () => {
  let service: MaslInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaslInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
