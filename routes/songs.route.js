const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const getDbCollection = require("../utils/db");

// GET /songs - Retrieve all songs
router.get("/", async (req, res) => {
  const query = {};
  const songs = await getDbCollection("songs").find(query).toArray();

  await res.status(200).send(songs);
});

// GET /songs/:id - Retrieve a specific song by ID
router.get("/:id", async (req, res) => {
  const song = await getDbCollection("songs").findOne({
    _id: ObjectId(req.params.id),
  });
  if (!song) {
    return res.status(404).send("Song not found");
  }
  res.status(200).send(song);
});

// POST /songs - Add a new song
router.post("/", async (req, res) => {
  const newSong = req.body;
  if (!newSong.title || !newSong.lyrics) {
    return res.status(400).send("Title and artist are required");
  }
  const result = await getDbCollection("songs").insertOne(newSong);
  res.send(result.ops[0]);
});

module.exports = router;
