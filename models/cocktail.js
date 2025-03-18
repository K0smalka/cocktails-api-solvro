import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js'

export const Cocktail = sequelize.define('Cocktail', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: false},
    instructions: {type: DataTypes.STRING, allowNull: false},
}, {
    tableName: 'Cocktails',
});