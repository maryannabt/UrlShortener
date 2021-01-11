const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const userRoutes = require('./routes/auth.routes');
const HttpError = require('./models/http-error');

const app = express();

app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


const PORT = config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        app.listen(PORT, () => console.log(`App in running on port ${PORT}`));

    } catch (e) {
        console.log('Server Error', e.message);
    }
}

start();
