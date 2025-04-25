import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { UserStatus } from 'src/enum/user-staus.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @IsOptional()
    @IsInt({ message: 'ID must be a number' })
    @IsNotEmpty({ message: 'ID is required' })
    id: number;
  
    @IsOptional()
    @IsEnum(UserStatus, { message: 'Invalid status value' })
    status?: UserStatus;
}
