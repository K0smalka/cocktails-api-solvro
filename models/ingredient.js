import {sequelize} from '../config/database.js';
import {DataTypes} from 'sequelize';

export const Ingredient = sequelize.define('Ingredient', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    isAlcohol: {type: DataTypes.BOOLEAN, allowNull: false},
    image: {type: DataTypes.STRING, allowNull: true}
}, {
    tableName: 'Ingredients',
});