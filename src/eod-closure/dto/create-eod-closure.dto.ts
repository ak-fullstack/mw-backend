import { IsString, Matches } from 'class-validator';

export class CreateEodClosureDto {
  @IsString()
  @Matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?\+05:30$/,
    { message: 'dateTime must be a valid ISO 8601 IST datetime string' }
  )
  dateTime: string; // e.g., "2025-08-03T23:59:59.999+05:30"
}