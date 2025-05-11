# Інструкція з використання проекту Foodies

## Вимоги

- Docker та Docker Compose повинні бути встановлені на вашій системі.
- Node.js та npm (для локальної розробки без Docker).

## Структура проекту

Проект повинен мати наступну структуру папок:

```
foodies-backend/
  app.js
  docker-compose.yml
  Dockerfile
  package.json
  README.md
  seed.js
  constants/
    auth.js
  controllers/
    authControllers.js
  db/
    Sequelize.js
    models/
      User.js
  data/
    areas.json
    categories.json
    ingredients.json
    recipes.json
    testimonials.json
    users.json
  helpers/
    errorWrapper.js
    HttpError.js
    validateBody.js
  middlewares/
    auth.js
    upload.js
  public/
    avatars/
  routes/
    authRouter.js
  schemas/
    authSchema.js
  services/
    authServices.js
  temp/
foodies-frontend/
  Dockerfile
  eslint.config.js
  index.html
  package.json
  README.md
  vite.config.js
  public/
    vite.svg
  src/
    App.css
    App.jsx
    index.css
    main.jsx
    assets/
      react.svg
```

> **Увага!** Запускати проект потрібно саме з папки `foodies-backend`, оскільки всі основні конфігурації та `docker-compose.yml` знаходяться саме там.

## Запуск проекту за допомогою Docker Compose

1. Відкрийте термінал і перейдіть до папки `foodies-backend`:

   ```bash
   cd /Users/someuser/Desktop/foodies/foodies-backend
   ```

2. Запустіть сервіси за допомогою Docker Compose:

   ```bash
   docker-compose up
   ```

3. Після запуску:

   - **Бекенд** буде доступний за адресою: [http://localhost:3000](http://localhost:3000)
   - **Фронтенд** буде доступний за адресою: [http://localhost:3001](http://localhost:3001)

4. Для зупинки сервісів натисніть `Ctrl+C` у терміналі або виконайте:
   ```bash
   docker-compose down
   ```

## Локальна розробка без Docker

### Запуск бекенду

1. Перейдіть до папки `foodies-backend`:

   ```bash
   cd foodies-backend
   ```

2. Встановіть залежності:

   ```bash
   npm install
   ```

3. Запустіть сервер у режимі розробки:

   ```bash
   npm run dev
   ```

4. Бекенд буде доступний за адресою: [http://localhost:3000](http://localhost:3000)

### Запуск фронтенду

1. Перейдіть до папки `foodies-frontend`:

   ```bash
   cd ../foodies-frontend
   ```

2. Встановіть залежності:

   ```bash
   npm install
   ```

3. Запустіть фронтенд у режимі розробки:

   ```bash
   npm run dev
   ```

4. Фронтенд буде доступний за адресою: [http://localhost:3001](http://localhost:3001)

## Використання seed-функції

Seed-функція дозволяє заповнити базу даних тестовими даними з папки `foodies-data`.

1. Переконайтеся, що база даних запущена (наприклад, через Docker Compose).

2. Запустіть seed-скрипт:

   ```bash
   node seed.js
   ```

3. Якщо все пройшло успішно, ви побачите повідомлення:

   ```
   Дані успішно завантажено до бази даних!
   ```

4. У разі помилки перевірте логи для отримання додаткової інформації.

## Додаткова інформація

- **База даних**: У проекті використовується PostgreSQL. Дані зберігаються у Docker volume `postgres_data`.
- **Зміна портів**: Якщо потрібно змінити порти, відредагуйте файл `docker-compose.yml`.
- **Логи**: Логи сервісів можна переглянути у терміналі під час запуску або за допомогою команди:
  ```bash
  docker-compose logs
  ```

## API

| Method | Endpoint                                            | Description                                                  |
| ------ | --------------------------------------------------- | ------------------------------------------------------------ |
| POST   | /api/auth/register                                  | Register a new user                                          |
| POST   | /api/auth/login                                     | Login a user and generate a JWT token                        |
| POST   | /api/auth/logout                                    | Logout a user by invalidating the token                      |
| GET    | /api/auth/me                                        | Get information about a current user                         |
| GET    | /api/auth/verify/:verificationToken                 | Verify a user with a verification token (by email)           |
| GET    | /api/auth/verify                                    | Request to resend the verification token to the user's email |
| GET    | /api/auth/refresh-token                             | Refresh JWT token                                            |
| PATCH  | /api/users/avatars                                  | Update a user avatar                                         |
| GET    | /api/users/followings/:userId                       | Get user followings list by user Id                          |
| POST   | /api/users/followings/:followerId                   | Follow the user with followerId                              |
| DELETE | /api/users/followings/:followerId                   | Unfollow the user with followerId                            |
| GET    | /api/users/followers/:userId                        | Get user followers list by user Id                           |
| GET    | /api/users/:userId                                  | Get user by Id                                               |
| GET    | /api/categories                                     | Get list of all categories                                   |
| GET    | /api/ingredients                                    | Get all ingredients (paginated)                              |
| GET    | /api/ingredients/list?ids=1&ids=2                   | Get requested ingredients by ID list                         |
| GET    | /api/ingredients/:id                                | Get ingredient by ID                                         |
| GET    | /api/areas                                          | Get List of All Areas                                        |
| GET    | /api/areas/search?name=someName                     | Get Country by name                                          |
| GET    | /api/testimonials                                   | Get list of all testimonials (paginated)                     |
| GET    | /api/recipes?categoryId=1&areaId=1&ingredientId=1,2 | Get list of all recipes with filters (paginated)             |
| POST   | /api/recipes                                        | Create a new recipe                                          |
| DELETE | /api/recipes/:recipeId                              | Delete recipe by id                                          |
| GET    | /api/recipes/own                                    | Get current user recipes list                                |
| GET    | /api/recipes/:recipeId                              | Get recipe by id                                             |
| POST   | /api/recipes/favorites                              | Add to favorites recipe                                      |
| DELETE | /api/recipes/favorites                              | Delete from favorites recipe                                 |
| GET    | /api/recipes/favorites                              | Get list of favorites recipes                                |


**Note:** `GET /api/ingredients`, `GET /api/testimonials` and `GET /api/recipes/favorites`

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| limit     | number | No       | Items per page (min: 1) |
| page      | number | No       | Page number (min: 1)    |

Example:

```bash
GET /api/ingredients?limit=10&page=2
```
