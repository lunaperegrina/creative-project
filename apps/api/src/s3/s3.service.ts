import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = 'demo-nest';
  s3 = new AWS.S3({
    accessKeyId: 'AKIAVD23BXxxxxxxxxxx',
    secretAccessKey: 'uwVxyznsJ7PAfgQv4dZBQ5TuZxxxxxxxxxxxxxxx',
  });

  async uploadFile(file) {
    console.log(file);
    console.log('aaaa');
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
