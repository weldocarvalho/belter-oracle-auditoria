import { Test, TestingModule } from '@nestjs/testing';
import { SkinAnalysisController } from './skin-analysis.controller';
import { SkinAnalysisService } from './skin-analysis.service';
import { SkinAnalysisPublisher } from './skin-analysis.publisher';
import type { InitiateSkinAnalysisEvent } from './skin-analysis.contracts';

describe('SkinAnalysisController', () => {
  let controller: SkinAnalysisController;
  let service: SkinAnalysisService;
  const publishSubmission = jest.fn();

  const event: InitiateSkinAnalysisEvent = {
    patientId: '11111111-1111-1111-1111-111111111111',
    skinType: 'oleosa',
    skinConcerns: 'manchas',
    bodyArea: 'pernas',
    correlationId: '22222222-2222-2222-2222-222222222222',
    requestedAt: new Date().toISOString(),
    photoUrls: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkinAnalysisController],
      providers: [
        SkinAnalysisService,
        { provide: SkinAnalysisPublisher, useValue: { publishSubmission } },
      ],
    }).compile();

    controller = module.get<SkinAnalysisController>(SkinAnalysisController);
    service = module.get<SkinAnalysisService>(SkinAnalysisService);
    publishSubmission.mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should process submission and publish event', async () => {
    const result = await controller.submitSkinAnalysis(event);

    expect(publishSubmission).toHaveBeenCalledWith(event);
    expect(result).toEqual(
      expect.objectContaining({ success: true, status: 'PROCESSING' }),
    );
  });
});
