import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  async hashString(str: string, salt = 10): Promise<string> {
    if (!str) {
      throw new Error('String to hash is required');
    }
    if (typeof salt !== 'number' || salt <= 0) {
      throw new Error('Salt must be a positive number');
    }
    return bcrypt.hash(str, salt);
  }

  async compareStrings(str: string, hashedStr: string): Promise<boolean> {
    if (!str || !hashedStr) {
      throw new Error('Both strings are required for comparison');
    }
    return bcrypt.compare(str, hashedStr);
  }
}
