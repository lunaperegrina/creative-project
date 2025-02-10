import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetAllQueryDTO } from './dto/get-all-query.dto';
import { createPaginator } from 'prisma-pagination';
import { UserOutputDTO } from './dto/output.dto';
import { EncryptService } from '@shared/encrypt/encrypt.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private encrypt: EncryptService,
    private prisma: PrismaService,
  ) {}

  async create(data: CreateUserDTO): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      throw new HttpException(
        'E-mail already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.encrypt.hashString(data.password);

    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  async readAll(query: GetAllQueryDTO) {
    if (query.page === 0) {
      return this.prisma.user.findMany({
        orderBy: {
          createdAt: query.created ?? 'desc',
        },
      });
    }

    const paginate = createPaginator({ perPage: query.perPage });

    return paginate<UserOutputDTO, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        orderBy: {
          createdAt: query.created ?? 'desc',
        },
      },
      { page: query.page },
    );
  }

  async readById(id: number) {
    await this.exists(id);

    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async readByUsername(username: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async update(id: number, data: UpdateUserDTO) {
    await this.exists(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        username: data.username,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async exists(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async activate(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.active) {
      throw new HttpException('User already active', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        active: true,
      },
    });
  }

  async inactivate(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.active) {
      throw new HttpException('User already inactive', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }
}
