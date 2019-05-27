'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('worklogs', 'completed', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.changeColumn('worklogs', 'todo', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('worklogs', 'completed', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.changeColumn('worklogs', 'todo', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  }
};
