const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pg = require("pg");
const homeRoutes = require("./routes/home");
const recipeRoutes = require("./routes/recipes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

 app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));




app.use("/", homeRoutes);
app.use("/recipes", recipeRoutes);

pool.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
