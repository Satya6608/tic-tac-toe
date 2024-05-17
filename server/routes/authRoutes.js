const express = require("express");
const { allUsers, getUserById, signup, editUser, login } = require("../controllers/authController");

const router = express.Router();

// Signup endpoint
router.get("/", allUsers);
router.get("/:id", getUserById);
router.post("/signup", signup);
router.put("/edit/:id", editUser);

// Login endpoint
router.post("/login", login);

module.exports = router;
