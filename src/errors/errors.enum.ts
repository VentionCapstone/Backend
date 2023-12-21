enum ErrorsTypes {
  DEFAULT = 'DEFAULT',

  ACCOMMODATION_FAILED_TO_CREATE = 'ACCOMMODATION_FAILED_TO_CREATE',
  ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING = 'ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING',
  ACCOMMODATION_FAILED_TO_UPDATE = 'ACCOMMODATION_FAILED_TO_UPDATE',
  ACCOMMODATION_FAILED_TO_DELETE = 'ACCOMMODATION_FAILED_TO_DELETE',
  ACCOMMODATION_ADDRESS_FAILED_TO_DELETE = 'ACCOMMODATION_ADDRESS_FAILED_TO_DELETE',
  ACCOMMODATION_FAILED_TO_GET = 'ACCOMMODATION_FAILED_TO_GET',
  ACCOMMODATION_FAILED_TO_GET_LIST = 'ACCOMMODATION_FAILED_TO_GET_LIST',

  AUTH_FAILED_TO_REGISTER = 'AUTH_FAILED_TO_REGISTER',
  AUTH_FAILED_TO_LOGIN = 'AUTH_FAILED_TO_LOGIN',
  AUTH_FAILED_TO_LOGOUT = 'AUTH_FAILED_TO_LOGOUT',
  AUTH_FAILED_TO_REFRESH_TOKENS = 'AUTH_FAILED_TO_REFRESH_TOKENS',
  AUTH_FAILED_TO_UPDATE_EMAIL = 'AUTH_FAILED_TO_UPDATE_EMAIL',
  AUTH_FAILED_TO_VALIDATE = 'AUTH_FAILED_TO_VALIDATE',
  AUTH_FAILED_TO_GET_TOKENS = 'AUTH_FAILED_TO_GET_TOKENS',
  AUTH_FAILED_VERIFY_EMAIL = 'AUTH_FAILED_VERIFY_EMAIL',
  AUTH_FAILED_SEND_VERIFICATION_EMAIL = 'AUTH_FAILED_SEND_VERIFICATION_EMAIL',
  AUTH_FAILED_TOKEN_VERIFY = 'AUTH_FAILED_TOKEN_VERIFY',

  AMENITIES_LIST_FAILED_TO_GET = 'AMENITIES_LIST_FAILED_TO_GET',
  AMENITIES_FAILED_TO_GET = 'AMENITIES_FAILED_TO_GET',
  AMENITIES_FAILED_TO_ADD = 'AMENITIES_FAILED_TO_ADD',
  AMENITIES_FAILED_TO_UPDATE = 'AMENITIES_FAILED_TO_UPDATE',
  AMENITIES_FAILED_TO_DELETE = 'AMENITIES_FAILED_TO_DELETE',
  AMENITIES_OWNER_FAILED_TO_VERIFY = 'AMENITIES_OWNER_FAILED_TO_VERIFY',

  USERS_LIST_FAILED_TO_GET = 'USERS_LIST_FAILED_TO_GET',
  USER_FAILED_TO_GET = 'USER_FAILED_TO_GET',
  USER_PROFILE_FAILED_TO_GET = 'USER_PROFILE_FAILED_TO_GET',
  USER_PROFILE_FAILED_TO_ADD = 'USER_PROFILE_FAILED_TO_ADD',
  USER_PROFILE_FAILED_TO_UPDATE = 'USER_PROFILE_FAILED_TO_UPDATE',
  USER_PROFILE_FAILED_TO_DELETE = 'USER_PROFILE_FAILED_TO_DELETE',

  BOOKING_FAILED_TO_GET_AVAILABLE_DATES = 'BOOKING_FAILED_TO_GET_AVAILABLE_DATES',

  PAYMENT_FAILED_TO_PROCESS = 'PAYMENT_FAILED_TO_PROCESS',
}

export default ErrorsTypes;
