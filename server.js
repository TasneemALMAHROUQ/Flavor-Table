const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pg = require("pg");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = require("./db");


app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const homeRoutes = require("./routes/home");
const recipeRoutes = require("./routes/recipes");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");


app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/", homeRoutes);
app.use("/api/recipes", recipeRoutes);


pool.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
