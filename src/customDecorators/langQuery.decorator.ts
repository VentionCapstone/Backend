import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function LangQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'lang',
      required: false,
      type: 'string',
      description:
        'Optional query. Language code (e.g. ?lang=ru). Used for translating the error messages. Translations are available for ru, de, uz, kz. If not specified, default language is used (en)',
    })
  );
}
