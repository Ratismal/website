'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dnd_characters', 'notes', {
      type: Sequelize.TEXT,
      defaultValue: ""
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dnd_characters', 'notes');
  }
};
