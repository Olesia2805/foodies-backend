import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import sequelize from './db/Sequelize.js';
import Area from './db/models/Areas.js';
import User from './db/models/User.js';
import Category from './db/models/category.js';
import Ingredient from './db/models/ingredient.js';
import Recipe from './db/models/recipe.js';
import Testimonial from './db/models/testimonial.js';

const seedData = async () => {
  try {
    console.log('Починаємо завантаження даних...');

    const dataDir = path.join(process.cwd(), 'data');

    // Завантажуємо дані з файлів
    const usersData = JSON.parse(
      await fs.readFile(path.join(dataDir, 'users.json'), 'utf-8')
    );
    const testimonialsData = JSON.parse(
      await fs.readFile(path.join(dataDir, 'testimonials.json'), 'utf-8')
    );
    const areasData = JSON.parse(
      await fs.readFile(path.join(dataDir, 'areas.json'), 'utf-8')
    );
    const categoriesData = JSON.parse(
      await fs.readFile(path.join(dataDir, 'categories.json'), 'utf-8')
    );
    const ingredientsData = JSON.parse(
      await fs.readFile(path.join(dataDir, 'ingredients.json'), 'utf-8')
    );
    const recipesData = JSON.parse(
      await fs.readFile(path.join(dataDir, 'recipes.json'), 'utf-8')
    );

    console.log('Дані успішно завантажено з файлів');

    // Синхронізуємо моделі з базою даних
    console.log('Синхронізуємо моделі з базою даних...');
    await sequelize.sync({ force: true });
    console.log('Моделі успішно синхронізовано');

    // Підготовка даних користувачів
    const hashedUsersData = usersData.map((user) => ({
      name: user.name,
      password: bcrypt.hashSync(user.password || 'defaultPassword', 10),
      email: user.email,
      avatar: user.avatar,
      token: null,
    }));

    // Створюємо користувачів
    console.log('Створюємо користувачів...');
    const createdUsers = await User.bulkCreate(hashedUsersData, {
      returning: true,
    });
    console.log(`Створено ${createdUsers.length} користувачів`);

    // Створюємо відгуки
    console.log('Створюємо відгуки...');
    const testimonialsForSequelize = testimonialsData.map((testimonial) => {
      const userIndex =
        usersData.findIndex((u) => u._id.$oid === testimonial.owner.$oid) + 1;
      return {
        testimonial: testimonial.testimonial,
        owner: userIndex,
      };
    });
    await Testimonial.bulkCreate(testimonialsForSequelize);
    console.log(`Створено ${testimonialsForSequelize.length} відгуків`);

    // Створюємо кухні світу (areas)
    console.log('Створюємо кухні світу...');
    const areasForSequelize = areasData.map((area) => ({
      _id: area._id.$oid,
      name: area.name,
    }));
    await Area.bulkCreate(areasForSequelize);
    console.log(`Створено ${areasForSequelize.length} кухонь світу`);

    // Створюємо категорії
    console.log('Створюємо категорії...');
    const categoriesForSequelize = categoriesData.map((category) => ({
      _id: category._id.$oid,
      name: category.name,
    }));
    await Category.bulkCreate(categoriesForSequelize);
    console.log(`Створено ${categoriesForSequelize.length} категорій`);

    // Створюємо інгредієнти
    console.log('Створюємо інгредієнти...');
    const ingredientsForSequelize = ingredientsData.map((ingredient) => ({
      _id: ingredient._id,
      name: ingredient.name,
      desc: ingredient.desc,
      img: ingredient.img,
    }));
    await Ingredient.bulkCreate(ingredientsForSequelize);
    console.log(`Створено ${ingredientsForSequelize.length} інгредієнтів`);

    // Створюємо рецепти
    console.log('Створюємо рецепти...');
    const recipesForSequelize = recipesData.map((recipe) => ({
      _id: recipe._id.$oid,
      title: recipe.title,
      category: recipe.category,
      area: recipe.area,
      instructions: recipe.instructions,
      description: recipe.description,
      thumb: recipe.thumb,
      time: recipe.time,
      ingredients: recipe.ingredients,
      userId: usersData.findIndex((u) => u._id.$oid === recipe.owner.$oid) + 1,
    }));
    await Recipe.bulkCreate(recipesForSequelize);
    console.log(`Створено ${recipesForSequelize.length} рецептів`);

    console.log('Дані успішно завантажено до бази даних!');
    process.exit(0);
  } catch (error) {
    console.error('Помилка під час завантаження даних:', error);
    process.exit(1);
  }
};

seedData();
