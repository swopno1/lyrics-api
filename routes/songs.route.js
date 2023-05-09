const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const getDbCollection = require("../utils/db");

// GET /songs - Retrieve all songs
router.get("/", async (req, res) => {
  const query = {};
  const songCollection = await getDbCollection("songs");
  const songs = await songCollection.find(query).toArray();

  await res.status(200).send(songs);
});

// GET /songs/:id - Retrieve a specific song by ID
router.get("/:id", async (req, res) => {
  const songCollection = await getDbCollection("songs");
  const song = await songCollection.findOne({
    _id: new ObjectId(req.params.id),
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
  const songCollection = await getDbCollection("songs");
  const result = await songCollection.insertOne(newSong);

  if (result.acknowledged && result.insertedId) {
    // const insertedSong = await songsCollection.findOne({_id: result.insertedId});
    res.status(201).send(newSong);
  } else {
    res
      .status(500)
      .send("An error occurred while creating a new song in the database");
  }
});

// PUT /songs/:id - Update a specific song by ID
router.put("/:id", async (req, res) => {
  const songCollection = await getDbCollection("songs");
  const query = { _id: new ObjectId(req.params.id) };
  const updates = { $set: req.body };
  const updatedSong = await songCollection.updateOne(query, updates, {
    upsert: true,
  });
  if (!updatedSong) {
    return res.status(404).send("Song not found");
  }
  res.status(200).send(updatedSong);
});

// DELETE /songs/:id - Delete a specific song by ID
router.delete("/:id", async (req, res) => {
  const songCollection = await getDbCollection("songs");
  const query = { _id: new ObjectId(req.params.id) };
  const result = await songCollection.deleteOne(query);
  if (!result) {
    return res.status(404).send("Song not found");
  }
  res.status(200).send(result);
});

module.exports = router;
