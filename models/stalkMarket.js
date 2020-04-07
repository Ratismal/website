module.exports = (sequelize, DataTypes) => {
  let model = sequelize.define('stalk_market', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    // yeah terrible but w/e
    data: {
      type: DataTypes.JSON
    }
  });

  model.associate = models => {
  };

  return model;
};
