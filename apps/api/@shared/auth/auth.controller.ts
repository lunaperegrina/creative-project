import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public-route.decorator';
import { AuthService } from './auth.service';
import { DecodeTokenDTO } from './dto/decode_token.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh_token.dto';
import { TokenOutputDTO } from './dto/token_output.dto';
import { AuthOutputDTO } from './dto/user_output.dto';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiOkResponse({ type: AuthOutputDTO })
  signIn(@Body() body: LoginDTO) {
    return this.service.signIn(body.email, body.password);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  @ApiOkResponse({ type: AuthOutputDTO })
  signUp(@Body() createUserDTO: CreateUserDTO) {
    return this.service.signUp(createUserDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('refresh')
  @ApiOkResponse({ type: AuthOutputDTO })
  refreshToken(@Body() body: RefreshTokenDTO) {
    return this.service.refreshToken(body.token);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('decode')
  @ApiOkResponse({ type: TokenOutputDTO })
  decodeToken(@Body() body: DecodeTokenDTO) {
    return this.service.decodeToken(body.token);
  }
}
