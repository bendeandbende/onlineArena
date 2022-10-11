const Character = require('../models/characterModel');
const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllCharacters = factory.getAll(Character);
exports.getCharacter = factory.getOne(Character);

exports.updateCharacter = factory.updateOne(Character);
exports.deleteCharacter = factory.deleteOne(Character);

exports.createCharacter = catchAsync(async (req, res, next) => {
  req.body.level = 1;
  const doc = await Character.create(req.body);
  const user = await User.findById(req.user.id);

  await user.update({ characters: [...user.characters, doc._id] });

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
