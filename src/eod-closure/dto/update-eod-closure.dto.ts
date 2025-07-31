import { PartialType } from '@nestjs/mapped-types';
import { CreateEodClosureDto } from './create-eod-closure.dto';

export class UpdateEodClosureDto extends PartialType(CreateEodClosureDto) {}
