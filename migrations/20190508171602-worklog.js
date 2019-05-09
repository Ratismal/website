'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('worklogs', {
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
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('worklogs');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
