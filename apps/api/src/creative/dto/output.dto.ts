import { Expose, Type } from 'class-transformer';
import { OrderOutputDto } from '../../order/dto'; // Supondo que você já tenha um OrderOutputDto
import { UserOutputDTO } from '../../user/dto'; // Supondo que você já tenha um UserOutputDto

export class CreativeOutputDto {
  @Expose()
  id: number; // ID do criativo

  @Expose()
  orderId: number; // ID do pedido associado

  @Expose()
  fileUrl: string; // URL do arquivo do criativo

  @Expose()
  createdAt: Date; // Data de criação

  @Expose()
  @Type(() => OrderOutputDto)
  order: OrderOutputDto; // Relação com o pedido

  @Expose()
  @Type(() => UserOutputDTO)
  designer?: UserOutputDTO; // Relação com o designer (opcional)
}