import errorWrapper from "../helpers/errorWrapper.js";
import recipeService from "../services/recipeServices.js";


const createRecipe = async (req, res) => {
    const { id: userId } = req.user;
    
    // Handle uploaded image
    let imageURL = null;
    if (req.file) {
        const { filename } = req.file;
        imageURL = `/recipes/${filename}`;
    }
    
    // Parse ingredients from form data
    const ingredients = JSON.parse(req.body.ingredients || "[]");
    
    // Prepare recipe data
    const recipeData = {
        ...req.body,
        userId,
        imageURL,
        ingredients
    };
    
    const recipe = await recipeService.createRecipe(recipeData);
    
    res.status(201).send({
        recipe,
        message: "Recipe created successfully"
    });
};

const getCategories = async (req, res) => {
    const categories = await recipeService.getCategories();
    
    res.status(200).send({
        categories
    });
};

const getIngredients = async (req, res) => {
    const ingredients = await recipeService.getIngredients();
    
    res.status(200).send({
        ingredients
    });
};

const getUserRecipes = async (req, res) => {
    const { id: userId } = req.user;
    
    const recipes = await recipeService.getUserRecipes(userId);
    
    res.status(200).send({
        recipes
    });
};

export default {
    createRecipe: errorWrapper(createRecipe),
    getCategories: errorWrapper(getCategories),
    getIngredients: errorWrapper(getIngredients),
    getUserRecipes: errorWrapper(getUserRecipes),
};
