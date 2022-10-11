const express = require('express');
const abilityController = require('../controllers/abilityController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(abilityController.getAllAbilities)
  .post(authController.restrictTo('admin'), abilityController.createAbility);

router
  .route('/:id')
  .get(abilityController.getAbility)
  .patch(authController.restrictTo('admin'), abilityController.updateAbility)
  .delete(authController.restrictTo('admin'), abilityController.deleteAbility);

module.exports = router;
