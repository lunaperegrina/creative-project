import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from './create-user.dto';
import { IsString } from 'class-validator';
import { $Enums } from '@prisma/client';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsString()
  @ApiProperty()
  role: $Enums.Role;
}
