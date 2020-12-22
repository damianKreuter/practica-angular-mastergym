import { TestBed } from '@angular/core/testing';

import { MensajesServicioService } from './mensajes-servicio.service';

describe('MensajesServicioService', () => {
  let service: MensajesServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajesServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
