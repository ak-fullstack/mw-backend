import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnImageDto } from './create-return-image.dto';

export class UpdateReturnImageDto extends PartialType(CreateReturnImageDto) {}
