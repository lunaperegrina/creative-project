/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import {
  ApiTags,
} from '@nestjs/swagger';

@Controller('s3')
@ApiTags('s3')
// @ApiBearerAuth()
export class S3Controller {
  constructor(private readonly s3Service: S3Service) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    try {
      console.log('aaaa');
      return this.s3Service.uploadFile(file);
    } catch (error) {
      console.error('Erro no upload', error);
    }
  }

}
