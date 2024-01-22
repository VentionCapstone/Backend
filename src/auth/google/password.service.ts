import { Injectable } from '@nestjs/common';
import * as generator from 'generate-password';

@Injectable()
export class PasswordService {
  generatePassword(): string {
    const passwordOptions = {
      length: 12,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
      strict: true,
    };

    return generator.generate(passwordOptions);
  }
}
