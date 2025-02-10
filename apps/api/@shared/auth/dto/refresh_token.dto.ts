import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenDTO {
  @IsJWT()
  @ApiProperty()
  token: string;
}
