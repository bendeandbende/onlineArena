const catchAsync = require('../utils/catchAsync');

const Arena = require('../Arena/Arena');
const Hero = require('../Arena/Hero');
const Character = require('../models/characterModel');
const AppError = require('../utils/appError');

const getRandNum = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

exports.battleRandom = catchAsync(async (req, res, next) => {
  const character = await Character.findById(req.params.id);

  if (!req.user.characters.some((char) => char._id.equals(character._id))) {
    return next(new AppError('This is not your character', 401));
  }

  const challenger = new Hero(character);

  const numOfCharacters = await Character.countDocuments();
  const enemyCharacterIndex = getRandNum(0, numOfCharacters - 1 - 1);
  const enemyCharacter = await Character.findOne({
    _id: {
      $ne: req.params.id,
    },
  }).skip(enemyCharacterIndex);

  const characterLevelRounded = Math.floor(character.level);
  enemyCharacter.level =
    characterLevelRounded < 5
      ? characterLevelRounded
      : getRandNum(characterLevelRounded - 2, characterLevelRounded + 2);

  const enemy = new Hero(enemyCharacter);

  const result = Arena.tournament(challenger, enemy);

  if (result.victory) {
    character.level = challenger.level;
    character.save();
  }

  res.status(200).json({
    status: 'success',
    result,
  });
});
