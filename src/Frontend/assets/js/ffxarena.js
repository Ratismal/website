
function getClass(c) {
  if (c <= 0) {
    return 'c-none';
  } else if (c > 0 && c <= 3) {
    return 'c-low';
  } else if (c > 3 && c <= 8) {
    return 'c-mid';
  } else if (c > 8 && c <= 14) {
    return 'c-high';
  } else return 'c-perfect';
}
export default class Data {
  constructor() {
    this.monsters = {};
    this.locations = {};
    this.types = {};
    this.sConquest = {};

    this.initializeDefault();
  }

  add(monster, type) {
    let m;
    if (type) {
      m = new Monster(monster, type);
    } else m = monster;
    if (!this.monsters[m.name]) this.monsters[m.name] = m;
    if (!this.types[m.type]) this.types[m.type] = {};
    if (!this.types[m.type][m.name]) this.types[m.type][m.name] = m;
    return m;
  }

  addArea(area) {
    this.locations[area.name] = area;
    return area;
  }

  addSConquest(name, quantity, type) {
    this.sConquest[name] = { type, quantity };
  }

  serialize() {
    return JSON.stringify(Object.values(this.monsters));
  }

  deserialize(input) {
    const monsters = JSON.parse(input);
    for (const m of monsters) {
      if (this.monsters[m.name]) this.monsters[m.name].count = m.count;
    }
  }

  initializeDefault() {
    let d = this;
    d.addArea(new Area(d, "Besaid"))
      .add("Dingo", Type.LUPINE)
      .add("Condor", Type.BIRD)
      .add("Water Flan", Type.FLAN);
    d.addArea(new Area(d, "Kilika Woods"))
      .add("Dinonix", Type.REPTILE)
      .add("Killer Bee", Type.WASP)
      .add("Yellow Elemental", Type.ELEMENTAL)
      .add("Ragora", Type.PLANT);
    d.addArea(
      new Area(
        d,
        "Mi'ihen Highroad",
        "Ipirias, Thunder Flan, and Vouivre generally only appear along the Oldroad (the lower road north of the inn). Mi'ihen Fang, Raldo, and White Element generally only appear on the highroad and new road."
      )
    )
      .add("Mi'ihen Fang", Type.LUPINE)
      .add("Ipiria", Type.REPTILE)
      .add("Floating Eye", Type.EYE)
      .add("White Elemental", Type.ELEMENTAL)
      .add("Raldo", Type.HELM)
      .add("Vouivre", Type.DRAKE)
      .add("Bomb", Type.BOMB)
      .add("Dual Horn", Type.RUMINANT)
      .add("Thunder Flan", Type.FLAN);
    d.addArea(
      new Area(
        d,
        "Mushroom Rock",
        "Thunder Flans also appear along Mi'ihen Oldroad."
      )
    )
      .add("Raptor", Type.REPTILE)
      .add("Gandarewa", Type.IMP)
      .add("Thunder Flan", Type.FLAN)
      .add("Red Elemental", Type.ELEMENTAL)
      .add("Lamashtu", Type.RUMINANT)
      .add("Funguar", Type.FUNGUS)
      .add("Garuda", Type.ROC);
    d.addArea(
      new Area(
        d,
        "Djose Road",
        "Simurghs and Basilisks generally only appear along the road leading away from the Battle Site. Ochus only appear along the road between the fork and the Moonflow. Ochus are most easily found on the first road leading to Moonflow, just before the exit to the next area."
      )
    )
      .add("Garm", Type.LUPINE)
      .add("Simurgh", Type.BIRD)
      .add("Bite Bug", Type.WASP)
      .add("Snow Flan", Type.FLAN)
      .add("Bunyip", Type.HELM)
      .add("Basilisk", Type.BASILISK)
      .add("Ochu", Type.OCHU);
    d.addArea(
      new Area(
        d,
        "Thunder Plains",
        "Iron Giants only appear in the northern section of the plains, and Cactuars appear more frequently after you've prayed at the Qactuar stones."
      )
    )
      .add("Melusine", Type.REPTILE)
      .add("Aerouge", Type.IMP)
      .add("Buer", Type.EYE)
      .add("Gold Element", Type.ELEMENTAL)
      .add("Kusariqqu", Type.DRAKE)
      .add("Larva", Type.LARVA)
      .add("Iron Giant", Type.IRON_GIANT)
      .add("Qactuar", Type.CACTUAR);
    d.addArea(
      new Area(
        d,
        "Macalania",
        "Snow Wolves, Evil Eyes, Ice Flans and Mafdets appear in the Lake section, whereas the rest in the Forest part."
      )
    )
      .add("Snow Wolf", Type.LUPINE)
      .add("Iguion", Type.REPTILE)
      .add("Wasp", Type.WASP)
      .add("Evil Eye", Type.EYE)
      .add("Ice Flan", Type.FLAN)
      .add("Blue Element", Type.ELEMENTAL)
      .add("Murussu", Type.HELM)
      .add("Mafdet", Type.HELM)
      .add("Xiphos", Type.BLADE)
      .add("Chimera", Type.CHIMERA);
    d.addArea(
      new Area(
        d,
        "Bikanel",
        "Sand Worms and Zus appear more often in Sanubia Desert - Central on the left portion of the map. Cactuars appear throughout but are the rarest. By the time you collect all the Sand Worms and Cactuars, you'll most likely have captured 10 of everything else."
      )
    )
      .add("Sand Wolf", Type.LUPINE)
      .add("Alcyone", Type.BIRD)
      .add("Mushussu", Type.DRAKE)
      .add("Zu", Type.ROC)
      .add("Sand Worm", Type.WORM)
      .add("Cactuar", Type.CACTUAR);
    d.addArea(
      new Area(
        d,
        "Calm Lands",
        "Ogres, Anacondaurs and Malboros appear more often in the northwest."
      )
    )
      .add("Skoll", Type.LUPINE)
      .add("Nebiros", Type.WASP)
      .add("Flame Flan", Type.FLAN)
      .add("Shred", Type.HELM)
      .add("Anacondaur", Type.BASILISK)
      .add("Ogre", Type.OGRE)
      .add("Coeurl", Type.COEURL)
      .add("Chimera Brain", Type.CHIMERA)
      .add("Malboro", Type.MALBORO);
    d.addArea(
      new Area(
        d,
        "Sunken Cave",
        `Cavern of the Stolen Fayth.

The Nidhogg and Imp also appear on Mt. Gagazet, and Tonberries are quite rare (search in the green room right before entering The Chamber of the Fayth to find the highest encounter rate.)

Another place used to capture Tonberry's successfully can be found as follows: From the entrance, follow the path all the way until the first fork, then turn Right down the hall to the room with the treasure chest on the left that contains a Megalixir. Walk straight to the back of the room until you are off the mini-map. There is a little pocket off of the map where you can run small circles, and the encounter rate for Tonberries is high.`
      )
    )
      .add("Yowie", Type.REPTILE)
      .add("Imp", Type.IMP)
      .add("Dark Element", Type.ELEMENTAL)
      .add("Nidhogg", Type.DRAKE)
      .add("Thorn", Type.FUNGUS)
      .add("Valaha", Type.RUMINANT)
      .add("Epaaj", Type.BLADE)
      .add("Ghost", Type.REVENANT)
      .add("Tonberry", Type.TONBERRY);
    d.addArea(
      new Area(
        d,
        "Mt. Gagazet",
        ` Bashuras, Ahrimans, Grendels, Mandragoras, Dark Flans, and Behemoths also appear in Zanarkand Ruins, otherwise they are only encountered inside Mt. Gagazet.

Splashers, Achelouses and Maelspikes are encountered in the underwater sections of Mt. Gagazet.`
      )
    )
      .add("Bandersnatch", Type.LUPINE)
      .add("Ahriman", Type.EYE)
      .add("Dark Flan", Type.FLAN)
      .add("Grenade", Type.BOMB)
      .add("Grat", Type.PLANT)
      .add("Grendel", Type.RUMINANT)
      .add("Bashura", Type.OGRE)
      .add("Mandragora", Type.PLANT)
      .add("Behemoth", Type.BEHEMOTH)
      .add("Splasher", Type.NONE)
      .add("Achelous", Type.HAIZHE)
      .add("Maelspike", Type.DINOFISH)
      .add("Imp", Type.IMP)
      .add("Nidhogg", Type.DRAKE);
    d.addArea(
      new Area(
        d,
        "Inside Sin",
        `Demonoliths, Great Malboros and Barbatoses are only encountered in the "City of the Dead" section of Sin (Entrance).

Geminis always come in pairs, one of them carries a sword, the other a club. Both count as a unique fiend, so you have to capture both types in order to complete the list.

Wraiths, Geminis (both), Demonoliths, Great Malboros and Adamantoises are also encountered in Omega Dungeon, and captured there count towards Inside Sin.`
      )
    )
      .add("Exoray", Type.FUNGUS)
      .add("Wraith", Type.REVENANT)
      .add("Gemini Blue", Type.IRON_GIANT)
      .add("Gemini Red", Type.IRON_GIANT)
      .add("Demonolith", Type.DOOMSTONE)
      .add("Great Malboro", Type.MALBORO)
      .add("Barbatos", Type.ARMOR)
      .add("Adamantoise", Type.ADAMANTOISE)
      .add("Behemoth King", Type.BEHEMOTH);
    d.addArea(
      new Area(
        d,
        "Omega Ruins",
        `Great Malboros will appear here; however, unlike the ones inside Sin, these will always ambush you and their first move is always Bad Breath, so watch out. You can also use a First Strike Weapon on a character that has Provoke which will stop the Great Malboro using Bad Breath

Demonoliths counter with Pharaoh's Curse, which inflicts poison, curse, darkness, silence, so use Hastega and Quick Hit, OR use silence attack/silence buster; they cant cast Pharaoh's when silenced. They will use Breath to petrify your party, so equip stoneproof. Adamantoises will appear here too, more often on the second area of the ruins (the series of platforms leading to Omega Weapon).

Watch out for the Master Tonberry's everything-counter, Karma. Use Tidus or Rikku to avoid a 1-hit KO. Hastega and Auto-Pheonix are vital.

In the North American version and HD Remaster on Omega Dungeons' fiends list there are no Demonolith, Gemini or Wraith (all of these captured in Omega Ruins counts as 'Inside Sin' as well as Great Malboro and Adamantoise).`
      )
    )
      .add("Zaurus", Type.REPTILE)
      .add("Floating Death", Type.EYE)
      .add("Black Element", Type.ELEMENTAL)
      .add("Halma", Type.HELM)
      .add("Puroboros", Type.BOMB)
      .add("Spirit", Type.LARVA)
      .add("Machea", Type.BLADE)
      .add("Master Coeurl", Type.COEURL)
      .add("Master Tonberry", Type.TONBERRY)
      .add("Varuna", Type.SPELLSPINNER)
      .add("Demonolith", Type.DOOMSTONE)
      .add("Gemini", Type.IRON_GIANT)
      .add("Wraith", Type.REVENANT);

    d.addSConquest("Fenrir", 3, Type.LUPINE);
    d.addSConquest("Ornitholestes", 3, Type.REPTILE);
    d.addSConquest("Pteryx", 4, Type.BIRD);
    d.addSConquest("Hornet", 4, Type.WASP);
    d.addSConquest("Vidatu", 4, Type.IMP);
    d.addSConquest("One-Eye", 4, Type.EYE);
    d.addSConquest("Jumbo Flan", 3, Type.FLAN);
    d.addSConquest("Nega Elemental", 3, Type.ELEMENTAL);
    d.addSConquest("Tanket", 3, Type.HELM);
    d.addSConquest("Fafnir", 4, Type.DRAKE);
    d.addSConquest("Sleep Sprout", 5, Type.FUNGUS);
    d.addSConquest("Bomb King", 5, Type.BOMB);
    d.addSConquest("Juggernaut", 5, Type.RUMINANT);
    d.addSConquest("Ironclad", 10, Type.IRON_GIANT);
  }
}

class Area {
  constructor(data, name, note = "") {
    this.data = data;

    this.name = name;
    this.monsters = {};
    this.note = note;

    this.data.locations[name] = this;
  }

  get class() {
    let lowest = Object.values(this.monsters).reduce((acu, cur) => Math.min(acu, cur.count), 15);
    return getClass(lowest);
  }

  add(monster, type) {
    let m = this.data.add(monster, type);
    this.monsters[m.name] = m;
    return this;
  }
}

class Monster {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.count = 0;
  }

  get class() {
    let c = ['monster'];

    c.push(getClass(this.count));

    return c;
  }


  increment() {
    // this.count++;
    this.count = Math.min(15, this.count + 1);
  }
  decrement() {
    // this.count--;
    this.count = Math.max(0, this.count - 1);
  }
}

const Type = {
  LUPINE: "lupine",
  BIRD: "bird",
  FLAN: "flan",
  REPTILE: "reptile",
  WASP: "wasp",
  ELEMENTAL: "elemental",
  PLANT: "plant",
  EYE: "evil eye",
  HELM: "helm",
  DRAKE: "drake",
  BOMB: "bomb",
  RUMINANT: "ruminant",
  IMP: "imp",
  FUNGUS: "fungus",
  ROC: "roc",
  BASILISK: "basilisk",
  OCHU: "ochu",
  LARVA: "larva",
  IRON_GIANT: "iron giant",
  CACTUAR: "cactuar",
  BLADE: "blade",
  CHIMERA: "chimera",
  WORM: "worm",
  OGRE: "ogre",
  COEURL: "coeurl",
  MALBORO: "malboro",
  REVENANT: "revenant",
  TONBERRY: "tonberry",
  BEHEMOTH: "behemoth",
  NONE: "none",
  HAIZHE: "haizhe",
  DINOFISH: "dinofish",
  DOOMSTONE: "doomstone",
  ARMOR: "armor",
  ADAMANTOISE: "adamantoise",
  SPELLSPINNER: "spellspinner"
};