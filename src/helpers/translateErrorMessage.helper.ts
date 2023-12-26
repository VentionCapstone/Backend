import { I18nContext, I18nService } from 'nestjs-i18n';

export const translateErrorMessage = (
  i18n: I18nService,
  errorMessageKey: string
): Promise<string> => {
  const key = `errors.${errorMessageKey}`;
  const langFromQuery = I18nContext.current()?.lang;
  return i18n.translate(key, { lang: langFromQuery });
};
