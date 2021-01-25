const { Router } = require('express');

const redirectController = require('../controllers/redirect-controllers');

const router = Router();

router.get('/:code', redirectController.redirectLink);

module.exports = router;