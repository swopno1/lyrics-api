const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const getDbCollection = require("../utils/db");

// GET /songs - Retrieve all songs

router.get("/", async (req, res) => {
  const query = {};
  const songCollection = await getDbCollection("songs");
  const songs = await songCollection.find(query).toArray();

  await res.status(200).json(songs);
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
  await res.status(200).json(song);
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
    res.status(201).json(newSong);
  } else {
    res
      .status(500)
      .send("An error occurred while creating a new song in the database");
  }
});

// POST /songs/bulk - Add many songs at once
// Validate bulk song
const validateBulkSong = (req, res, next) => {
  const newSongs = req.body;

  if (!Array.isArray(newSongs) || newSongs.length === 0) {
    return res.status(400).json({
      message: "Invalid data format",
    });
  }

  for (let i = 0; i < newSongs.length; i++) {
    const song = newSongs[i];
    if (!song.title && !song.lyrics) {
      return res.status(400).json({
        message: `Missing title or lyrics property in song ${i}`,
      });
    }
  }

  next();
};
// Making bulk post request
router.post("/bulk", validateBulkSong, async (req, res) => {
  try {
    const newSongs = req.body;

    const songCollection = await getDbCollection("songs");
    const result = await songCollection.insertMany(newSongs);
    const numInserted = result.insertedCount;
    return res.status(201).send(`Successfully inserted ${numInserted} songs`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
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
  res.status(200).json(updatedSong);
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
