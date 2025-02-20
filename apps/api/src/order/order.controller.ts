import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Public } from '@shared/decorators/public-route.decorator';
import { Order } from '@prisma/client';
import { PaginatedOutputDTO } from '@shared/pagination/dto/paginated_output.dto';
import { ParamId } from '@shared/decorators/param-id';
import { CreateOrderDto, GetAllQueryDTO, OrderOutputDto, UpdateOrderDTO } from './dto';

@Controller('order')
@ApiTags('order')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly service: OrderService) { }

  @Public()
  @Post()
  @ApiCreatedResponse({ type: OrderOutputDto })
  create(@Body() CreateOrderDto: CreateOrderDto): Promise<Order> {
    return this.service.create(CreateOrderDto);
  }

  @Public()
  @Get()
  @ApiOkResponse({ type: CreateOrderDto })
  async readAll(
    @Query() query: GetAllQueryDTO,
  ): Promise<Order[] | PaginatedOutputDTO<Order>> {
    return this.service.readAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: CreateOrderDto })
  @ApiParam({ name: 'id', type: Number })
  async readById(@ParamId('id') id: number): Promise<Order> {
    return this.service.readById(id);
  }

  @Public()
  @Patch(':id')
  @ApiOkResponse({ type: CreateOrderDto })
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id') id: number,
    @Body() data: UpdateOrderDTO,
  ): Promise<Order> {
    return this.service.update(id, data);
  }

  // @Post('activate/:id')
  // @HttpCode(200)
  // @ApiOkResponse({ type: CreateOrderDto })
  // @ApiParam({ name: 'id', type: Number })
  // async activate(@ParamId() id: number): Promise<Order> {
  //   return this.service.activate(id);
  // }

  // @Post('inactivate/:id')
  // @HttpCode(200)
  // @ApiOkResponse({ type: CreateOrderDto })
  // @ApiParam({ name: 'id', type: Number })
  // async inactivate(@ParamId() id: number): Promise<Order> {
  //   return this.service.inactivate(id);
  // }
}
