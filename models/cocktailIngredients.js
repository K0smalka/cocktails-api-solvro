import {sequelize} from '../config/database.js';
import {DataTypes} from "sequelize";
import {Cocktail} from "./cocktail.js";

export const CocktailIngredients = sequelize.define('CocktailIngredients', {
    CocktailId: {
        type: DataTypes.INTEGER,
        references: {model: 'Cocktails', key: 'id'},
        onDelete: 'CASCADE'
    },
    IngredientId: {
        type: DataTypes.INTEGER,
        references: {model: 'Ingredients', key: 'id'},
        onDelete: 'CASCADE'
    },
    quantity: {type: DataTypes.STRING, allowNull: false}
}, {
    tableName: 'CocktailIngredients',
});