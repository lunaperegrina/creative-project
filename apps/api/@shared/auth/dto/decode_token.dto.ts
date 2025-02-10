import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class DecodeTokenDTO {
  @IsJWT()
  @ApiProperty()
  token: string;
}
