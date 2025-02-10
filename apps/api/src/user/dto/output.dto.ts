import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserOutputDTO implements User {
  @Exclude()
  password: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  walletBalance: number;

  @ApiProperty()
  totalSpent: number;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  role: $Enums.Role;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
