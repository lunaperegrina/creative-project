import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateCreativeDto {
  @IsInt()
  @ApiProperty()
  orderId: number; // ID do pedido associado ao criativo

  @IsString()
  @ApiProperty()
  fileUrl: string; // URL do arquivo do criativo

  @IsOptional()
  @ApiProperty()
  @IsInt()
  designerId?: number; // ID do designer (opcional)
}