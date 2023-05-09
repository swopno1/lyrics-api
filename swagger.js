const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");

const app = express();

// Define Swagger specification
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lyrics API",
      description: "A simple Express API for managing song lyrics",
      version: "1.0.0",
    },
  },
  // Path to the API routes folder
  apis: ["./routes/*.js"],
};

// Generate Swagger specification object
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve the Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
