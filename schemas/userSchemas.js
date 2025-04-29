export const usersReturnsSchema = (users) => {
  return users.map((user) => ({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  }));
};
