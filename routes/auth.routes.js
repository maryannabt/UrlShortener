const { Router } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const HttpError = require('../models/http-error');

const router = Router();

router.post('/register', async (req, res, next) => {
    try {

       const { email, password } = req.body;

       const existingUser = await User.findOne({ email });

       if (existingUser) {
            const error = new HttpError(
                'User exists already, please login instead.',
                422
            );
            return next(error);
       }

       const hashedPassword = await bcrypt.hash(password, 12);

       const createdUser = new User({ email, password: hashedPassword });

       await createdUser.save();

       res.status(201).json({ user: createdUser });

    } catch (e) {
       return next(new HttpError('Something went wrong. Please try again.', 500));
    }
});

router.post('/login', async (req, res, next) => {

});

module.exports = router;
