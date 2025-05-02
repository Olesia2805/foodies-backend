export const usersReturnsSchema = (users) => {
  return users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  }));
};
