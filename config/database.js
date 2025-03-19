import {Sequelize} from "sequelize";

const DB_NAME = process.env.DB_NAME || "postgres";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "password";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: "localhost",
    dialect: "postgres",
    logging: false,
});