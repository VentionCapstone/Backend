enum ErrorsTypes {
  DEFAULT = 'DEFAULT',

  ACCOMMODATION_FAILED_TO_CREATE = 'ACCOMMODATION_FAILED_TO_CREATE',
  ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING = 'ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING',
  ACCOMMODATION_FAILED_TO_UPDATE = 'ACCOMMODATION_FAILED_TO_UPDATE',
  ACCOMMODATION_FAILED_TO_DELETE = 'ACCOMMODATION_FAILED_TO_DELETE',
  ACCOMMODATION_FAILED_GET_DELITING = 'ACCOMMODATION_FAILED_GET_DELITING',
  ACCOMMODATION_FAILED_TO_GET = 'ACCOMMODATION_FAILED_TO_GET',
  ACCOMMODATION_FAILED_TO_GET_LIST = 'ACCOMMODATION_FAILED_TO_GET_LIST',
  ACCOMMODATION_FAILED_TO_GET_RESTORING = 'ACCOMMODATION_FAILED_TO_GET_RESTORING',
  ACCOMMODATION_FAILED_TO_RESTORE = 'ACCOMMODATION_FAILED_TO_RESTORE',

  ACCOMMODATIONS_LIST_FAILED_TO_GET = 'ACCOMMODATIONS_LIST_FAILED_TO_GET',

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
  BOOKING_FAILED_TO_BOOK = 'BOOKING_FAILED_TO_BOOK',

  REVIEW_FAILED_TO_CREATE = 'REVIEW_FAILED_TO_CREATE',
  REVIEW_FAILED_TO_GET_FOR_UPDATING = 'REVIEW_FAILED_TO_GET_FOR_UPDATING',
  REVIEW_FAILED_TO_UPDATE = 'REVIEW_FAILED_TO_UPDATE',
  REVIEW_FAILED_TO_GET = 'REVIEW_FAILED_TO_GET',
  REVIEW_FAILED_TO_DELETE = 'REVIEW_FAILED_TO_DELETE',
}

export default ErrorsTypes;
