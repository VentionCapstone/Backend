enum ErrorsTypes {
  DEFAULT = 'DEFAULT',

  // Accommodation module
  BAD_REQUEST_ACCOMMODATION_HAS_BOOKINGS = 'BAD_REQUEST_ACCOMMODATION_HAS_BOOKINGS',
  NOT_FOUND_ACCOMMODATION_FOR_UPDATING = 'NOT_FOUND_ACCOMMODATION_FOR_UPDATING',
  NOT_FOUND_ACCOMMODATION_FOR_DELETING = 'NOT_FOUND_ACCOMMODATION_FOR_DELETING',
  NOT_FOUND_ACCOMMODATION_FOR_RESTORING = 'NOT_FOUND_ACCOMMODATION_FOR_RESTORING',
  NOT_FOUND_ACCOMMODATION = 'NOT_FOUND_ACCOMMODATION',
  ACCOMMODATION_FAILED_TO_CREATE = 'ACCOMMODATION_FAILED_TO_CREATE',
  ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING = 'ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING',
  ACCOMMODATION_FAILED_TO_UPDATE = 'ACCOMMODATION_FAILED_TO_UPDATE',
  ACCOMMODATION_FAILED_TO_DELETE = 'ACCOMMODATION_FAILED_TO_DELETE',
  ACCOMMODATION_FAILED_GET_DELETING = 'ACCOMMODATION_FAILED_GET_DELETING',
  ACCOMMODATION_FAILED_TO_GET = 'ACCOMMODATION_FAILED_TO_GET',
  ACCOMMODATION_FAILED_TO_GET_LIST = 'ACCOMMODATION_FAILED_TO_GET_LIST',
  ACCOMMODATION_FAILED_TO_GET_RESTORING = 'ACCOMMODATION_FAILED_TO_GET_RESTORING',
  ACCOMMODATION_FAILED_TO_RESTORE = 'ACCOMMODATION_FAILED_TO_RESTORE',

  // Auth module
  BAD_REQUEST_AUTH_EMAIL_ALREADY_IN_USE = 'BAD_REQUEST_AUTH_EMAIL_ALREADY_IN_USE',
  BAD_REQUEST_AUTH_PASSWORDS_DONT_MATCH = 'BAD_REQUEST_AUTH_PASSWORDS_DONT_MATCH',
  BAD_REQUEST_AUTH_INVALID_REFRESH_TOKEN = 'BAD_REQUEST_AUTH_INVALID_REFRESH_TOKEN',
  BAD_REQUEST_AUTH_EMAIL_ALREADY_VERIFIED = 'BAD_REQUEST_AUTH_EMAIL_ALREADY_VERIFIED',
  BAD_REQUEST_AUTH_EMAIL_NOT_VERIFIED = 'BAD_REQUEST_AUTH_EMAIL_NOT_VERIFIED',
  BAD_REQUEST_AUTH_EMAIL_INVALID_LINK = 'BAD_REQUEST_AUTH_EMAIL_INVALID_LINK',
  BAD_REQUEST_AUTH_EMAIL_EXPIRED_LINK = 'BAD_REQUEST_AUTH_EMAIL_EXPIRED_LINK',
  BAD_REQUEST_AUTH_INVALID_OLD_PASS = 'BAD_REQUEST_AUTH_INVALID_OLD_PASS',
  FORBIDDEN_FORGOT_PASSWORD_INVALID_TOKEN = 'FORBIDDEN_FORGOT_PASSWORD_INVALID_TOKEN',
  FORBIDDEN_NOT_AUTHORIZED_USER = 'FORBIDDEN_NOT_AUTHORIZED_USER',
  FORBIDDEN_INVALID_TOKEN = 'FORBIDDEN_INVALID_TOKEN',
  NOT_FOUND_AUTH_USER = 'NOT_FOUND_AUTH_USER',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNAUTHORIZED_AUTH_EXPIRED_REFRESH_TOKEN = 'UNAUTHORIZED_AUTH_EXPIRED_REFRESH_TOKEN',
  UNAUTHORIZED_AUTH_EXPIRED_ACCESS_TOKEN = 'UNAUTHORIZED_AUTH_EXPIRED_ACCESS_TOKEN',
  UNAUTHORIZED_TOKEN_NOT_FOUND = 'UNAUTHORIZED_TOKEN_NOT_FOUND',
  AUTH_FAILED_TO_REGISTER = 'AUTH_FAILED_TO_REGISTER',
  AUTH_FAILED_TO_LOGIN = 'AUTH_FAILED_TO_LOGIN',
  AUTH_FAILED_TO_LOGOUT = 'AUTH_FAILED_TO_LOGOUT',
  AUTH_FAILED_TO_REFRESH_TOKENS = 'AUTH_FAILED_TO_REFRESH_TOKENS',
  AUTH_FAILED_TO_UPDATE_EMAIL = 'AUTH_FAILED_TO_UPDATE_EMAIL',
  AUTH_FAILED_TO_VALIDATE = 'AUTH_FAILED_TO_VALIDATE',
  AUTH_FAILED_TO_GENERATE_TOKENS = 'AUTH_FAILED_TO_GENERATE_TOKENS',
  AUTH_FAILED_VERIFY_EMAIL = 'AUTH_FAILED_VERIFY_EMAIL',
  AUTH_FAILED_SEND_VERIFICATION_EMAIL = 'AUTH_FAILED_SEND_VERIFICATION_EMAIL',
  AUTH_FAILED_TOKEN_VERIFY = 'AUTH_FAILED_TOKEN_VERIFY',
  AUTH_FAILED_TO_UPDATE_PASSWORD = 'AUTH_FAILED_TO_UPDATE_PASSWORD',
  AUTH_FORGOT_PASSWORD_FAILED_TO_SEND_EMAIL = 'AUTH_FORGOT_PASSWORD_FAILED_TO_SEND_EMAIL',

  // Amenities module
  CONFLICT_AMENITIES_ALREADY_EXIST = 'CONFLICT_AMENITIES_ALREADY_EXIST',
  NOT_FOUND_AMENITIES_LIST = 'NOT_FOUND_AMENITIES_LIST',
  NOT_FOUND_AMENITIES_FOR_THIS_ID = 'NOT_FOUND_AMENITIES_FOR_THIS_ID',
  NOT_FOUND_AMENITIES_FOR_THIS_ID_OWNERID = 'NOT_FOUND_AMENITIES_FOR_THIS_ID_OWNERID',
  AMENITIES_FAILED_TO_GET_LIST = 'AMENITIES_FAILED_TO_GET_LIST',
  AMENITIES_FAILED_TO_ADD = 'AMENITIES_FAILED_TO_ADD',
  AMENITIES_FAILED_TO_UPDATE = 'AMENITIES_FAILED_TO_UPDATE',

  // User module
  NOT_FOUND_USER_PROFILE = 'NOT_FOUND_USER_PROFILE',
  USER_FAILED_TO_GET_LIST = 'USER_FAILED_TO_GET_LIST',
  USER_FAILED_TO_GET = 'USER_FAILED_TO_GET',
  USER_PROFILE_FAILED_TO_GET = 'USER_PROFILE_FAILED_TO_GET',
  USER_PROFILE_FAILED_TO_ADD = 'USER_PROFILE_FAILED_TO_ADD',
  USER_PROFILE_FAILED_TO_UPDATE = 'USER_PROFILE_FAILED_TO_UPDATE',
  USER_PROFILE_FAILED_TO_DELETE = 'USER_PROFILE_FAILED_TO_DELETE',
  CONFLICT_USER_PROFILE_ALREADY_EXIST = 'CONFLICT_USER_PROFILE_ALREADY_EXIST',

  // Booking module
  BAD_REQUEST_BOOKING_INVALID_DATES = 'BAD_REQUEST_BOOKING_INVALID_DATES',
  BAD_REQUEST_BOOKING_ALREADY_BOOKED = 'BAD_REQUEST_BOOKING_ALREADY_BOOKED',
  NOT_FOUND_BOOKING = 'NOT_FOUND_BOOKING',
  BOOKING_FAILED_TO_GET_AVAILABLE_DATES = 'BOOKING_FAILED_TO_GET_AVAILABLE_DATES',
  BOOKING_FAILED_TO_BOOK = 'BOOKING_FAILED_TO_BOOK',

  // Review module
  BAD_REQUEST_REVIEW_ONLY_AFTER_THE_BOOKING_END = 'BAD_REQUEST_REVIEW_ONLY_AFTER_THE_BOOKING_END',
  CONFLICT_REVIEW_ALREADY_EXIST = 'CONFLICT_REVIEW_ALREADY_EXIST',
  NOT_FOUND_REVIEW_FOR_UPDATING = 'NOT_FOUND_REVIEW_FOR_UPDATING',
  NOT_FOUND_REVIEW = 'NOT_FOUND_REVIEW',
  REVIEW_FAILED_TO_CREATE = 'REVIEW_FAILED_TO_CREATE',
  REVIEW_FAILED_TO_GET_FOR_UPDATING = 'REVIEW_FAILED_TO_GET_FOR_UPDATING',
  REVIEW_FAILED_TO_UPDATE = 'REVIEW_FAILED_TO_UPDATE',
  REVIEW_FAILED_TO_GET = 'REVIEW_FAILED_TO_GET',
  REVIEW_FAILED_TO_DELETE = 'REVIEW_FAILED_TO_DELETE',

  // Payment module
  BAD_REQUEST_INVALID_PAYMENT_OPTION = 'BAD_REQUEST_INVALID_PAYMENT_OPTION',
  BAD_REQUEST_PAYMENT_FAILED = 'BAD_REQUEST_PAYMENT_FAILED',
  PAYMENT_FAILED_TO_PROCESS = 'PAYMENT_FAILED_TO_PROCESS',
  NOT_FOUND_PAYMENT = 'NOT_FOUND_PAYMENT',
  PAYMNET_FAILED_WHILE_CONFIRM = 'PAYMENT_FAILED_WHILE_CONFIRM',

  // Validation
  BAD_REQUEST_INVALID_PHONE_NUMBER = 'BAD_REQUEST_INVALID_PHONE_NUMBER',
}

export default ErrorsTypes;
