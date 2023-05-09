const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getDbCollection = require("./utils/db");

const app = express();
const port = process.env.PORT || 4001;

// middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Routes
const rootRouter = require("./routes/root.route");
const songRouter = require("./routes/songs.route");
const userRouter = require("./routes/users.route");
app.use("/songs", songRouter);
app.use("/users", userRouter);
app.use("/", rootRouter);

getDbCollection("songs")
  .then((songsCollection) => {
    // Start the server once the database connection is established
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
    process.exit(1);
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

// Add the Swagger UI middleware
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json"); // Import the Swagger document

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(swaggerDocument));
