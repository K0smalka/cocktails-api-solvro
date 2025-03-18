const {Cocktail, Ingredient, CocktailIngredients} = require('../models');
const {Op} = require('sequelize');
const express = require("express");
const router = express.Router();

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
                    attributes: ['quantity'], // Ilość składnika
                },
                attributes: ['id', 'name', 'description', 'isAlcohol', 'image'], // Szczegóły składnika
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
                    return res.status(400).json({error: "Niepoprawny parametr sortowania"});
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
            res.status(500).json({error: "Błąd podczas pobierania koktajli"});
        }
    }
);

router.get('/:id', async (req, res) => {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({message: 'Brak ID koktajlu w danych.'});
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
                return res.status(400).json({message: 'Brak ID koktajlu w danych.'});
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
                return res.status(400).json({message: 'Brak ID koktajlu w danych.'});
            }

            const deleted = await Cocktail.destroy({where: {id}});
            if (!deleted) return res.status(404).json({message: 'Cocktail not found'});

            res.status(200).json({message: 'Cocktail deleted successfully'});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
);

router.post('/:id/ingredients', async (req, res) => {
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

//dodac ponizsza funkcje
//router.delete('/:id/:ingredientId', cocktailController.deleteIngredientFromCocktail);

module.exports = router;