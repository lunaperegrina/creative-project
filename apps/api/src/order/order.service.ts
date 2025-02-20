import { PrismaService } from '@shared/prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';
import slugify from 'slugify';
import { CreateOrderDto, UpdateOrderDTO, OrderOutputDto, GetAllQueryDTO } from './dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data
    });
  }

  async readAll(query: GetAllQueryDTO) {
    if (query.page === 0) {
      return this.prisma.order.findMany({
        orderBy: {
          createdAt: query.created ?? 'desc',
        },
        include: {
          creative: true,
          user: true
        },
      });
    }

    const paginate = createPaginator({ perPage: query.perPage });

    return paginate<OrderOutputDto, Prisma.OrderFindManyArgs>(
      this.prisma.order,
      {
        orderBy: {
          createdAt: query.created ?? 'desc',
        },
        include: {
          creative: true,
          user: true
        },
      },
      { page: query.page },
    );
  }

  async readById(id: number): Promise<Order> {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        creative: true,
        user: true
      },
    });
  }

  async update(id: number, data: UpdateOrderDTO): Promise<Order> {
    return this.prisma.order.update({
      where: {
        id,
      },
      data,
    });
  }
}
