import { Injectable } from '@nestjs/common';
import { CreateCreativeDto } from './dto/create-creative.dto';
import { UpdateCreativeDto } from './dto/update-creative.dto';

@Injectable()
export class CreativeService {
  create(createCreativeDto: CreateCreativeDto) {
    return 'This action adds a new creative';
  }

  findAll() {
    return `This action returns all creative`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creative`;
  }

  update(id: number, updateCreativeDto: UpdateCreativeDto) {
    return `This action updates a #${id} creative`;
  }

  remove(id: number) {
    return `This action removes a #${id} creative`;
  }
}
