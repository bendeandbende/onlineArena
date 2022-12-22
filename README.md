## ~~FE has been deployed for the game, check it out at https://bb-onlinearena.netlify.app~~ The server is currently down.

### Online Arena game

Sign up / log in, create characters and make them battle in the arena!
With this end-points you can do it all.

It includes:

- Users, stored in mongoDB
- Authorization
- Characters stored in mongoDB
- Heroes (hero classes, e.g warrior, priest...), abilities, weapons, also stored in mongoDB
- Make a character fight a random enemy (among the other characters!). The random enemy will be within a range of 2 levels to your character.

#### About the arena

This is where the battle takes place. It handles the announcements, deciding who attacks first (randomized in this version) and declaring the victor.
The arena's tournament method gets called in the battle controller (through the battle route).

The heroes have abilities (e.g Mage has Fire Storm, it gives them +20 base damage for one round). The chance of the ability to activate is 10% as of right now (see battleConfig.js).

Two other things are included in the battleCongfig.js file: a limit for rounds, this is capped at 50 here, and a "visualizer" for EXP (experience points). The level of the characters are stored in fractions (so a level 2 character halfway to level 3 is level 2.5). Since getting 0.5 level worth of EXP would sound boring in a game, this gets multiplied by a configurable number. This way it'll be written like the following in the game: Bendus got 123 EXP! 256EXP till next level.

### About database

Database is in mongoDB. Users, characters, weapons, abilities and heroes are stored here.
Certain abilities and certain weapons can be used by certain heroes only. E.g a Bow can be used by an Archer only in this version. It's stored in the weapon's "avaible" property, the mondoDB hero ID's are stored here as an array. A sword can be used by any hero, so it's "avaible" property stores all (current) heroes database id's.

### Characters

A character stores its name, level, weapon and hero. With these pieces of information and by populazing them, through the battle route - in the battle controller - a new hero is created by the Hero class.

The stats get adjusted by their (rounded down) level. This makes it easy to adjust the game anytime since the stats are stored in the heroes, not in the characters. So in case the warrior hero turns out to be too strong, we don't have to adjust all the warrior characters, we can just modify the warrior hero in the database.

The constructor includes a maxHP property, too. This is in case someone heals themself it shouldn't go above the maximum health points.

### API calls

The most important API calls:

#### Users

- Log in. POST '/api/v1/users/login'. It expects a name and a password. This send back a token which is used for authorization.

```json
{
  "name": "<USERNAME>",
  "password": "<PASSWORD>"
}
```

- Sign up. POST '/api/v1/users/signup'. Same as login, but also expects a confirmPassword prop.

```json
{
  "name": "<USERNAME>",
  "password": "<PASSWORD>",
  "passwordConfirm": "<PASSWORD>"
}
```

- Get me. GET '/api/v1/users/me'. With a valid bearer token, this sends back the current user.

#### Characters

- Get character. GET 'api/v1/characters/<CHARACTER_ID>'. Send back a character populated in the hero, hero's ability and weapon fields. This is restricted to users.

```json
{
  "status": "succes",
  "data": {
    "data": {
      "_id": "<CHARACTER_ID>",
      "firstName": "Bende",
      "hero": {
        "_id": "<HERO_ID>",
        "name": "Warrior",
        "hp": 100,
        "ability": {
          "_id": "<ABILITY_ID>",
          "name": "Armour Boost",
          "stat": "armour",
          "boost": 10,
          "__v": 0
        },
        "armour": 5,
        "evasion": 20,
        "dmg": 0,
        "__v": 0
      },
      "level": <LEVEL>,
      "createdAt": "<DATE_IT_WAS_CREATED_AT>",
      "weapon": {
        "_id": "<WEAPON_ID>",
        "name": "Battle Axe",
        "avaible": ["<HERO_IDS>"],
        "dmg": "<DAMAGE_IN_RANGE_FORMAT>",
        "hitRate": "<HIT_RATE>",
        "__v": 0
      },
      "__v": 0
    }
  }
}
```

- Create character. POST '/api/v1/characters'. Needs a users logged in to reach this route. When creating a character, it'll be automatically added to the user. Expects:

```json
{
  "firstName": "<NAME>",
  "hero": "<HERO_ID>",
  "weapon": "<WEAPON_ID>"
}
```

Character will be level 1 automatically.

#### Battle

- Battle random opponent. PATCH '/api/v1/battle/<CHARACTER_ID>'. Onyl the owner of the character can use it. This API call make the character fight with a random opponent, in case it wins, the level will get updated. Send back the rounds of the battle.

### Summary

That's it for the time being. You sign up, create characters and let them battle, level up. There's no level cap so go crazy.
