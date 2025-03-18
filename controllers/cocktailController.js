import {Cocktail, Ingredient, CocktailIngredients} from "../models/index.js";
import {Op} from "sequelize";
import express from "express";

export const router = express.Router();

router.post('/', async (req, res) => {
        try {
            const cocktail = await Cocktail.create(req.body);
            res.status(201).json(cocktail);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
);

router.get('/', async (req, res) => {
        try {
            const {ingredient, alcohol, sort} = req.query;
            const include = [{
                model: Ingredient,
                through: {
                    attributes: ['quantity'],
                },
                attributes: ['id', 'name', 'description', 'isAlcohol', 'image'],
            }];

            const where = {};
            const order = [];

            if (ingredient) {
                include[0].where = {name: {[Op.iLike]: `%${ingredient}%`}};
            }

            if (alcohol !== undefined) {
                include[0].where = {isAlcohol: alcohol === 'true'};
            }

            if (sort) {
                const sortOptions = {
                    name: ['name', 'ASC'],
                    date: ['createdAt', 'DESC'],
                    category: ['category', 'ASC'],
                };

                if (!sortOptions[sort]) {
                    return res.status(400).json({error: "Invalid sort parameter"});
                }

                order.push(sortOptions[sort]);
            }

            const cocktails = await Cocktail.findAll({
                where,
                include,
                order,
            });

            res.status(200).json(cocktails);
        } catch (error) {
            res.status(500).json({error: "Error downloading cocktails"});
        }
    }
);

router.get('/:id', async (req, res) => {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({message: 'Missing cocktail ID in data.'});
            }

            const cocktail = await Cocktail.findByPk(id, {
                include: {
                    model: Ingredient,
                    through: {
                        attributes: ['quantity'],
                    },
                    attributes: ['id', 'name', 'description', 'isAlcohol', 'image'],
                },
            });

            if (!cocktail) return res.status(404).json({message: 'Cocktail not found'});

            res.status(200).json(cocktail);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
);

router.put('/:id', async (req, res) => {
        try {
            const {id, ...updateData} = req.params;
            if (!id) {
                return res.status(400).json({message: 'Missing cocktail ID in data.'});
            }

            const [updated] = await Cocktail.update(updateData, {where: {id}});
            if (!updated) return res.status(404).json({message: 'Cocktail not found'});
            res.status(200).json({message: 'Cocktail updated successfully'});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
);

router.delete('/:id', async (req, res) => {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({message: 'Missing cocktail ID in data.'});
            }

            const deleted = await Cocktail.destroy({where: {id}});
            if (!deleted) return res.status(404).json({message: 'Cocktail not found'});

            res.status(200).json({message: 'Cocktail deleted successfully'});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
);

router.post('/:id/ingredient', async (req, res) => {
        try {
            const cocktailId = req.params.id;
            const {ingredientId, quantity} = req.body;

            const cocktail = await Cocktail.findByPk(cocktailId);
            if (!cocktail) {
                return res.status(404).json({message: 'Cocktail not found'});
            }

            const ingredient = await Ingredient.findByPk(ingredientId);
            if (!ingredient) {
                return res.status(404).json({message: 'Ingredient not found'});
            }

            await CocktailIngredients.create({
                CocktailId: cocktailId,
                IngredientId: ingredientId,
                quantity,
            });

            res.status(201).json({message: 'Ingredient added to cocktail successfully'});
        } catch (error) {
            console.error('Error adding ingredient to cocktail:', error);
            res.status(500).json({message: error.message});
        }
    }
);


router.put('/:id/ingredient', async (req, res) => {
        try {
            const {id} = req.params;
            const {ingredientId, quantity} = req.body;

            if (!id || !ingredientId || quantity === undefined) {
                return res.status(400).json({message: 'Missing required data (cocktail ID, ingredient or quantity).'});
            }

            const cocktailIngredient = await CocktailIngredients.findOne({
                where: {CocktailId: id, IngredientId: ingredientId}
            });

            if (!cocktailIngredient) {
                return res.status(404).json({message: 'The given ingredient does not exist in this cocktail.'});
            }

            await cocktailIngredient.update({quantity});

            res.status(200).json({message: 'Ingredient quantity has been updated.'});

        } catch (error) {
            console.error('Error updating ingredient:', error);
            res.status(500).json({message: error.message});
        }
    }
);


router.delete('/:id/ingredient', async (req, res) => {
        try {
            const {id} = req.params;
            const {ingredientId} = req.body;

            if (!id || !ingredientId) {
                return res.status(400).json({message: 'Missing required data (cocktail or ingredient ID).'});
            }

            const deleted = await CocktailIngredients.destroy({
                where: {CocktailId: id, IngredientId: ingredientId}
            });

            if (!deleted) {
                return res.status(404).json({message: 'The given ingredient does not exist in this cocktail.'});
            }

            res.status(200).json({message: 'The ingredient has been removed from the cocktail.'});

        } catch (error) {
            console.error('Error removing ingredient:', error);
            res.status(500).json({message: error.message});
        }
    }
);