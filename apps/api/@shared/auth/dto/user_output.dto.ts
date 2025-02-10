import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDTO } from 'src/user/dto/output.dto';

export class AuthOutputDTO extends UserOutputDTO {
  @ApiProperty()
  access_token: string;
}
