import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreativeService } from './creative.service';
import { CreateCreativeDto } from './dto/create-creative.dto';
import { UpdateCreativeDto } from './dto/update-creative.dto';

@Controller('creative')
export class CreativeController {
  constructor(private readonly creativeService: CreativeService) {}

  @Post()
  create(@Body() createCreativeDto: CreateCreativeDto) {
    return this.creativeService.create(createCreativeDto);
  }

  @Get()
  findAll() {
    return this.creativeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creativeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreativeDto: UpdateCreativeDto) {
    return this.creativeService.update(+id, updateCreativeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creativeService.remove(+id);
  }
}
