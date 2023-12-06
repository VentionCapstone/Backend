import { ErrorDefinition } from './error.interface';
import ErrorsTypes from './errors.enum';

const ERRORS: ErrorDefinition = {
  DEFAULT: {
    statusCode: 500,
    message: 'Internal Server Error.',
  },

  [ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING]: {
    statusCode: 500,
    message: 'Failed to get ccommodation for updating.',
  },
  [ErrorsTypes.ACCOMMODATION_FAILED_TO_CREATE]: {
    statusCode: 500,
    message: 'Failed to create accommodation.',
  },
  [ErrorsTypes.ACCOMMODATION_FAILED_TO_UPDATE]: {
    statusCode: 500,
    message: 'Failed to update existsting accommodation.',
  },
  [ErrorsTypes.ACCOMMODATION_FAILED_TO_DELETE]: {
    statusCode: 500,
    message: 'Failed to delete accommodation .',
  },
  [ErrorsTypes.ACCOMMODATION_ADDRESS_FAILED_TO_DELETE]: {
    statusCode: 500,
    message: 'Failed to delete accommodation address.',
  },
  [ErrorsTypes.ACCOMMODATION_FAILED_TO_GET]: {
    statusCode: 500,
    message: 'Failed to get existsting accommodation.',
  },
};

export default ERRORS;
