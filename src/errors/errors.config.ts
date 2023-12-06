import { ErrorDefinition } from './error.interface';
import ErrorsTypes from './errors.enum';

const ERRORS: ErrorDefinition = {
  DEFAULT: {
    statusCode: 500,
    message: 'Internal Server Error.',
  },

  [ErrorsTypes.ACCOMMODATION_FAILED_TO_CREATE]: {
    statusCode: 500,
    message: 'Failed to create accommodation.',
  },
  [ErrorsTypes.ACCOMMODATION_NOT_FOUND]: {
    statusCode: 404,
    message: 'Accommodation not found.',
  },
  [ErrorsTypes.ACCOMMODATION_NOT_OWNER]: {
    statusCode: 403,
    message: 'You are now the owner of this accommodation.',
  },
  [ErrorsTypes.ACCOMMODATION_CANNOT_DELETE_ADDRESS]: {
    statusCode: 404,
    message: 'Can not delete Address of this Accommodation.',
  },
  [ErrorsTypes.ACCOMMODATION_NO_FILE_PROVIDED]: {
    statusCode: 400,
    message: 'No file provided, you need to provide a file!!!',
  },
  [ErrorsTypes.ADDRESS_NOT_FOUND]: {
    statusCode: 400,
    message: 'Address for this accommodation not found here.',
  },
};

export default ERRORS;
