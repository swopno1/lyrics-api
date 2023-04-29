const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4001;

// middleware
app.use(cors());
app.use(express.json());

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

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Connected to MongoDB");
      }
    });

    const mainData = client.db("apidata").collection("main");
    const usersData = client.db("apidata").collection("users");

    app.post("/login", async (req, res) => {
      const { username, password } = req.body;

      if (username === "my_username" && password === "my_secret_password") {
        const token = jwt.sign({ username }, process.env.JWT_SECRET);
        res.send({ token });
      } else {
        res.status(401).json({ message: "Incorrect username or password" });
      }
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = usersData.find(query);
      const users = await cursor.toArray();

      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;

      const result = await usersData.insertOne(newUser);
      res.send(result);
    });

    app.get("/alldata", async (req, res) => {
      const query = {};
      const allData = await mainData.find(query).toArray();

      await res.status(200).json({ status: "success", data: allData });
    });

    app.get("/songdata/:id", async (req, res) => {
      const songData = await mainData.findOne({
        _id: new ObjectId(req.params.id),
      });

      await res.status(200).json({ status: "success", data: songData });
    });
  } finally {
    console.log("Request completed");
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Lyrics API");
});

app.listen(port, () => {
  console.log(`Lyrics API listening on port ${port}`);
});
