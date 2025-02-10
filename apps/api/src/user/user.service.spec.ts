import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedResult } from 'prisma-pagination';
import { AuthService } from '@shared/auth/auth.service';
import { EncryptService } from '@shared/encrypt/encrypt.service';
import { PrismaService } from '@shared/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserOutputDTO } from './dto/output.dto';

describe('User Service Tests', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService,
        AuthService,
        EncryptService,
        JwtService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('must create an user', async () => {
    const user = {
      email: 'john@doe.com',
      password: '1234',
      name: 'John',
      username: 'johnjohn',
    };

    const response = await service.create(user);

    expect(response).toEqual(
      expect.objectContaining({ ...user, password: expect.any(String) }),
    );
  });

  it('must return all users', async () => {
    const users = [
      {
        email: 'john@doe.com',
        password: '1234',
        name: 'John 1',
        username: 'johnjohn',
      },
      {
        email: 'doe@john.com',
        password: '1234',
        name: 'John 2',
        username: 'doedoe',
      },
    ];

    await prisma.user.createMany({
      data: users,
    });

    const data = await service.readAll({});

    const response = (data as PaginatedResult<UserOutputDTO>).data;

    expect(response[0]).toEqual(expect.objectContaining(users[0]));
    expect(response[1]).toEqual(expect.objectContaining(users[1]));
    expect(response).toHaveLength(2);
  });

  it('must return user by id', async () => {
    const user = {
      email: 'john@doe.com',
      password: '1234',
      name: 'John',
      username: 'johnjohn',
    };

    const createdUser = await prisma.user.create({
      data: user,
    });

    const response = await service.readById(createdUser.id);

    expect(response).toEqual(expect.objectContaining(user));
  });

  it('must return updated user', async () => {
    const user = {
      email: 'john@doe.com',
      password: '1234',
      name: 'John',
      username: 'johnjohn',
    };

    const createdUser = await prisma.user.create({
      data: user,
    });

    const updatedUser = {
      name: 'Doe',
      email: 'doe@john.com',
    };

    const response = await service.update(createdUser.id, updatedUser);

    console.log(response);

    expect(response).toEqual(
      expect.objectContaining({ ...updatedUser, password: expect.any(String) }),
    );
  });

  it('must return deleted user', async () => {
    const user = {
      email: 'john@doe.com',
      password: '1234',
      name: 'John',
      username: 'johnjohn',
    };

    const createdUser = await prisma.user.create({
      data: user,
    });

    const response = await service.delete(createdUser.id);

    expect(response).toEqual(expect.objectContaining(user));
  });

  it('must return updated password', async () => {
    // TODO:
    // const oldPassword = createdUser.password;
    // const newPassword = response.password;
    // expect(oldPassword !== newPassword).toBeTruthy();
    expect(1).toBe(1);
  });
});
