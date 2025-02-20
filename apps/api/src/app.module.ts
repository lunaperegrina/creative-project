import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@shared/auth/auth.guard';
import { AuthModule } from '@shared/auth/auth.module';
import { OrderModule } from './order/order.module';
import { S3Module } from './s3/s3.module';
import { CreativeModule } from './creative/creative.module';

@Module({
  imports: [UserModule, AuthModule, OrderModule, S3Module, CreativeModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
