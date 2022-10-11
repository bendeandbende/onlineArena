const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A weapon needs a name'],
    },
    avaible: [{ type: mongoose.Schema.ObjectId, ref: 'Hero' }],
    dmg: {
      type: String,
      default: 0,
    },
    hitRate: {
      type: String,
      required: [true, 'A weapon needs hit rate'],
    },
  },
  {
    toJSON: { virtauls: true },
    toObject: { virtuals: true },
  }
);

const Weapon = mongoose.model('Weapon', weaponSchema);

module.exports = Weapon;
