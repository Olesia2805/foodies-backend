export const usersReturnsSchema = (users, page, limit, total) => {
  const paginatedUsers = users.slice((page - 1) * limit, page * limit);

  return {

    users: paginatedUsers.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      recipes: user.recipes,
      // recipes: user.recipes.map(recipe => recipe.thumb)
    })),
  };
};
