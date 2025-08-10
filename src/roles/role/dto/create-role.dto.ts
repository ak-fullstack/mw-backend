import { IsNotEmpty, IsArray, ArrayNotEmpty, Matches, IsString, IsEnum } from 'class-validator';
import { PermissionEnum  } from 'src/enum/permissions.enum';

export class CreateRoleDto {
    @IsNotEmpty()
    @Matches(/^[A-Z_]+$/, {
        message: 'Role name must be uppercase and can only include underscores',
    })
    roleName: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(PermissionEnum , { each: true })
    permissions: PermissionEnum[];
}