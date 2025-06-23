const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const homeRoutes = require("./routes/home");
const recipeRoutes = require("./routes/recipes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/", homeRoutes);
app.use("/recipes", recipeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
