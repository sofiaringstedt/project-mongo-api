import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

import data from "./data/top-music.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const Song = mongoose.model("Song", {
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
});


if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany();
    data.forEach(singleSong => {
      const newSong = new Song(singleSong)
      newSong.save();
    })
  }
  seedDatabase();
}

// Added middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Routes defined 
app.get("/", (req, res) => {
  const Main = {
    About:
      "An API with 50 popular Spotify tracks",
    Routes: [
      {
        "/api/songs": "Get all songs",
        "/api/song/{number}": "Get a songs by its ID",
      },
    ],
  };
  res.send(Main);
});

app.get("/api/songs", async (req, res) => {
  const Songs = await Song.find();
  res.send(Songs)
})

app.get("/api/song/:id", async (req, res) => {
  const SongById = await Song.findOne({ id: req.params.id });
  res.send(SongById)
})

// Starting the server
app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
});
