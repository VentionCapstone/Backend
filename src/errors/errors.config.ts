import { ErrorDefinition } from './error.interface';
import ErrorsTypes from './errors.enum';
import PrismaErrorCodes from './prismaErrorCodes.enum';

const ERRORS: ErrorDefinition = {
  [ErrorsTypes.DEFAULT]: {
    statusCode: 500,
    message: 'Internal Server Error.',
  },

  [PrismaErrorCodes.RECORD_NOT_FOUND]: {
    statusCode: 500,
    message: 'Failed to get this record from db.',
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
  [ErrorsTypes.ACCOMMODATION_FAILED_GET_DELITING]: {
    statusCode: 500,
    message: 'Failed to get deleting accommodation .',
  },
  [ErrorsTypes.ACCOMMODATION_FAILED_TO_RESTORE]: {
    statusCode: 500,
    message: 'Failed to delete accommodation .',
  },
  [ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_RESTORING]: {
    statusCode: 500,
    message: 'Failed to get deleting accommodation .',
  },
  [ErrorsTypes.ACCOMMODATION_FAILED_TO_GET]: {
    statusCode: 500,
    message: 'Failed to get existsting accommodation.',
  },
  [ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_LIST]: {
    statusCode: 500,
    message: 'Failed to get list of accommodations.',
  },

  [ErrorsTypes.AUTH_FAILED_TO_REGISTER]: {
    statusCode: 500,
    message: 'Failed to register user.',
  },
  [ErrorsTypes.AUTH_FAILED_TO_LOGIN]: {
    statusCode: 500,
    message: 'Failed to login user.',
  },
  [ErrorsTypes.AUTH_FAILED_TO_LOGOUT]: {
    statusCode: 500,
    message: 'Failed to logout user.',
  },
  [ErrorsTypes.AUTH_FAILED_TO_REFRESH_TOKENS]: {
    statusCode: 500,
    message: 'Failed to refresh user tokens.',
  },
  [ErrorsTypes.AUTH_FAILED_TO_UPDATE_EMAIL]: {
    statusCode: 500,
    message: 'Failed to update user email.',
  },
  [ErrorsTypes.AUTH_FAILED_TO_VALIDATE]: {
    statusCode: 500,
    message: 'Failed to validate user.',
  },
  [ErrorsTypes.AUTH_FAILED_TO_GET_TOKENS]: {
    statusCode: 500,
    message: 'Failed to validate user.',
  },
  [ErrorsTypes.AUTH_FAILED_VERIFY_EMAIL]: {
    statusCode: 500,
    message: 'Failed to verify user email.',
  },
  [ErrorsTypes.AUTH_FAILED_SEND_VERIFICATION_EMAIL]: {
    statusCode: 500,
    message: 'Failed to send verification email.',
  },
  [ErrorsTypes.AUTH_FAILED_TOKEN_VERIFY]: {
    statusCode: 500,
    message: 'Failed to verify user token.',
  },

  [ErrorsTypes.AMENITIES_LIST_FAILED_TO_GET]: {
    statusCode: 500,
    message: 'Failed to get amenities list.',
  },
  [ErrorsTypes.AMENITIES_FAILED_TO_GET]: {
    statusCode: 500,
    message: 'Failed to get amenities.',
  },
  [ErrorsTypes.AMENITIES_FAILED_TO_ADD]: {
    statusCode: 500,
    message: 'Failed to add amenities.',
  },
  [ErrorsTypes.AMENITIES_FAILED_TO_UPDATE]: {
    statusCode: 500,
    message: 'Failed to update amenities.',
  },
  [ErrorsTypes.AMENITIES_FAILED_TO_DELETE]: {
    statusCode: 500,
    message: 'Failed to delete amenities.',
  },
};

export default ERRORS;
