document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("recipesContainer");
  const token = localStorage.getItem("token");

  fetch("/recipes/all", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => res.json())
    .then((recipes) => {
      if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
      }

      container.innerHTML = "";

      recipes.forEach((recipe) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe-card");

        recipeDiv.innerHTML = `
          <h2>${recipe.title}</h2>
          <img src="${recipe.image}" alt="${recipe.title}" width="200" />
          <p>${recipe.instructions}</p>
          <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
          <p><strong>Ready in:</strong> ${recipe.readyin} minutes</p>
          <button data-id="${recipe.id}" class="delete-btn">Delete</button>
          <button data-id="${recipe.id}" class="edit-btn">Edit</button>
        `;

        container.appendChild(recipeDiv);
      });
    })
    .catch((err) => {
      container.innerHTML = "<p>Failed to load recipes.</p>";
      console.error(err);
    });
});
