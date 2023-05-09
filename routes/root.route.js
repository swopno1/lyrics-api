const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a list of all songs
 *     description: Returns a list of all songs in the database
 *     responses:
 *       200:
 *         description: A list of songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */
router.get("/", (req, res) => {
  res.send("Lyrics API");
});

module.exports = router;
