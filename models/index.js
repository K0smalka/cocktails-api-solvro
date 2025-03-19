import {sequelize} from "../config/database.js";
import {Cocktail} from "./cocktail.js";
import {Ingredient} from "./ingredient.js";
import {CocktailIngredients} from "./cocktailIngredients.js";

Cocktail.belongsToMany(Ingredient, {
    through: CocktailIngredients,
    foreignKey: "CocktailId",
    otherKey: "IngredientId",
    onDelete: "CASCADE",
});

Ingredient.belongsToMany(Cocktail, {
    through: CocktailIngredients,
    foreignKey: "IngredientId",
    otherKey: "CocktailId",
    onDelete: "CASCADE",
});

export {sequelize, Cocktail, Ingredient, CocktailIngredients};