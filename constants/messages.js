export const ERROR = {
  EMAIL_IN_USE: 'Email in use',
  EMAIL_OR_PASSWORD_IS_WRONG: 'Email or password is wrong',
  USER_NOT_FOUND: 'User not found',
  AVATAR_IS_REQUIRED: "Field 'avatar' is required",
  NOT_AUTHORIZED: 'Not authorized',
  INVALID_FILE_EXTENSION: 'Invalid file extension',
  INGREDIENT_NOT_FOUND: 'Ingredient not found',
  INGREDIENTS_WITH_ID_NOT_FOUND: (ids) =>
    `Not found ingredients with IDs: ${ids.join(', ')}`,
  CATEGORY_NOT_FOUND: 'Category not found',
  AREAS_NOT_FOUND: 'Areas not found',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  ACCESS_TOKEN_EXPIRED: 'Access token expired',
};

export const SUCCESS = {
  FOLLOWED: 'Successfully followed',
  UNFOLLOWED: 'Successfully unfollowed',
};
