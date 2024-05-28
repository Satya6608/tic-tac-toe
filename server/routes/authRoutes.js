const express = require("express");
const { allUsers, getUserById, signup, editUser, login, forgetPassword, verifyPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",protect, allUsers);
router.get("/:id",protect, getUserById);
router.put("/edit/:id",protect, editUser);

// Signup endpoint
router.post("/signup", signup);
// Login endpoint
router.post("/login", login);

// forgot password endpoint
router.post("/forgetpassword",protect, forgetPassword);
router.post("/verifypassword",protect, verifyPassword);

module.exports = router;
