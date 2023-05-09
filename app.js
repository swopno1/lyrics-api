const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const getDbCollection = require("./utils/db");

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

const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

mongoClient.connect((err, client) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  const db = mongoClient.db();

  app.use(express.json()); // Parse JSON request bodies

  // Routes
  const songRouter = require("./routes/songs.route");
  app.use("/songs", songRouter);
});

app.get("/", (req, res) => {
  res.send("Lyrics API");
});

app.listen(port, () => {
  console.log(`Lyrics API listening on port ${port}`);
});
