const { Router } = require('express');
const { check } = require('express-validator');

const linksController = require('../controllers/links-controllers');
const checkAuth = require('../middleware/check-auth');

const router = Router();

router.use(checkAuth);

router.post(
  '/generate',
  [
    check('from')
      .not()
      .isEmpty()
  ],
  linksController.generateLink
);

router.get('/', linksController.getLinks);

router.get('/:id', linksController.getLinkById);

module.exports = router;