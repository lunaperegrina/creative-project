import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Matches } from 'class-validator';

export class GetAllQueryDTO {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number = 0;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  perPage?: number = 8;

  @IsOptional()
  @Matches(/^(asc|desc)$/, {
    message: 'O valor deve ser "asc" ou "desc"',
  })
  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  created?: 'asc' | 'desc';
}
