const resultsContainer = document.getElementById("resultsContainer");
const randomRecipeContainer = document.getElementById("randomRecipeContainer");
const searchBtn = document.getElementById("searchBtn");
const ingredientInput = document.getElementById("ingredientInput");

// دالة إنشاء كارد وصفة
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";

  const used = recipe.usedIngredients?.join(", ") || recipe.ingredients?.join(", ") || "-";
  const missed = recipe.missedIngredients?.join(", ") || "-";

  card.innerHTML = `
    <h3>${recipe.title}</h3>
    <img src="${recipe.image}" alt="${recipe.title}" width="200">
    <p><strong>Used Ingredients:</strong> ${used}</p>
    <p><strong>Missed Ingredients:</strong> ${missed}</p>
    <button class="saveBtn">💖 Save to Favorites</button>
    ${recipe.id ? `<a href="recipeDetails.html?id=${recipe.id}" class="details-link">🔎 View Details</a>` : ""}
  `;

  // زر الحفظ للمفضلة
  card.querySelector(".saveBtn").addEventListener("click", () => {
    saveToFavorites(recipe);
  });

  return card;
}

// دالة تحميل وصفات عشوائية
async function loadRandomRecipe() {
  randomRecipeContainer.innerHTML = "<p>Loading random recipes...</p>";
  resultsContainer.innerHTML = "";

  try {
    const response = await fetch("/recipes/random");
    const recipes = await response.json();

    randomRecipeContainer.innerHTML = "";

    if (!Array.isArray(recipes) || recipes.length === 0) {
      randomRecipeContainer.innerHTML = "<p>No random recipes available.</p>";
      return;
    }

    recipes.forEach(recipe => {
      const card = createRecipeCard(recipe);
      randomRecipeContainer.appendChild(card);
    });

  } catch (error) {
    randomRecipeContainer.innerHTML = "<p>⚠️ Error fetching random recipes.</p>";
    console.error(error);
  }
}

// دالة البحث حسب المكونات
searchBtn.addEventListener("click", async () => {
  const ingredients = ingredientInput.value.trim();
  randomRecipeContainer.innerHTML = "";
  resultsContainer.innerHTML = "";

  if (!ingredients) {
    resultsContainer.innerHTML = "<p>Please enter some ingredients to search.</p>";
    return;
  }

  try {
    const response = await fetch(`/recipes/search?ingredients=${encodeURIComponent(ingredients)}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      resultsContainer.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    data.forEach(recipe => {
      const card = createRecipeCard(recipe);
      resultsContainer.appendChild(card);
    });

  } catch (error) {
    resultsContainer.innerHTML = "<p>⚠️ Error fetching recipes.</p>";
    console.error(error);
  }
});

// حفظ وصفة للمفضلة
function saveToFavorites(recipe) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const recipeToSave = {
    id: recipe.id || null,
    title: recipe.title || "No Title",
    image: recipe.image || "",
    usedIngredients: recipe.usedIngredients || [],
    missedIngredients: recipe.missedIngredients || [],
  };

  const alreadyExists = favorites.some(fav => fav.title === recipeToSave.title);

  if (!alreadyExists) {
    favorites.push(recipeToSave);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("✅ Recipe saved to favorites!");
  } else {
    alert("ℹ️ Already in favorites.");
  }
}

// تحميل وصفات عشوائية عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadRandomRecipe);
