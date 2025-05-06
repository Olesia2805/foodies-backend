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
  VERIFICATION_TOKEN_MISSING: 'Verification token is missing',
  RECIPE_NOT_FOUND: 'Recipe not found',
  RECIPES_NOT_FOUND: 'Recipes not found',
  RECIPE_DELETE_PERMISSION_DENIED:
    'Recipe not found or you do not have permission to delete it',
  RECIPE_CREATION_FAILED:
    'Failed to create the recipe. Please try again later.',
  TESTIMONIAL_NOT_FOUND: 'Testimonial not found',
  CANT_SUBSCRIBE_TO_YOURSELF: 'You can\'t subscribe to yourself',
  ALREADY_SIGNED: 'You already signed to this user',
};

export const SUCCESS = {
  FOLLOWED: 'Successfully followed',
  UNFOLLOWED: 'Successfully unfollowed',
  VERIFICATION_EMAIL_SENT: 'Verification email sent',
  VERIFICATION_SUCCESSFULL: 'Verification successful',
  VERIFICATION_ALREADY_PASSED: 'Verification has already been passed',
  RECIPE_CREATED: 'Recipe created successfully',
  RECIPE_DELETED: 'Recipe deleted successfully',
  CATEGORY_CREATED: 'Category created successfully',
};
