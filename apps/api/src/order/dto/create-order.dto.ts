import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsUrl } from 'class-validator';
import { CreativeType, OrderStatus } from '@prisma/client'; // Supondo que os enums estão no Prisma Client

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number; // ID do usuário que está criando o pedido

  @IsNotEmpty()
  @IsEnum(CreativeType)
  @ApiProperty()
  type: CreativeType; // Tipo de criativo (VIDEO, IMAGE, DEEPFAKE)

  @IsOptional()
  @IsString()
  @ApiProperty()
  copy?: string; // Texto ou descrição do pedido

  @IsOptional()
  @IsString()
  @ApiProperty()
  niche?: string; // Nicho do pedido

  @IsOptional()
  @IsString()
  @ApiProperty()
  vision?: string; // Visão do cliente para o pedido

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  reference?: string; // URL de referência (opcional)

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  price: number; // Preço do pedido
}