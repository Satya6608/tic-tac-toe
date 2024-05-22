const bcrypt = require("bcrypt");
const User = require("../models/user");
const { createToken, generateOTP } = require("../utils/createToken");

const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Hash password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    // Create a JWT and send it as a response with user's id inside
    const token = createToken(newUser._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: { _id: newUser._id, email: newUser.email, username: newUser.username, image: newUser.image },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.keyPattern) {
      if (error.keyPattern.username) {
        res.status(400).json({ error: "Username is already taken" });
      } else {
        res.status(400).json({ error: "Email is already in use" });
      }
      // Duplicate key error (username is not unique)
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        message: "User registered successfully",
        token: token,
        user: { _id: user._id, email: user.email, username: user.username, image: user.image },
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const userId = req.params.id; // Assuming userId is passed as a parameter in the URL

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user data
    if (username) {
      user.username = username;
    }
    if (password) {
      // Hash new password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (email) {
      user.email = email;
    }

    // Save the updated user data
    await user.save();

    // Send response with updated user data
    res.json({
      success: true,
      message: "User updated successfully",
      user: { _id: user._id, email: user.email, username: user.username, image: user.image},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // Exclude the password field from the response
  const projection = { password: 0 }; // Exclude the password field
  const loggedInUserId = req.query.userId; // Assuming you have access to the logged-in user's ID

  try {
    const users = await User.find({ ...keyword, _id: { $ne: loggedInUserId } }, projection);
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email, "remember password")
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();
    // Here you would typically send the OTP via email or SMS to the user

    // For demonstration, let's just send it in the response
    console.log(otp)
    return res.json({ otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const verifyPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For simplicity, let's assume the OTP sent via email matches the one provided
    if (otp !== user.otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update the password
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { signup, login, editUser, allUsers, getUserById, forgetPassword, verifyPassword };
