import { Module } from '@nestjs/common';
import { PdfGenerationService } from './pdf-generation.service';
import { PdfGenerationController } from './pdf-generation.controller';

@Module({
  controllers: [PdfGenerationController],
  providers: [PdfGenerationService],
})
export class PdfGenerationModule {}
