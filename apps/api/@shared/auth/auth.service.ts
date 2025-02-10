import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { EncryptService } from '@shared/encrypt/encrypt.service';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private encryptService: EncryptService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async getActiveUser(email: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { email: email, active: true },
    });
  }

  async signIn(email: string, password: string) {
    const user = await this.getActiveUser(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const samePassword = await this.encryptService.compareStrings(
      password,
      user.password,
    );

    if (samePassword) {
      return this.generateToken(user);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }
  }

  async signUp(createUserDTO: CreateUserDTO) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: createUserDTO.email },
    });
    if (userExists) {
      throw new HttpException(
        'E-mail already registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.create(createUserDTO);
    return this.generateToken(user);
  }

  async refreshToken(token: string) {
    const tokenExists = await this.prismaService.token.findUnique({
      where: { hash: token },
    });

    if (tokenExists) {
      const user = await this.prismaService.user.findUnique({
        where: { id: tokenExists.user_id },
      });

      return this.generateToken(user);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }
  }

  async generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const token = await this.jwtService.signAsync(payload);

    const previousToken = await this.prismaService.token.findUnique({
      where: { user_id: user.id },
    });

    if (previousToken) {
      await this.prismaService.token.update({
        where: { user_id: user.id },
        data: {
          hash: token,
        },
      });
    } else {
      await this.prismaService.token.create({
        data: {
          user: { connect: { id: user.id } },
          hash: token,
        },
      });
    }

    const { ...result } = user;
    return { ...result, access_token: token };
  }

  async decodeToken(token: string) {
    const jwt = await this.jwtService.decode(token);
    const user = await this.getActiveUser(jwt.email);
    if (user) {
      return jwt;
    }

    throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
  }
}
