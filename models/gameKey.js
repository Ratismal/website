module.exports = (sequelize, DataTypes) => {
  let model = sequelize.define('game_key', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    key: {
      type: DataTypes.STRING,
      unique: true
    },
    appId: {
      type: DataTypes.INTEGER
    },
    meta: {
      type: DataTypes.JSON
    },
    headerImage: {
      type: DataTypes.STRING
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  model.associate = models => {
  };

  return model;
};
