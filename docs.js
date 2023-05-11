const express = require("express");

// Add the Swagger UI middleware
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./public/swagger.json"); // Import the Swagger document

app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(swaggerDocument));
