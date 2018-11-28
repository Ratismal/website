module.exports = (sequelize, DataTypes) => {
  let model = sequelize.define('dnd_character', {
    username: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    race: {
      type: DataTypes.STRING,
      allowNull: false
    },
    male: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    alignment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    class: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      default: []
    },
    ideals: {
      type: DataTypes.STRING(400)
    },
    bonds: {
      type: DataTypes.STRING(400)
    },
    flaws: {
      type: DataTypes.STRING(400)
    },
    statStrength: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      default: [0]
    },
    statDexterity: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      default: [0]
    },
    statConstitution: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      default: [0]
    },
    statIntelligence: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      default: [0]
    },
    statWisdom: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      default: [0]
    },
    statCharisma: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      default: [0]
    },
    story: {
      type: DataTypes.TEXT,
      default: ''
    },
    customAttributes: {
      type: DataTypes.JSON,
      default: {}
    }
  });

  model.associate = models => {
  };

  return model;
};
