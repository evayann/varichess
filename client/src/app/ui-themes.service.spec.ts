import { TestBed } from '@angular/core/testing';

import { UiThemesService } from './ui-themes.service';

describe('UiThemesService', () => {
  let service: UiThemesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiThemesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
