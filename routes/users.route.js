const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const getDbCollection = require("../utils/db");

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

// app.post("/login", (req, res) => {
//     const { username, password } = req.body;

//     if (username === "my_username" && password === "my_secret_password") {
//       const token = jwt.sign({ username }, process.env.JWT_SECRET);
//       res.send({ token });
//     } else {
//       res.status(401).json({ message: "Incorrect username or password" });
//     }
//   });

//   app.post("/users", (req, res) => {
//     const newUser = req.body;

//     const result = usersData.insertOne(newUser, (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Error adding user to database");
//       }

//       res.send(result.ops[0]);
//     });
//   });

module.exports = router;
