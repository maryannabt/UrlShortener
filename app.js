const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth-routes');
const linkRoutes = require('./routes/link-routes');
const redirectRoutes = require('./routes/redirect-routes');
// const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join("client", "build")));

app.use('/api/auth', authRoutes);
app.use('/api/link', linkRoutes);
app.use('/t', redirectRoutes);

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// app.use((req, res, next) => {
//   const error = new HttpError('Could not find this route.', 404);
//   throw error;
// });

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        app.listen(PORT, () => console.log(`App in running on port ${PORT}`));

    } catch (error) {
        console.log('Server Error', error.message);
    }
}

start();
