'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('game_keys', {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      link: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING,
        unique: true
      },
      meta: {
        type: Sequelize.JSON
      },
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      appId: {
        type: Sequelize.INTEGER
      },
      headerImage: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('game_keys');
  }
};
