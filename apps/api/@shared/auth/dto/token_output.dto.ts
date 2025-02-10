import { ApiProperty } from '@nestjs/swagger';

export class TokenOutputDTO {
  @ApiProperty()
  access_token: string;
}
