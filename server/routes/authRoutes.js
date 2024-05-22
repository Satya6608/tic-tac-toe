const express = require("express");
const { allUsers, getUserById, signup, editUser, login, forgetPassword, verifyPassword } = require("../controllers/authController");

const router = express.Router();

// Signup endpoint
router.get("/", allUsers);
router.get("/:id", getUserById);
router.post("/signup", signup);
router.put("/edit/:id", editUser);

// Login endpoint
router.post("/login", login);

// forgot password endpoint
router.post("/forgetpassword", forgetPassword);
router.post("/verifypassword", verifyPassword);

module.exports = router;
