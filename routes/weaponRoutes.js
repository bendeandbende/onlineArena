const express = require('express');
const weaponController = require('../controllers/weaponController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(weaponController.getAllWeapons)
  .post(authController.restrictTo('admin'), weaponController.createWeapon);

router
  .route('/:id')
  .get(weaponController.getWeapon)
  .patch(authController.restrictTo('admin'), weaponController.updateWeapon)
  .delete(authController.restrictTo('admin'), weaponController.deleteWeapon);

module.exports = router;
