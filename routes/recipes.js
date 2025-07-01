const express = require("express");
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const query = "SELECT * FROM recipes ORDER BY id DESC";
    const result = await req.pool.query(query);
    
    const recipes = result.rows.map(r => ({
      ...r,
ingredients: typeof r.ingredients === "string" ? JSON.parse(r.ingredients) : r.ingredients,

    }));

    res.json(recipes);
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.get('/all', async (req, res) => {
  try {
    const { rows } = await req.pool.query('SELECT * FROM recipes');
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});




router.post("/", async (req, res) => {
  try {
    const { title, image, instructions, ingredients, readyin } = req.body;

    if (!title || !ingredients) {
      return res.status(400).json({ error: "Title and ingredients are required" });
    }

    const ingredientsJson = JSON.stringify(ingredients);

    const query = `
      INSERT INTO recipes (title, image, instructions, ingredients, readyin)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [title, image, instructions, ingredientsJson, readyin];
    const result = await req.pool.query(query, values);

    const newRecipe = result.rows[0];
    newRecipe.ingredients = ingredients; 

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Failed to add recipe:", err);
    res.status(500).json({ error: "Failed to add recipe" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = "DELETE FROM recipes WHERE id = $1 RETURNING *";
    const result = await req.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Failed to delete recipe:", err);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, image, instructions, ingredients, readyin } = req.body;

    if (!title || !ingredients) {
      return res.status(400).json({ error: "Title and ingredients are required" });
    }

    const ingredientsJson = JSON.stringify(ingredients);

    const query = `
      UPDATE recipes
      SET title = $1, image = $2, instructions = $3, ingredients = $4, readyin = $5
      WHERE id = $6
      RETURNING *;
    `;

    const values = [title, image, instructions, ingredientsJson, readyin, id];
    const result = await req.pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const updatedRecipe = result.rows[0];
    updatedRecipe.ingredients = ingredients;

    res.json(updatedRecipe);
  } catch (err) {
    console.error("Failed to update recipe:", err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

module.exports = router;
