const express = require('express');
const heroController = require('../controllers/heroController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(heroController.getAllHeroes).post(
  authController.restrictTo('admin'),

  heroController.createHero
);

router
  .route('/:id')
  .get(heroController.getHero)
  .patch(authController.restrictTo('admin'), heroController.updateHero)
  .delete(authController.restrictTo('admin'), heroController.deleteHero);

module.exports = router;
