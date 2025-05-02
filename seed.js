import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import sequelize from './db/Sequelize.js';
import { initModels, Recipe, RecipeIngredient } from './db/initModels.js';


// # TODO from initModels.js or from models?
import Area from './db/models/Areas.js';
import Category from './db/models/Category.js';
import Ingredient from './db/models/Ingredient.js';
import User from './db/models/User.js';
import Testimonial from './db/models/testimonial.js';


initModels(); // 👈 Важно: ассоциации применяются только после этого


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
    initModels();
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
      // _id: area._id.$oid,
      name: area.name,
    }));
    await Area.bulkCreate(areasForSequelize);
    console.log(`Створено ${areasForSequelize.length} кухонь світу`);

    // Створюємо категорії
    console.log('Створюємо категорії...');
    const categoriesForSequelize = categoriesData.map((category) => ({
      // _id: category._id.$oid,
      name: category.name,
    }));
    await Category.bulkCreate(categoriesForSequelize);
    console.log(`Створено ${categoriesForSequelize.length} категорій`);

    // Створюємо інгредієнти
    console.log('Створюємо інгредієнти...');
    const ingredientsForSequelize = ingredientsData.map((ingredient) => ({
      // _id: ingredient._id,
      name: ingredient.name,
      desc: ingredient.desc,
      img: ingredient.img,
    }));
    await Ingredient.bulkCreate(ingredientsForSequelize);
    console.log(`Створено ${ingredientsForSequelize.length} інгредієнтів`);

    // Створюємо рецепти з інгредієнтами через bulkCreate
    console.log('Створюємо рецепти з інгредієнтами...');

    const recipesForSequelize = recipesData.map((recipe) => ({
      // _id: recipe._id.$oid,
      title: recipe.title,
      // category: recipe.category,
      categoryId:
        categoriesData.findIndex((c) => c.name === recipe.category) + 1,
      // area: recipe.area,
      areaId: areasData.findIndex((a) => a.name === recipe.area) + 1,
      instructions: recipe.instructions,
      description: recipe.description,
      thumb: recipe.thumb,
      time: recipe.time,
      userId: usersData.findIndex((u) => u._id.$oid === recipe.owner.$oid) + 1,
    }));

    const createdRecipes = await Recipe.bulkCreate(recipesForSequelize, {
      returning: true,
    });
    console.log(`Створено ${createdRecipes.length} рецептів`);

    const recipeIngredientsBulk = [];

    for (let i = 0; i < recipesData.length; i++) {
      const recipe = recipesData[i];
      const recipeInstance = createdRecipes[i];

      for (const ing of recipe.ingredients) {
        const ingredientDbId =
          ingredientsData.findIndex((i) => i._id === ing.id) + 1;

        if (ingredientDbId) {
          recipeIngredientsBulk.push({
            recipeId: recipeInstance._id,
            ingredientId: ingredientDbId,
            measure: ing.measure,
          });
        } else {
          console.warn(`Інгредієнт з id ${ing.id} не знайдено`);
        }
      }
    }

    await RecipeIngredient.bulkCreate(recipeIngredientsBulk);
    console.log(
      `Створено ${recipeIngredientsBulk.length} зв'язків рецепт-інгредієнт`
    );

    console.log('Дані успішно завантажено до бази даних!');
    process.exit(0);
  } catch (error) {
    console.error('Помилка під час завантаження даних:', error);
    process.exit(1);
  }
};

seedData();

// const testAssociations = async () => {
//   try {
//     console.log(Object.keys(Recipe.associations));
// // Должно включать 'recipeIngredients'

//     const recipes = await Recipe.findAll({
//       include: [
//         {
//           model: RecipeIngredient,
//           as: 'recipeIngredients',
//           include: [
//             {
//               model: Ingredient,
//               as: 'ingredient',
//               attributes: ['_id', 'name', 'desc', 'img'],
//             },
//           ],
//           attributes: ['measure'],
//         },
//       ],
//       limit: 5, // Limit to 5 recipes for testing
//     });

//     console.log(JSON.stringify(recipes, null, 2));
//   } catch (error) {
//     console.error('Error testing associations:', error);
//   }
// };

// testAssociations();
