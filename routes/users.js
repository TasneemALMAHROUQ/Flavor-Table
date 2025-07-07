const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");


router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT username, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required." });
    }

   
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    
    const updatedUser = await pool.query(
      "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING username, email",
      [username, email, req.user.id]
    );

    res.json(updatedUser.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old and new passwords are required." });
    }

 
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = userResult.rows[0];

  
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedNewPassword, req.user.id]);

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
