import { PartialType } from '@nestjs/mapped-types';
import { CreatePdfGenerationDto } from './create-pdf-generation.dto';

export class UpdatePdfGenerationDto extends PartialType(CreatePdfGenerationDto) {}
