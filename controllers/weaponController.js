const Weapon = require('../models/WeaponModel');
const factory = require('./handlerFactory');

exports.getAllWeapons = factory.getAll(Weapon);
exports.getWeapon = factory.getOne(Weapon);
exports.createWeapon = factory.createOne(Weapon);
exports.updateWeapon = factory.updateOne(Weapon);
exports.deleteWeapon = factory.deleteOne(Weapon);
