const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'A hero class needs a name'],
    },
    hp: {
      type: Number,
      required: [true, 'A hero class needs hp'],
    },
    ability: {
      type: mongoose.Schema.ObjectId,
      ref: 'Ability',
      required: [true, 'Review must belong to a user.'],
    },
    armour: {
      type: Number,
      required: [true, 'A hero class needs armour'],
    },
    evasion: {
      type: Number,
      required: [true, 'A hero class needs evasion '],
    },
    dmg: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtauls: true },
    toObject: { virtuals: true },
  }
);

heroSchema.pre(/^find/, function (next) {
  this.populate('ability');

  next();
});

const Hero = mongoose.model('Hero', heroSchema);

module.exports = Hero;
