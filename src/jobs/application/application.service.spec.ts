import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from './application.service';
import { beforeEach, describe, it } from 'node:test';
import { Exception } from 'sass';

describe('ApplicationService', () => {
  let service: ApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationService],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
