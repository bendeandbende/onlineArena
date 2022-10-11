const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'A character needs a name'],
      unique: true,
    },
    hero: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hero',
    },
    level: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    weapon: {
      type: mongoose.Schema.ObjectId,
      ref: 'Weapon',
    },
  },
  {
    toJSON: { virtauls: true },
    toObject: { virtuals: true },
  }
);

characterSchema.pre(/^find/, function (next) {
  this.populate('hero').populate('weapon');
  next();
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
