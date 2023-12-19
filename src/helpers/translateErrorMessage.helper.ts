import { I18nContext, I18nService } from 'nestjs-i18n';

export const translateErrorMessage = async (
  i18n: I18nService,
  errorMessageKey: string
): Promise<string> => {
  return i18n.translate(errorMessageKey, { lang: I18nContext.current()?.lang });
};
