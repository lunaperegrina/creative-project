import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '@shared/prisma/prisma.service';
import { EncryptService } from '@shared/encrypt/encrypt.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, EncryptService],
  exports: [UserService], // Export UserService here
})
export class UserModule {}
