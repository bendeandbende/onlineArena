const express = require('express');
const characterController = require('../controllers/characterController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(characterController.getAllCharacters)
  .post(authController.restrictTo('user'), characterController.createCharacter);

router
  .route('/:id')
  .get(characterController.getCharacter)
  .patch(
    authController.restrictTo('admin'),
    characterController.updateCharacter
  )
  .delete(
    authController.restrictTo('admin'),
    characterController.deleteCharacter
  );

module.exports = router;
