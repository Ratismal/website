'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('game_keys', 'expiry', {
      type: Sequelize.DATE,
      defaultValue: null,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('game_keys', 'expiry');
  }
};
