import { TestBed } from '@angular/core/testing';

import { ApiTasksService } from './api-tasks.service';

describe('ApiTasksService', () => {
  let service: ApiTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
