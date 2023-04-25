const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4001;

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connected to MongoDB");
  }
});

const mainData = client.db("apidata").collection("main");
const usersData = client.db("apidata").collection("users");

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "my_username" && password === "my_secret_password") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ message: "Incorrect username or password" });
  }
});

app.get("/users", (req, res) => {
  usersData.find().toArray((err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(users);
    }
  });
});

app.post("/users", (req, res) => {
  const user = req.body;
  usersData.insertOne(user, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).send(result.ops[0]);
    }
  });
});

app.get("/alldata", (req, res) => {
  mainData.find().toArray((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

const verifyJWT = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Missing token" });
  }
};

app.get("/", (req, res) => {
  res.send("Lyrics API");
});

app.listen(port, () => {
  console.log(`Lyrics API listening on port ${port}`);
});
