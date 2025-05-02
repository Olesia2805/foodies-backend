import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './Sequelize.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Area from './models/Area.js';
import Ingredient from './models/Ingredient.js';
import Recipe from './models/Recipe.js';
import RecipeIngredient from './models/RecipeIngredient.js';
import Testimonial from './models/Testimonial.js';
import setupAssociations from './associations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    // Setup associations
    setupAssociations();

    // Read JSON files
    const usersData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8'));
    const categoriesData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/categories.json'), 'utf8'));
    const areasData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/areas.json'), 'utf8'));
    const ingredientsData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/ingredients.json'), 'utf8'));
    const recipesData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/recipes.json'), 'utf8'));
    const testimonialsData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/testimonials.json'), 'utf8'));

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    // Create maps to store MongoDB to PostgreSQL ID mappings
    const userIdMap = new Map();
    const categoryIdMap = new Map();
    const areaIdMap = new Map();
    const ingredientIdMap = new Map();

    // Seed Users
    const users = await User.bulkCreate(
      usersData.map(user => ({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }))
    );
    // Create user ID mapping
    users.forEach((user, index) => {
      userIdMap.set(usersData[index]._id.$oid, user.id);
    });
    console.log('Users seeded successfully');

    // Seed Categories
    const categories = await Category.bulkCreate(
      categoriesData.map(category => ({
        name: category.name,
      }))
    );
    // Create category ID mapping
    categories.forEach((category, index) => {
      categoryIdMap.set(categoriesData[index]._id.$oid, category.id);
    });
    console.log('Categories seeded successfully');

    // Seed Areas
    const areas = await Area.bulkCreate(
      areasData.map(area => ({
        name: area.name,
      }))
    );
    // Create area ID mapping
    areas.forEach((area, index) => {
      areaIdMap.set(areasData[index]._id.$oid, area.id);
    });
    console.log('Areas seeded successfully');

    // Seed Ingredients
    const ingredients = await Ingredient.bulkCreate(
      ingredientsData.map(ingredient => ({
        name: ingredient.name,
        description: ingredient.desc,
        image_url: ingredient.img,
      }))
    );
    // Create ingredient ID mapping
    ingredients.forEach((ingredient, index) => {
      ingredientIdMap.set(ingredientsData[index]._id, ingredient.id);
    });
    console.log('Ingredients seeded successfully');

    // Seed Recipes
    const recipes = await Recipe.bulkCreate(
      recipesData.map(recipe => {
        // Find category by name
        const category = categories.find(c => c.name === recipe.category);
        // Find area by name
        const area = areas.find(a => a.name === recipe.area);
        
        return {
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          thumb: recipe.thumb,
          time: parseInt(recipe.time) || null,
          category_id: category?.id,
          area_id: area?.id,
          owner_id: userIdMap.get(recipe.owner.$oid),
        };
      })
    );
    console.log('Recipes seeded successfully');

    // Seed RecipeIngredients
    const recipeIngredients = [];
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const recipeData = recipesData[i];
      
      for (const ingredient of recipeData.ingredients) {
        const ingredientId = ingredientIdMap.get(ingredient.id);
        if (ingredientId) {
          recipeIngredients.push({
            recipe_id: recipe.id,
            ingredient_id: ingredientId,
            measure: ingredient.measure,
          });
        }
      }
    }

    await RecipeIngredient.bulkCreate(recipeIngredients);
    console.log('RecipeIngredients seeded successfully');

    // Seed Testimonials
    const testimonials = await Testimonial.bulkCreate(
      testimonialsData.map(testimonial => ({
        user_id: userIdMap.get(testimonial.owner.$oid),
        text: testimonial.testimonial,
        rating: 5, // Default rating since it's not in the data
      }))
    );
    console.log('Testimonials seeded successfully');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase(); 