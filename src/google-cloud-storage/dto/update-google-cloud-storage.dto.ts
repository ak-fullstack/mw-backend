import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleCloudStorageDto } from './create-google-cloud-storage.dto';

export class UpdateGoogleCloudStorageDto extends PartialType(CreateGoogleCloudStorageDto) {}
