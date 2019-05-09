module.exports = (sequelize, Sequelize) => {
  let model = sequelize.define('worklog', {
    date: {
      type: Sequelize.DATEONLY,
      primaryKey: true,
      allowNull: false
    },

    completed: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    todo: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    issues: {
      type: Sequelize.TEXT
    },
    blocking: {
      type: Sequelize.TEXT
    },
    extra: {
      type: Sequelize.TEXT
    }
  });

  model.associate = models => {
  };

  return model;
};
