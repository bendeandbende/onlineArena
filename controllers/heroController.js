const Hero = require('../models/heroModel');
const factory = require('./handlerFactory');

exports.getAllHeroes = factory.getAll(Hero);
exports.getHero = factory.getOne(Hero);
exports.createHero = factory.createOne(Hero);
exports.updateHero = factory.updateOne(Hero);
exports.deleteHero = factory.deleteOne(Hero);
