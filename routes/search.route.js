const express = require("express");
const router = express.Router();
const getDbCollection = require("../utils/db");

router.get("/", async (req, res) => {
  const { title, category, label, lyrics } = req.query;

  const query = {};

  if (title) {
    query.title = title;
  }

  if (category) {
    query.category = category;
  }

  if (label) {
    query.label = label;
  }

  if (lyrics) {
    query.lyrics = lyrics;
  }

  try {
    const songCollection = await getDbCollection("songs");
    const searchResult = await songCollection.find(query).toArray();

    res.json(searchResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
