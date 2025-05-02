import fs from 'fs/promises';
import path from 'path';
import sequelize from './db/Sequelize.js';
import User from './db/models/User.js';
// import Category from './db/models/Category.js';
// import Ingredient from './db/models/Ingredient.js';
import bcrypt from 'bcrypt';
import Recipe from './db/models/Recipe.js';

const seedData = async () => {
  try {
    
    const dataDir = path.join(process.cwd(), 'data');
    // const usersData = JSON.parse(await fs.readFile(path.join(dataDir, 'users.json'), 'utf-8'));
    // const ingredientsData = JSON.parse(await fs.readFile(path.join(dataDir, 'ingredients.json'), 'utf-8'));
    // const categoriesData = JSON.parse(await fs.readFile(path.join(dataDir, 'categories.json'), 'utf-8'));
    const recipeData = JSON.parse(await fs.readFile(path.join(dataDir, 'recipes.json'), 'utf-8'));

    
    // const hashedUsersData = usersData.map(user => ({
    //   ...user,
    //   password: bcrypt.hashSync(user.password || 'defaultPassword', 10),
    // }));

    const hashedRecipeData = recipeData.map(data => {
      const obj = {
        ...data,
        id: data._id["$oid"],
        owner: data.owner["$oid"],
      }
      delete obj._id
      delete obj.ingredients
      return obj
    });
    
    // await sequelize.sync({ force: true });

    hashedRecipeData.length = 1
    console.log(hashedRecipeData)

    // await User.bulkCreate(hashedUsersData);
    // await Ingredient.bulkCreate(ingredientsData);
    // await Category.bulkCreate(categoriesData);
    await Recipe.bulkCreate(hashedRecipeData);
    
    console.log('Дані успішно завантажено до бази даних!');
    process.exit(0);
  } catch (error) {
    console.error('Помилка під час завантаження даних:', error);
    process.exit(1);
  }
};

seedData();