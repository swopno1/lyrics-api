const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const getDbCollection = require("../utils/db");

// GET /users - Retrieve all users data
router.get("/", async (req, res) => {
  try {
    const usersCollection = await getDbCollection("users");
    const users = await usersCollection.find().toArray();
    await res.status(200).send(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error retrieving users from database");
  }
});

// POST /users/login - Retrieve users JWT token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === "my_username" && password === "my_secret_password") {
    const token = await jwt.sign({ username }, process.env.JWT_SECRET);
    await res.send({ token });
  } else {
    res.status(401).json({ message: "Incorrect username or password" });
  }
});

// POST /users/signup - Signup new user data
router.post("/signup", async (req, res) => {
  try {
    const newUser = req.body;
    const usersCollection = await getDbCollection("users");
    if (newUser.username && newUser.password) {
      const result = await usersCollection.insertOne(newUser);
      await res.send(result);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error adding user to database");
  }
});

// PUT /users/update/:id - Update an users data
router.put("/update/:id", async (req, res) => {
  try {
    const updates = { $set: req.body };
    const query = { _id: new ObjectId(req.params.id) };
    const usersCollection = await getDbCollection("users");

    const updatedUser = await usersCollection.updateOne(query, updates, {
      upsert: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    await res.send(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error adding user to database");
  }
});

module.exports = router;
