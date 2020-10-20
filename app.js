'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const movies = require('./movieStore.json');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

const PORT = 8000;

// this sets the port to listen to
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

// this is validation function for api validations
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  console.log(apiToken);
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

// this function is called in the app.get request
function handleGetMovies(req, res) {
  let response = movies;
  const { genre = '', country = '', avg_vote = 0 } = req.query;

  if (genre) {
    response = response.filter((movie) =>
      // case insensitive searching
      movie.genre.includes(genre)
    );
  }

  if (country) {
    response = response.filter((movie) =>
      // case insensitive searching
      movie.country.includes(country)
    );
  }

  if (avg_vote) {
    const voteNum = parseFloat(avg_vote);
    response = response.filter((movie) =>
      movie.avg_vote >= voteNum
    );
  }

  res.json(response);
}

app.get('/movie', handleGetMovies);

