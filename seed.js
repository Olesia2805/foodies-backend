import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import sequelize from './db/Sequelize.js';
import { initModels, RecipeIngredient } from './db/initModels.js';
import Area from './db/models/Areas.js';
import Category from './db/models/Category.js';
import Ingredient from './db/models/Ingredient.js';
import User from './db/models/User.js';
import Recipe from './db/models/Recipe.js';
import Testimonial from './db/models/testimonial.js';
import UserFavorites from './db/models/UserFavorites.js';
// import './db/associations.js';

const seedData = async () => {
  try {
    console.log('Starting data loading...');

    const dataDir = path.join(process.cwd(), 'data');

    // Load data from files
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

    console.log('Data successfully loaded from files');

    // Initialize models and their associations
    console.log('Initializing models...');
    initModels();

    // Sync tables in the correct order
    console.log('Syncing tables...');
    await sequelize.query('SET CONSTRAINTS ALL DEFERRED;');
    
    // Drop all tables
    await sequelize.drop();
    
    // Create tables in the correct order
    await Area.sync({ force: true });
    await Category.sync({ force: true });
    await User.sync({ force: true });
    await Ingredient.sync({ force: true });
    await Recipe.sync({ force: true });
    await Testimonial.sync({ force: true });
    await UserFavorites.sync({ force: true });
    await RecipeIngredient.sync({ force: true });

    console.log('Tables successfully synced');

    // Prepare user data
    const hashedUsersData = usersData.map((user) => ({
      name: user.name,
      password: bcrypt.hashSync(user.password || 'defaultPassword', 10),
      email: user.email,
      avatar: user.avatar,
      token: null,
    }));

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.bulkCreate(hashedUsersData, {
      returning: true,
    });
    console.log(`Created ${createdUsers.length} users`);

    // Create testimonials
    console.log('Creating testimonials...');
    const testimonialsForSequelize = testimonialsData.map((testimonial) => {
      const userIndex =
        usersData.findIndex((u) => u._id.$oid === testimonial.owner.$oid) + 1;
      return {
        testimonial: testimonial.testimonial,
        owner: userIndex,
      };
    });
    await Testimonial.bulkCreate(testimonialsForSequelize);
    console.log(`Created ${testimonialsForSequelize.length} testimonials`);

    // Create areas
    console.log('Creating areas...');
    const areasForSequelize = areasData.map((area) => ({
      name: area.name,
    }));
    await Area.bulkCreate(areasForSequelize);
    console.log(`Created ${areasForSequelize.length} areas`);

    // Create categories
    console.log('Creating categories...');
    const categoriesForSequelize = categoriesData.map((category) => ({
      name: category.name,
    }));
    await Category.bulkCreate(categoriesForSequelize);
    console.log(`Created ${categoriesForSequelize.length} categories`);

    // Create ingredients
    console.log('Creating ingredients...');
    const ingredientsForSequelize = ingredientsData.map((ingredient) => ({
      name: ingredient.name,
      desc: ingredient.desc,
      img: ingredient.img,
    }));
    await Ingredient.bulkCreate(ingredientsForSequelize);
    console.log(`Created ${ingredientsForSequelize.length} ingredients`);

    // Create recipes with ingredients
    console.log('Creating recipes with ingredients...');

    const recipesForSequelize = recipesData.map((recipe) => ({
      title: recipe.title,
      categoryId:
        categoriesData.findIndex((c) => c.name === recipe.category) + 1,
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
    console.log(`Created ${createdRecipes.length} recipes`);

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
          console.warn(`Ingredient with id ${ing.id} not found`);
        }
      }
    }

    await RecipeIngredient.bulkCreate(recipeIngredientsBulk);
    console.log(
      `Created ${recipeIngredientsBulk.length} recipe-ingredient relationships`
    );

    console.log('Data successfully loaded into the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error during data loading:', error);
    process.exit(1);
  }
};

seedData();
