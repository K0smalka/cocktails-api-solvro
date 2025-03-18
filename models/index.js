const sequelize = require('../config/database');
const Cocktail = require('./cocktail');
const Ingredient = require('./ingredient');
const CocktailIngredients = require('./cocktailIngredients');

Cocktail.belongsToMany(Ingredient, {
    through: CocktailIngredients,
    foreignKey: 'CocktailId',
    otherKey: 'IngredientId',
    onDelete: 'CASCADE'
});

Ingredient.belongsToMany(Cocktail, {
    through: CocktailIngredients,
    foreignKey: 'IngredientId',
    otherKey: 'CocktailId',
    onDelete: 'CASCADE'
});

module.exports = { sequelize, Cocktail, Ingredient, CocktailIngredients };
