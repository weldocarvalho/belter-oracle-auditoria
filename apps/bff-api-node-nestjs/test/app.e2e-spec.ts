import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { SkinAnalysisPublisher } from '../src/modules/skin-analysis/skin-analysis.publisher';
import { MagicLinkAuthPublisher } from '../src/modules/magic-link-auth/magic-link-auth.publisher';
import { PhotoScoringPresignService } from '../src/modules/photo-scoring-presign/photo-scoring-presign.service';
import { PipelineEventsConsumer } from '../src/modules/pipeline/pipeline-events.consumer';

describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SkinAnalysisPublisher)
      .useValue({ publishSubmission: jest.fn() })
      .overrideProvider(MagicLinkAuthPublisher)
      .useValue({ publishAuthRequested: jest.fn() })
      .overrideProvider(PhotoScoringPresignService)
      .useValue({ generatePresignedUrl: jest.fn() })
      .overrideProvider(PipelineEventsConsumer)
      .useValue({ onModuleInit: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'OK', message: 'API ativa!' });
  });
});
