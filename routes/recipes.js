const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

router.get("/random", async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random`,
      {
        params: {
          apiKey: apiKey,
          number: 10,
        },
      }
    );

    const recipes = response.data.recipes;

    const simplifiedRecipes = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      instructions: recipe.instructions,
      ingredients: recipe.extendedIngredients.map(ing => ing.original),
    }));

    res.json(simplifiedRecipes);
  } catch (error) {
    console.error("❌ Error fetching random recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch random recipes" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    const ingredients = req.query.ingredients;

    if (!ingredients) {
      return res.status(400).json({ error: "Missing 'ingredients' query parameter" });
    }

    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          apiKey: apiKey,
          ingredients: ingredients,
          number: 15,
          ranking: 1,
        },
      }
    );

    const simplifiedResults = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients.map(ing => ing.name),
      missedIngredients: recipe.missedIngredients.map(ing => ing.name),
    }));

    res.json(simplifiedResults);
  } catch (error) {
    console.error("❌ Error fetching recipes by ingredients:", error.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// تفاصيل وصفة بواسطة ID
router.get("/:id", async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    const recipeId = req.params.id;

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information`,
      {
        params: {
          apiKey: apiKey,
        },
      }
    );

    const recipe = response.data;

    const simplified = {
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      readyInMinutes: recipe.readyInMinutes,
    };

    res.json(simplified);
  } catch (error) {
    console.error("❌ Error fetching recipe details:", error.message);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
});

module.exports = router;
