import { TestBed } from '@angular/core/testing';

import { SectionGroupService } from './section-group.service';

describe('SectionGroupService', () => {
  let service: SectionGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
