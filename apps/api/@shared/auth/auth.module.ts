import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EncryptService } from '@shared/encrypt/encrypt.service';
import { PrismaService } from '@shared/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, PrismaService, EncryptService],
  controllers: [AuthController],
})
export class AuthModule {}
