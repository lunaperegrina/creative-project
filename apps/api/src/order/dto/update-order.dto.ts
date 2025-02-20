import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDTO extends PartialType(CreateOrderDto) {}
