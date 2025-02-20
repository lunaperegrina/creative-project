import { Expose, Type } from 'class-transformer';
import { CreativeType, OrderStatus } from '@prisma/client'; // Supondo que os enums estão no Prisma Client
import { UserOutputDTO } from '../../user/dto';
import { CreativeOutputDto } from '../../creative/dto';

export class OrderOutputDto {
  @Expose()
  id: number;

  @Expose()
  type: CreativeType;

  @Expose()
  copy: string;

  @Expose()
  niche: string;

  @Expose()
  vision: string;

  @Expose()
  reference: string;

  @Expose()
  status: OrderStatus;

  @Expose()
  price: number;

  @Expose()
  createdAt: Date;

  @Expose()
  deliveredAt: Date;

  @Expose()
  userId: number; // Adicione esta linha

  @Expose()
  @Type(() => UserOutputDTO)
  user: UserOutputDTO; // Relação com o usuário que fez o pedido

  @Expose()
  @Type(() => CreativeOutputDto)
  creative: CreativeOutputDto; // Relação com o criativo (se existir)
}