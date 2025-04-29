import Recipe from "../db/models/Recipe.js";
import Category from "../db/models/Category.js";
import Ingredient from "../db/models/Ingredient.js";
import RecipeIngredient from "../db/models/RecipeIngredient.js";
import HttpError from "../helpers/HttpError.js";
import sequelize from "../db/Sequelize.js";

const createRecipe = async (recipeData) => {
    const { ingredients, ...recipeFields } = recipeData;
    
    // Create transaction to ensure all operations succeed or fail together
    const t = await sequelize.transaction();
    
    try {
        // First create the recipe
        const recipe = await Recipe.create(recipeFields, { transaction: t });
        
        // Then add all ingredients
        if (ingredients && ingredients.length > 0) {
            const recipeIngredients = ingredients.map(item => ({
                recipeId: recipe.id,
                ingredientId: item.ingredientId,
                quantity: item.quantity
            }));
            
            await RecipeIngredient.bulkCreate(recipeIngredients, { transaction: t });
        }
        
        // Commit transaction
        await t.commit();
        
        // Return the newly created recipe with its ingredients
        return await Recipe.findByPk(recipe.id, {
            include: [
                { model: Category },
                { model: Ingredient }
            ]
        });
    } catch (error) {
        // Rollback transaction in case of error
        await t.rollback();
        throw HttpError(500, error.message);
    }
};

const getCategories = async () => {
    return await Category.findAll({
        order: [['name', 'ASC']]
    });
};

const getIngredients = async () => {
    return await Ingredient.findAll({
        order: [['name', 'ASC']]
    });
};

const getUserRecipes = async (userId) => {
    return await Recipe.findAll({
        where: { userId },
        include: [
            { model: Category },
            { model: Ingredient }
        ],
        order: [['createdAt', 'DESC']]
    });
};

export default {
    createRecipe,
    getCategories,
    getIngredients,
    getUserRecipes
};
