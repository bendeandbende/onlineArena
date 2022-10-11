const express = require('express');
const battleController = require('../controllers/battleController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect); 

router.route('/:id').patch(battleController.battleRandom);

module.exports = router;
