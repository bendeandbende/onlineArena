const randomNumberInRange = require('./helpers/randomNumberInRange');

module.exports = class {
  constructor(character) {
    const levelRounded = Math.floor(character.level);
    const weapon = character.weapon.avaible.includes(character.hero._id)
      ? character.weapon
      : '';
    const [minDmg, maxDmg] = weapon ? weapon.dmg.split('-') : [0, 0];

    this.firstName = character.firstName;
    this.level = character.level;
    this.name = character.hero.name;

    this.hp = character.hero.hp * levelRounded;
    this.maxHp = character.hero.hp * levelRounded;
    this.ability = character.hero.ability;
    this.ability.boost *= levelRounded;
    this.armour = character.hero.armour * levelRounded;
    this.evasion = character.hero.evasion;

    this.weapon = weapon.name;
    this.hitrate = weapon.hitRate;
    this.dmg = `${minDmg * levelRounded}-${maxDmg * levelRounded}`; // adjusting damage to level

    this.buffed = false;
  }

  attack(enemy) {
    const initialDmg = randomNumberInRange(this.dmg);
    const chanceToEvade = Math.min(enemy.evasion, 100) / 100;
    const chanceToMiss = (100 - Math.min(parseFloat(this.hitRate), 100)) / 100;

    if (Math.random() <= chanceToEvade || Math.random() <= chanceToMiss) return;

    enemy.hp -= Math.max(initialDmg - Math.floor(enemy.armour / 3), 0); 

    return initialDmg; 
  }

  buff() {
    if (this.ability.stat === 'dmg') {
      const [minDmg, maxDmg] = this.dmg.split('-');

      this[this.ability.stat] = `${+minDmg + this.ability.boost}-${
        +maxDmg + this.ability.boost
      }`;

    } else if (this.ability.stat === 'hp') {
      this[this.ability.stat] = Math.min(
        this[this.ability.stat] + this.ability.boost,
        this.maxHp
      );
    } else {
      this[this.ability.stat] += this.ability.boost;
    }

    this.buffed = true;
  }

  buffReverse() {
    if (!this.buffed || this.ability.stat === 'hp') return; 

    if (this.ability.stat === 'dmg') {
      const [minDmg, maxDmg] = this.dmg.split('-');

      this[this.ability.stat] = `${+minDmg - this.ability.boost}-${
        +maxDmg - this.ability.boost
      }`;
    } else {
      this[this.ability.stat] -= this.ability.boost;
    }

    this.buffed = false;
  }

  addEXP(enemyLevel) {
    const initialLevel = this.level;
    const levelGap = Math.max(enemyLevel - Math.floor(initialLevel), 1);

    const EXP = Math.round((levelGap / Math.floor(initialLevel)) * 100) / 100;

    const updatedLevel = initialLevel + EXP;

    this.level = updatedLevel;

    const tillNextLevel =
      (Math.floor(updatedLevel) + 1 - updatedLevel) * Math.floor(updatedLevel);

    return { EXP, tillNextLevel };
  }
};
