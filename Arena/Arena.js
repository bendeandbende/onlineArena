const config = require('./battleConfig');

module.exports = {
  abilityChance: config.ABILITY_ACTIVATION_CHANCE,
  roundLimit: config.ROUND_LIMIT,
  EXPConverter: config.EXP_VISUALIZER,

  state: {
    announcer: '',
    round: 1,
    summary: { prep: '', rounds: [], end: '' },
    winner: '',
    victory: false,
  },

  initRound(fighter1, fighter2) {
    this.clearAnnouncer();
    fighter1.buffReverse();
    fighter2.buffReverse();
    this.state.round++;
  },

  announce() {
    this.state.summary.rounds.push(this.state.announcer);
  },

  addToAnnouncer(text) {
    this.state.announcer += text + '\n';
  },

  clearAnnouncer() {
    this.state.announcer = '';
  },

  clearState() {
    this.clearAnnouncer();
    this.state.round = 1;
    this.state.summary.rounds = [];
    this.state.summary.prep = '';
    this.state.summary.end = '';
    this.state.winner = '';
    this.state.victory = false;
  },

  declareWinner(winner, loser) {
    this.clearAnnouncer();
    this.addToAnnouncer(`${winner.firstName} defeated ${loser.firstName}!`);
    this.state.winner = winner.firstName;
  },

  handleEXP(challenger, enemyLevel) {
    const initialLevel = challenger.level;
    const { EXP, tillNextLevel } = challenger.addEXP(enemyLevel);

    const goodLookingEXP = Math.round(EXP * this.EXPConverter * initialLevel);

    this.addToAnnouncer(`${challenger.firstName} got ${goodLookingEXP} EXP!`);

    if (Math.floor(challenger.level) > Math.floor(initialLevel)) {
      this.addToAnnouncer(
        `Level up! ${challenger.firstName} reached level ${Math.floor(
          challenger.level
        )},`
      );
    }

    this.addToAnnouncer(
      `${
        Math.floor(tillNextLevel * this.EXPConverter) || 1
      } EXP till next level.`
    );
  },

  tournament(challenger, enemy) {
    this.state.summary.prep = `${challenger.firstName} (lvl. ${Math.floor(
      challenger.level
    )}), the mighty ${challenger.name} holding the legendary ${
      challenger.weapon
    } is facing ${enemy.firstName} (lvl. ${enemy.level}), the ${
      enemy.name
    } who's known to how to hold the lethal ${enemy.weapon}.\n`;

    this.fight(challenger, enemy);

    if (this.state.winner === challenger.firstName) {
      this.state.victory = true;

      this.addToAnnouncer(
        `What a glorius victory! *Final Fantasy VI victory soundtrack playing in the background*`
      );

      this.handleEXP(challenger, enemy.level);
    }

    this.state.summary.end = this.state.announcer;

    const { victory } = { ...this.state };
    const summary = { ...this.state.summary };
    this.clearState();

    return { summary, victory };
  },

  buffByChance(fighter) {
    if (Math.random() < this.abilityChance) {
      const { name: abilityName, stat, boost } = fighter.ability;

      fighter.buff();

      this.addToAnnouncer(
        `${fighter.firstName} activated the ability ${abilityName}. It gave ${fighter.firstName} +${boost} ${stat}, now it's ${fighter[stat]}.`
      );
    }
  },

  attackingPhase(attacker, defender) {
    const initialDefenderHp = defender.hp;
    this.buffByChance(attacker);

    const initialDmg = attacker.attack(defender);

    this.addToAnnouncer(`${defender.firstName} has ${initialDefenderHp} HP.`);

    if (+attacker.dmg.split('-')[1] === initialDmg && initialDmg !== 0) {
      this.addToAnnouncer(`CRITICAL HIT!`);
    }

    if (!initialDmg) {
      this.addToAnnouncer(`${attacker.firstName} missed!`);
    } else if (initialDefenderHp - initialDmg < defender.hp) {
      this.addToAnnouncer(
        `${attacker.firstName} was about to hit ${initialDmg}. Due to ${
          defender.firstName
        }'s thick armour, the damage was only ${
          initialDefenderHp - defender.hp
        }.`
      );
    } else {
      this.addToAnnouncer(
        `${attacker.firstName} hit ${defender.firstName} with ${initialDmg}. Due to ${defender.firstName}'s weak armour, the damage didn't get reduced.`
      );
    }

    this.addToAnnouncer(
      `Now ${defender.firstName} has ${defender.hp} HP, losing ${
        initialDefenderHp - defender.hp
      } HP! \n`
    );
  },

  fight(fighter1, fighter2) {
    const [firstToAttack, secondToAttack] = [fighter1, fighter2].sort(() =>
      Math.random() < 0.5 ? -1 : 1
    );

    if (!fighter1.weapon || !fighter2.weapon) {
      this.addToAnnouncer(
        `Round ${this.state.round} is about to... \n WAIT! Someone's left their weapon home! True champions won't fight without weapons, match's over. \n`
      );
      return this.announce();
    }

    this.addToAnnouncer(`Round ${this.state.round} is about to begin \n`);
    this.addToAnnouncer(`${firstToAttack.firstName} is attacking first.`);

    this.attackingPhase(firstToAttack, secondToAttack);

    if (secondToAttack.hp <= 0) {
      this.announce();
      return this.declareWinner(firstToAttack, secondToAttack);
    }

    this.addToAnnouncer(`${secondToAttack.firstName} is attacking now.`);
    this.attackingPhase(secondToAttack, firstToAttack);

    if (firstToAttack.hp <= 0) {
      this.announce();
      return this.declareWinner(secondToAttack, firstToAttack);
    }

    if (this.state.round === this.roundLimit) {
      this.announce();
      this.state.summary.end = `DING-DONG, the battle is over! ${firstToAttack.firstName} and ${secondToAttack.firstName} has fought enough, they have proven themselves as true champions. They are both winners! (Or losers?)`;
      return;
    }

    this.announce();

    this.initRound(fighter1, fighter2);
    this.fight(fighter1, fighter2);
  },
};
