import { Ingredient } from "../models/index.js";
import { Op } from "sequelize";
import express from "express";

export const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { name, alcohol, sort } = req.query;
    const where = {};
    const order = [];

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    if (alcohol !== undefined) {
      where.isAlcohol = alcohol === "true";
    }

    if (sort) {
      const sortOptions = {
        name: ["name", "ASC"],
        date: ["createdAt", "DESC"],
      };

      if (!sortOptions[sort]) {
        return res.status(400).json({ error: "Invalid sort parameter" });
      }

      order.push(sortOptions[sort]);
    }

    const ingredients = await Ingredient.findAll({ where, order });
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Error while downloading ingredients" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing ingredient ID in data." });
    }

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient)
      return res.status(404).json({ message: "Ingredient not found" });

    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing ingredient ID in data." });
    }

    const [updated] = await Ingredient.update(req.body, { where: { id } });
    if (!updated)
      return res.status(404).json({ message: "Ingredient not found" });
    res.status(200).json({ message: "Ingredient updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing ingredient ID in data." });
    }

    const deleted = await Ingredient.destroy({ where: { id } });
    if (!deleted)
      return res.status(404).json({ message: "Ingredient not found" });

    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
