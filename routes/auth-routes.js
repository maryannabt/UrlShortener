const { Router } = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');

const router = Router();

router.post(
  '/register',
  [
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.register
);

router.post('/login', usersController.login);

module.exports = router;
