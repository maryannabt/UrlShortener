const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');
const HttpError = require('../models/http-error');

const register = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { email, password } = req.body;

    let existingUser;

    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      const error = new HttpError('Registering failed, please try again later.', 500);
      return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User already exists, please login instead.', 422);
        return next(error);
    }

    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError('Could not create user, please try again.', 500);
      return next(error);
    }

    const createdUser = new User({ email, password: hashedPassword, links: [] });

    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError('Registering failed, please try again later.', 500);
      return next(error); 
    }

    let token;

    try {
      token = jwt.sign(
        { userId: createdUser.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      ); 
    } catch (err) {
      const error = new HttpError('Registering failed, please try again later.', 500);
      return next(error);
    }

    res.status(201).json({ userId: createdUser.id, token });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
      existingUser = await User.findOne({ email }); 
    } catch (err) {
      const error = new HttpError('Logging in failed, please try again later.', 500);
      return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('Invalid credentials, could not log you in.', 403);
        return next(error);
    }

    let isValidPassword = false;

    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password); 
    } catch (err) {
      const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
      return next(error);  
    }

    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials, could not log you in.', 403);
        return next(error);
    }

    let token;

    try {
      token = jwt.sign(
        { userId: existingUser.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      ); 
    } catch (err) {
      const error = new HttpError('Logging in failed, please try again later.', 500);
      return next(error);
    }

    res.json({ userId: existingUser.id, token });
};

exports.register = register;
exports.login = login;