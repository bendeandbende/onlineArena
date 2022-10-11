const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'An ability needs a name'],
    },
    stat: {
      type: String,
      required: [true, 'An ability needs a stat to buff'],
    },
    boost: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtauls: true },
    toObject: { virtuals: true },
  }
);

const Ability = mongoose.model('Ability', abilitySchema);

module.exports = Ability;
